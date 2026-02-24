import axiosInstance from '@/lib/axios';

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  last_updated: string;
}

export async function getCryptoData() {
  const { data } = await axiosInstance.get<{ data: CryptoData[] }>('/crypto');
  return data.data;
}

export interface NewsItem {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  coin?: string;
}

export async function getCryptoNews() {
  const { data } = await axiosInstance.get<{ data: NewsItem[] }>('/crypto/news');
  return data.data;
}
