import { useQuery, useQueryClient } from '@tanstack/react-query';

interface UseCacheOptions<T> {
  key: string;
  initialData?: T;
}

const TIMEOUT = 1000 * 60 * 60 * 24;

export function useCache<T>({ key, initialData }: UseCacheOptions<T>) {
  const queryClient = useQueryClient();

  const { data } = useQuery<T>({
    queryKey: ['cache', key],
    queryFn: () => initialData ?? (null as T),
    initialData,
    gcTime: TIMEOUT,
    staleTime: TIMEOUT,
  });

  const setCache = (newData: T) => {
    queryClient.setQueryData(['cache', key], newData);
  };

  return { data, setCache };
}
