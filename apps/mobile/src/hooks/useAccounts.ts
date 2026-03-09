import type { AccountsListResponse, ApiResponse } from '@bit-chain/api-contracts';
import { useQuery } from '@tanstack/react-query';
import api from '~/src/lib/api';
import { QUERY_CONFIG } from '~/src/lib/constants';

export const ACCOUNTS_QUERY_KEY = ['accounts', 'list'] as const;

export interface UseAccountsOptions {
  includeInactive?: boolean;
}

/**
 * Fetches the list of all accounts from /api/mobile/accounts.
 * Returns total balance, account count, and a per-account breakdown.
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useAccounts();
 * ```
 */
export function useAccounts(options?: UseAccountsOptions) {
  return useQuery({
    queryKey: [...ACCOUNTS_QUERY_KEY, options] as const,
    queryFn: async (): Promise<AccountsListResponse> => {
      const params = new URLSearchParams();
      if (options?.includeInactive) {
        params.set('includeInactive', 'true');
      }

      const query = params.toString();
      const { data } = await api.get<ApiResponse<AccountsListResponse>>(
        `/accounts${query ? `?${query}` : ''}`,
      );
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
    staleTime: QUERY_CONFIG.STALE_TIME_DEFAULT,
  });
}
