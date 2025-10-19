import { parseFeedUrl } from './parser';
import { dbOperations } from '@/lib/db/schema';
import type { Feed, Article } from '@/types';

export interface FetchResult {
  success: boolean;
  newArticles: number;
  updatedArticles: number;
  error?: string;
}

export async function fetchFeedUpdates(
  feed: Feed,
  extractFullText: boolean = false
): Promise<FetchResult> {
  try {
    const result = await parseFeedUrl(feed.url);
    
    if (!result.success || !result.feed) {
      await dbOperations.updateFeed(feed.id, {
        errorCount: feed.errorCount + 1,
        lastError: result.error,
        lastFetched: new Date(),
      });
      
      return {
        success: false,
        newArticles: 0,
        updatedArticles: 0,
        error: result.error,
      };
    }

    // Get existing articles for this feed
    const existingArticles = await dbOperations.getArticlesByFeed(feed.id);
    const existingLinks = new Set(existingArticles.map(a => a.link));

    let newArticles = 0;
    let updatedArticles = 0;

    // Process new articles
    for (const item of result.feed.items) {
      if (!item.link) continue;

      if (!existingLinks.has(item.link)) {
        // Extract image from various sources
        let imageUrl: string | undefined;
        
        // Try media:content or media:thumbnail
        const mediaContent = (item as any).mediaContent || (item as any)['media:content'];
        const mediaThumbnail = (item as any).mediaThumbnail || (item as any)['media:thumbnail'];
        
        if (mediaContent?.$ && mediaContent.$.url) {
          imageUrl = mediaContent.$.url;
        } else if (mediaThumbnail?.$ && mediaThumbnail.$.url) {
          imageUrl = mediaThumbnail.$.url;
        } else if ((item as any).enclosure?.url) {
          // Try enclosure
          imageUrl = (item as any).enclosure.url;
        } else if (item.content) {
          // Extract from content HTML
          const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/i);
          if (imgMatch) {
            imageUrl = imgMatch[1];
          }
        }
        
        // New article
        await dbOperations.addArticle({
          feedId: feed.id,
          title: item.title || 'Untitled',
          link: item.link,
          description: item.contentSnippet || item.content,
          content: item.content,
          fullContent: undefined, // Will be extracted on-demand via API
          author: item.creator,
          pubDate: item.isoDate ? new Date(item.isoDate) : new Date(),
          imageUrl,
          isRead: false,
          isStarred: false,
          isSaved: false,
        });
        
        newArticles++;
      }
    }

    // Update feed metadata (preserve good titles from curated packs)
    const shouldUpdateTitle = result.metadata?.title && 
                             result.metadata.title.trim() !== '' && 
                             !result.metadata.title.toLowerCase().includes('untitled') &&
                             result.metadata.title !== 'RSS Feed';
    
    await dbOperations.updateFeed(feed.id, {
      title: shouldUpdateTitle ? result.metadata!.title : feed.title,
      description: result.metadata?.description || feed.description,
      imageUrl: result.metadata?.imageUrl || feed.imageUrl,
      lastFetched: new Date(),
      lastUpdated: new Date(),
      errorCount: 0,
      lastError: undefined,
    });

    return {
      success: true,
      newArticles,
      updatedArticles,
    };
  } catch (error) {
    console.error('Feed fetch error:', error);
    
    await dbOperations.updateFeed(feed.id, {
      errorCount: feed.errorCount + 1,
      lastError: error instanceof Error ? error.message : 'Unknown error',
      lastFetched: new Date(),
    });

    return {
      success: false,
      newArticles: 0,
      updatedArticles: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function fetchAllFeeds(
  extractFullText: boolean = false,
  onProgress?: (completed: number, total: number) => void
): Promise<Map<string, FetchResult>> {
  const feeds = await dbOperations.getAllFeeds();
  const activeFeeds = feeds.filter(f => f.isActive);
  const results = new Map<string, FetchResult>();

  for (let i = 0; i < activeFeeds.length; i++) {
    const feed = activeFeeds[i];
    const result = await fetchFeedUpdates(feed, extractFullText);
    results.set(feed.id, result);
    
    if (onProgress) {
      onProgress(i + 1, activeFeeds.length);
    }

    // Rate limiting
    if (i < activeFeeds.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return results;
}

export async function checkFeedHealth(feed: Feed): Promise<{
  status: 'healthy' | 'warning' | 'error' | 'stale';
  message?: string;
}> {
  // Check if feed hasn't been fetched in a while
  if (feed.lastFetched) {
    const hoursSinceLastFetch = (Date.now() - feed.lastFetched.getTime()) / (1000 * 60 * 60);
    if (hoursSinceLastFetch > 48) {
      return { status: 'stale', message: 'Feed not updated in 48+ hours' };
    }
  }

  // Check error count
  if (feed.errorCount > 5) {
    return { status: 'error', message: `${feed.errorCount} consecutive errors` };
  } else if (feed.errorCount > 2) {
    return { status: 'warning', message: `${feed.errorCount} recent errors` };
  }

  return { status: 'healthy' };
}
