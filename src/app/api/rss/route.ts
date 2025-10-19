import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    console.log('[RSS API] Fetching feed:', url);
    
    // Fetch the RSS feed with proper headers
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'FlowRSS/1.0 (RSS Reader)',
        'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml, */*',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error('[RSS API] HTTP error:', response.status, response.statusText);
      return NextResponse.json(
        { error: `HTTP ${response.status}: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const xmlText = await response.text();
    console.log('[RSS API] Fetched XML, length:', xmlText.length);
    
    // Return the raw XML - let the client parse it
    return new NextResponse(xmlText, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('[RSS API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RSS feed: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
