import {
  UpdateMobileAccountResponseSchema,
  type AccountsListResponse,
  type ApiResponse,
  type UpdateMobileAccountInput,
  type UpdateMobileAccountResponse,
} from '@bit-chain/api-contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '~/src/lib/api';
import { QUERY_CONFIG } from '~/src/lib/constants';
import { ACCOUNTS_QUERY_KEY } from '~/src/lib/query-keys';

export { ACCOUNTS_QUERY_KEY };

export interface UseAccountsOptions {
  includeInactive?: boolean;
}

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

export function useUpdateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateMobileAccountInput): Promise<UpdateMobileAccountResponse> => {
      const { data } = await api.patch<ApiResponse<UpdateMobileAccountResponse>>(
        '/accounts',
        input,
      );
      if (!data.ok) throw new Error(data.error.code);
      return UpdateMobileAccountResponseSchema.parse(data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });
}
