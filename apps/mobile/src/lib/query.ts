import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { QUERY_CONFIG, STORAGE_KEYS } from './constants';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_CONFIG.STALE_TIME_DEFAULT,
      gcTime: QUERY_CONFIG.MAX_CACHE_AGE,
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10_000),
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

/**
 * AsyncStorage persister for offline read cache.
 * Writes the full query cache to AsyncStorage on every mutation.
 * Max cache age: 24 hours (stale data is shown while revalidating).
 */
export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: STORAGE_KEYS.QUERY_CACHE,
  throttleTime: 1000,
});
