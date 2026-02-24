import { useQuery } from '@tanstack/react-query';
import { getCryptoData, type CryptoData } from '../api/crypto';

export function useCryptoData() {
  return useQuery<CryptoData[]>({
    queryKey: ['crypto'],
    queryFn: getCryptoData,
    refetchInterval: 6 * 10_000,
  });
}
