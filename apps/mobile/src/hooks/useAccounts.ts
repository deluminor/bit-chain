import api from '~/src/lib/api';
import type { ApiResponse, AccountsListResponse } from '@bit-chain/api-contracts';
import { useQuery } from '@tanstack/react-query';
import { QUERY_CONFIG } from '~/src/lib/constants';

export const ACCOUNTS_QUERY_KEY = ['accounts', 'list'] as const;

/**
 * Fetches the list of all accounts from /api/mobile/accounts.
 * Returns total balance, account count, and a per-account breakdown.
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useAccounts();
 * ```
 */
export function useAccounts() {
  return useQuery({
    queryKey: ACCOUNTS_QUERY_KEY,
    queryFn:  async (): Promise<AccountsListResponse> => {
      const { data } = await api.get<ApiResponse<AccountsListResponse>>('/accounts');
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
    staleTime: QUERY_CONFIG.STALE_TIME_DEFAULT,
  });
}
