const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY || '';
const PERPLEXITY_API_BASE_URL = process.env.PERPLEXITY_API_BASE_URL || 'https://api.perplexity.ai';
const PERPLEXITY_DEFAULT_MODEL = process.env.PERPLEXITY_DEFAULT_MODEL || 'sonar-pro';

export interface SearchResult {
  success: boolean;
  answer?: string;
  sources?: string[];
  error?: string;
}

export async function searchWithPerplexity(query: string): Promise<SearchResult> {
  if (!PERPLEXITY_API_KEY) {
    return {
      success: false,
      error: 'Perplexity API key not configured',
    };
  }

  try {
    const response = await fetch(`${PERPLEXITY_API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: PERPLEXITY_DEFAULT_MODEL,
        messages: [
          {
            role: 'user',
            content: query,
          },
        ],
        temperature: 0.2,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.statusText}`);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content;

    return {
      success: true,
      answer,
      sources: data.citations || [],
    };
  } catch (error) {
    console.error('Perplexity search error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function findRelatedFeeds(topic: string): Promise<SearchResult> {
  const query = `Find the best RSS feeds and blogs about ${topic}. List 5-10 high-quality sources with their RSS feed URLs.`;
  return searchWithPerplexity(query);
}

export async function explainArticle(title: string, content: string): Promise<SearchResult> {
  const query = `Explain this article in simple terms and provide context:

Title: ${title}

Content: ${content.slice(0, 2000)}`;
  
  return searchWithPerplexity(query);
}
