import { NextResponse } from 'next/server';

// CryptoPanic API base URL
const CRYPTOPANIC_API_URL = 'https://cryptopanic.com/api/v1/posts/';
// Get API key from environment variables
const CRYPTOPANIC_API_KEY = process.env.CRYPTOPANIC_API_KEY || '';

// Define types for CryptoPanic API responses
interface CryptoPanicCurrency {
  code: string;
  title: string;
  slug: string;
  url: string;
}

interface CryptoPanicSource {
  title: string;
  region: string;
  domain: string;
}

interface CryptoPanicNewsItem {
  id: number;
  title: string;
  published_at: string;
  url: string;
  source?: CryptoPanicSource;
  currencies?: CryptoPanicCurrency[];
}

interface CryptoPanicResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CryptoPanicNewsItem[];
}

// Our application's news format
interface NewsItem {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  coin: string;
}

// Helper function to determine coin from title and currencies
function determineCoin(item: CryptoPanicNewsItem): string {
  // First check currencies array
  if (item.currencies && item.currencies.length > 0) {
    const currency = item.currencies[0];
    if (currency && currency.code) {
      const code = currency.code.toLowerCase();
      if (code === 'btc') return 'bitcoin';
      if (code === 'eth') return 'ethereum';
    }
  }

  // If no match in currencies, check title
  const title = item.title.toLowerCase();

  // Check for Ethereum mentions first (to avoid matching "bitcoin" in "ethereum" related news)
  if (title.includes('ethereum') || title.includes('eth ')) {
    return 'ethereum';
  }

  // Then check for Bitcoin
  if (title.includes('bitcoin') || title.includes('btc ')) {
    return 'bitcoin';
  }

  return 'other';
}

// Helper function to truncate title
function truncateTitle(title: string, maxLength: number = 100): string {
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength) + '...';
}

export async function GET(request: Request) {
  try {
    // Check if API key is available
    if (!CRYPTOPANIC_API_KEY) {
      throw new Error('CryptoPanic API key is not set in environment variables');
    }

    const { searchParams: _searchParams } = new URL(request.url);
    // Explicitly request both BTC and ETH news
    const currencies = 'BTC,ETH';

    const apiUrl = `${CRYPTOPANIC_API_URL}?auth_token=${CRYPTOPANIC_API_KEY}&currencies=${currencies}&public=true`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`CryptoPanic API responded with status: ${response.status}`);
    }

    const data = (await response.json()) as CryptoPanicResponse;

    const news: NewsItem[] = data.results.map(item => {
      let sourceTitle = 'CryptoPanic';
      if (item.source && item.source.title) {
        sourceTitle = item.source.title;
      }

      return {
        title: truncateTitle(item.title),
        url: item.url,
        source: sourceTitle,
        publishedAt: item.published_at,
        coin: determineCoin(item),
      };
    });

    return NextResponse.json({ data: news });
  } catch (error) {
    console.error('Error fetching crypto news from CryptoPanic:', error);

    // Fallback to mock data if API fails
    const mockNews: NewsItem[] = [];

    return NextResponse.json({ data: mockNews });
  }
}
