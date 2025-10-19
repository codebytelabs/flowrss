import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import type { Feed } from '@/types';

export interface OPMLFeed {
  text: string;
  title?: string;
  xmlUrl: string;
  htmlUrl?: string;
  type?: string;
  category?: string;
}

export interface OPMLOutline {
  '@_text'?: string;
  '@_title'?: string;
  '@_xmlUrl'?: string;
  '@_htmlUrl'?: string;
  '@_type'?: string;
  outline?: OPMLOutline | OPMLOutline[];
}

export function parseOPML(opmlContent: string): OPMLFeed[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
  });

  const result = parser.parse(opmlContent);
  const feeds: OPMLFeed[] = [];

  function extractFeeds(outline: OPMLOutline | OPMLOutline[], category?: string) {
    const outlines = Array.isArray(outline) ? outline : [outline];

    for (const item of outlines) {
      if (item['@_xmlUrl']) {
        // This is a feed
        feeds.push({
          text: item['@_text'] || item['@_title'] || 'Untitled',
          title: item['@_title'] || item['@_text'],
          xmlUrl: item['@_xmlUrl'],
          htmlUrl: item['@_htmlUrl'],
          type: item['@_type'],
          category,
        });
      } else if (item.outline) {
        // This is a category/folder
        const categoryName = item['@_text'] || item['@_title'];
        extractFeeds(item.outline, categoryName);
      }
    }
  }

  if (result.opml?.body?.outline) {
    extractFeeds(result.opml.body.outline);
  }

  return feeds;
}

export function generateOPML(feeds: Feed[]): string {
  const groupedFeeds = feeds.reduce((acc, feed) => {
    const category = feed.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(feed);
    return acc;
  }, {} as Record<string, Feed[]>);

  const outlines = Object.entries(groupedFeeds).map(([category, categoryFeeds]) => ({
    '@_text': category,
    '@_title': category,
    outline: categoryFeeds.map(feed => ({
      '@_text': feed.title,
      '@_title': feed.title,
      '@_type': 'rss',
      '@_xmlUrl': feed.url,
      '@_htmlUrl': feed.link || '',
    })),
  }));

  const opmlStructure = {
    '?xml': {
      '@_version': '1.0',
      '@_encoding': 'UTF-8',
    },
    opml: {
      '@_version': '2.0',
      head: {
        title: 'FlowRSS Feeds',
        dateCreated: new Date().toUTCString(),
      },
      body: {
        outline: outlines,
      },
    },
  };

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    format: true,
  });

  return builder.build(opmlStructure);
}

export function downloadOPML(opmlContent: string, filename: string = 'flowrss-feeds.opml') {
  const blob = new Blob([opmlContent], { type: 'text/xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function readOPMLFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      resolve(content);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
