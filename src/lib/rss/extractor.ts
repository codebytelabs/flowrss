import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

export interface ExtractionResult {
  success: boolean;
  title?: string;
  content?: string;
  textContent?: string;
  excerpt?: string;
  byline?: string;
  length?: number;
  error?: string;
}

export async function extractFullContent(url: string): Promise<ExtractionResult> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'FlowRSS/1.0 (https://flowrss.app)',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const html = await response.text();
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      return {
        success: false,
        error: 'Failed to extract readable content',
      };
    }

    return {
      success: true,
      title: article.title,
      content: article.content,
      textContent: article.textContent,
      excerpt: article.excerpt,
      byline: article.byline,
      length: article.length,
    };
  } catch (error) {
    console.error('Content extraction error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown extraction error',
    };
  }
}

export async function batchExtractContent(
  urls: string[],
  onProgress?: (completed: number, total: number) => void
): Promise<Map<string, ExtractionResult>> {
  const results = new Map<string, ExtractionResult>();
  
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const result = await extractFullContent(url);
    results.set(url, result);
    
    if (onProgress) {
      onProgress(i + 1, urls.length);
    }
    
    // Rate limiting - wait 100ms between requests
    if (i < urls.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
}

export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
