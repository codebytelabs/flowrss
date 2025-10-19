import Parser from 'rss-parser';
import type { ParsedFeed, ParsedArticle } from '@/types';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'FlowRSS/1.0 (https://flowrss.app)',
    'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml',
  },
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
      ['content:encoded', 'contentEncoded'],
    ],
  },
});

export interface FeedParseResult {
  success: boolean;
  feed?: ParsedFeed;
  error?: string;
  metadata?: {
    title?: string;
    description?: string;
    link?: string;
    imageUrl?: string;
  };
}

export async function parseFeedUrl(url: string): Promise<FeedParseResult> {
  try {
    // Use API proxy when running in browser to avoid CORS issues
    const isBrowser = typeof window !== 'undefined';
    let feed;
    
    if (isBrowser) {
      // Fetch through our API proxy
      const response = await fetch('/api/rss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const xmlText = await response.text();
      feed = await parser.parseString(xmlText);
    } else {
      // Server-side: fetch directly
      feed = await parser.parseURL(url);
    }
    
    const metadata = {
      title: feed.title,
      description: feed.description,
      link: feed.link,
      imageUrl: feed.image?.url || feed.itunes?.image,
    };

    const parsedFeed: ParsedFeed = {
      title: feed.title,
      description: feed.description,
      link: feed.link,
      image: feed.image,
      items: feed.items.map(item => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        creator: item.creator || (item as any)['dc:creator'],
        content: item.content || item.contentEncoded || (item as any)['content:encoded'],
        contentSnippet: item.contentSnippet,
        guid: item.guid || (item as any).id,
        categories: item.categories,
        isoDate: item.isoDate,
      })),
    };

    return {
      success: true,
      feed: parsedFeed,
      metadata,
    };
  } catch (error) {
    console.error('Feed parsing error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown parsing error',
    };
  }
}

export async function validateFeedUrl(url: string): Promise<boolean> {
  try {
    const result = await parseFeedUrl(url);
    return result.success;
  } catch {
    return false;
  }
}

export function extractImageFromContent(content?: string): string | undefined {
  if (!content) return undefined;
  
  const imgRegex = /<img[^>]+src="([^">]+)"/i;
  const match = content.match(imgRegex);
  return match?.[1];
}

export function sanitizeContent(content: string): string {
  // Basic sanitization - remove scripts and dangerous tags
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '');
}
