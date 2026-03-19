import type {
  ApiResponse,
  MonobankAccountsUpdateRequest,
  MonobankAccountsUpdateResponse,
  MonobankConnectRequest,
  MonobankConnectResponse,
  MonobankStatusResponse,
  MonobankSyncRequestInput,
  MonobankSyncResponse,
} from '@bit-chain/api-contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import api from '~/src/lib/api';
import { MONOBANK_QUERY_KEY } from '~/src/lib/query-keys';

const CHAIN_DELAY_MS = 65_000;

export function useMonobankStatus() {
  return useQuery({
    queryKey: MONOBANK_QUERY_KEY,
    queryFn: async (): Promise<MonobankStatusResponse> => {
      const { data } = await api.get<ApiResponse<MonobankStatusResponse>>('/integrations/monobank');
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
    staleTime: 60_000,
  });
}

export function useMonobankConnect() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: MonobankConnectRequest): Promise<MonobankConnectResponse> => {
      const { data } = await api.post<ApiResponse<MonobankConnectResponse>>(
        '/integrations/monobank/connect',
        request,
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
      request: MonobankAccountsUpdateRequest,
    ): Promise<MonobankAccountsUpdateResponse> => {
      const { data } = await api.patch<ApiResponse<MonobankAccountsUpdateResponse>>(
        '/integrations/monobank/accounts',
        request,
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

export function useMonobankSync() {
  const queryClient = useQueryClient();
  const mutateRef = useRef<((v?: MonobankSyncRequestInput) => void) | null>(null);

  const mutation = useMutation({
    mutationFn: async (request: MonobankSyncRequestInput = {}): Promise<MonobankSyncResponse> => {
      const { data } = await api.post<ApiResponse<MonobankSyncResponse>>(
        '/integrations/monobank/sync',
        request,
      );
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
    onSuccess: async (response, variables) => {
      queryClient.invalidateQueries({ queryKey: MONOBANK_QUERY_KEY });
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['dashboard'] }),
        queryClient.refetchQueries({ queryKey: ['accounts'] }),
        queryClient.refetchQueries({ queryKey: ['transactions'] }),
      ]);

      const remaining = response.remainingAccounts ?? 0;
      if (remaining > 0 && response.synced && mutateRef.current) {
        setTimeout(() => {
          mutateRef.current?.({ ...variables, force: false });
        }, CHAIN_DELAY_MS);
      }
    },
  });

  mutateRef.current = mutation.mutate as (v?: MonobankSyncRequestInput) => void;
  return mutation;
}
