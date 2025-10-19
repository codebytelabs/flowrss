const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_API_BASE_URL = process.env.OPENROUTER_API_BASE_URL || 'https://openrouter.ai/api/v1';
const OPENROUTER_PRIMARY_MODEL = process.env.OPENROUTER_PRIMARY_MODEL || 'google/gemini-2.0-flash-lite-001';

export interface SummaryResult {
  success: boolean;
  summary?: string;
  keyPoints?: string[];
  error?: string;
}

export async function generateArticleSummary(
  title: string,
  articleContent: string,
  maxLength: number = 200
): Promise<SummaryResult> {
  if (!OPENROUTER_API_KEY) {
    return {
      success: false,
      error: 'OpenRouter API key not configured',
    };
  }

  try {
    const prompt = `Summarize the following article in ${maxLength} words or less. Focus on the main points and key takeaways.

Title: ${title}

Content: ${articleContent.slice(0, 4000)}

Provide:
1. A concise summary (${maxLength} words max)
2. 3-5 key points as bullet points`;

    const response = await fetch(`${OPENROUTER_API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://flowrss.app',
        'X-Title': 'FlowRSS',
      },
      body: JSON.stringify({
        model: OPENROUTER_PRIMARY_MODEL,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data: any = await response.json();
    const responseContent: string = data.choices?.[0]?.message?.content;

    if (!responseContent) {
      throw new Error('No content in response');
    }

    // Parse summary and key points
    const lines = responseContent.split('\n').filter((line: string) => line.trim());
    const summary = lines[0];
    const keyPoints = lines
      .slice(1)
      .filter((line: string) => line.startsWith('-') || line.startsWith('•'))
      .map((line: string) => line.replace(/^[-•]\s*/, '').trim());

    return {
      success: true,
      summary,
      keyPoints: keyPoints.length > 0 ? keyPoints : undefined,
    };
  } catch (error) {
    console.error('Summary generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function batchGenerateSummaries(
  articles: Array<{ title: string; content: string }>,
  onProgress?: (completed: number, total: number) => void
): Promise<Map<number, SummaryResult>> {
  const results = new Map<number, SummaryResult>();

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    const result = await generateArticleSummary(article.title, article.content);
    results.set(i, result);

    if (onProgress) {
      onProgress(i + 1, articles.length);
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return results;
}
