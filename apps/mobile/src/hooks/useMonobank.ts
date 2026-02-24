import api from '~/src/lib/api';
import type {
  ApiResponse,
  MonobankStatusResponse,
  MonobankConnectRequest,
  MonobankConnectResponse,
  MonobankAccountsUpdateRequest,
  MonobankAccountsUpdateResponse,
  MonobankSyncRequestInput,
  MonobankSyncResponse,
} from '@bit-chain/api-contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const MONOBANK_QUERY_KEY = ['monobank', 'status'] as const;

/**
 * Fetches Monobank integration status and accounts list.
 */
export function useMonobankStatus() {
  return useQuery({
    queryKey: MONOBANK_QUERY_KEY,
    queryFn: async (): Promise<MonobankStatusResponse> => {
      const { data } = await api.get<ApiResponse<MonobankStatusResponse>>(
        '/integrations/monobank'
      );
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
    staleTime: 60_000,
  });
}

/**
 * Connects Monobank with an API token.
 * On success, invalidates the status query to refetch.
 */
export function useMonobankConnect() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: MonobankConnectRequest): Promise<MonobankConnectResponse> => {
      const { data } = await api.post<ApiResponse<MonobankConnectResponse>>(
        '/integrations/monobank/connect',
        request
      );
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MONOBANK_QUERY_KEY });
    },
  });
}

/**
 * Updates import enabled status for Monobank accounts.
 * On success, invalidates status and dashboard queries.
 */
export function useMonobankAccountsUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      request: MonobankAccountsUpdateRequest
    ): Promise<MonobankAccountsUpdateResponse> => {
      const { data } = await api.patch<ApiResponse<MonobankAccountsUpdateResponse>>(
        '/integrations/monobank/accounts',
        request
      );
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MONOBANK_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

/**
 * Triggers a Monobank sync.
 * On success, invalidates dashboard and monobank queries.
 */
export function useMonobankSync() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: MonobankSyncRequestInput = {}): Promise<MonobankSyncResponse> => {
      const { data } = await api.post<ApiResponse<MonobankSyncResponse>>(
        '/integrations/monobank/sync',
        request
      );
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: MONOBANK_QUERY_KEY });
    },
  });
}
