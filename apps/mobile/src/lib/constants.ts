/** Base URL for all API requests. Override via EXPO_PUBLIC_API_URL. */
export const API_BASE_URL =
  process.env['EXPO_PUBLIC_API_URL'] ?? 'http://localhost:3000';

/** SecureStore keys — never store sensitive data in AsyncStorage */
export const SECURE_STORE_KEYS = {
  ACCESS_TOKEN: 'bit_chain_access_token',
  REFRESH_TOKEN: 'bit_chain_refresh_token',
} as const;

/** AsyncStorage keys for non-sensitive data */
export const STORAGE_KEYS = {
  QUERY_CACHE: 'bit_chain_query_cache',
} as const;

/** TanStack Query cache config */
export const QUERY_CONFIG = {
  /** Stale time for most queries: 2 minutes */
  STALE_TIME_DEFAULT: 2 * 60 * 1000,
  /** Stale time for dashboard: 1 minute */
  STALE_TIME_DASHBOARD: 60 * 1000,
  /** Max cache age for persister: 24 hours */
  MAX_CACHE_AGE: 24 * 60 * 60 * 1000,
} as const;
