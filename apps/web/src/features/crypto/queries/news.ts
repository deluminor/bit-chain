import { useQuery } from '@tanstack/react-query';
import { getCryptoNews, type NewsItem } from '../api/crypto';

const REFRESH_INTERVAL = 6 * 10_000 * 10;

export function useCryptoNews() {
  const {
    data: news = [],
    isLoading,
    error,
  } = useQuery<NewsItem[]>({
    queryKey: ['crypto-news'],
    queryFn: getCryptoNews,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: REFRESH_INTERVAL,
    gcTime: REFRESH_INTERVAL,
  });

  const getNewsForCoin = (coinId: string) => {
    return news.filter(item => item.coin === coinId);
  };

  return { news, getNewsForCoin, isLoading, error };
}
