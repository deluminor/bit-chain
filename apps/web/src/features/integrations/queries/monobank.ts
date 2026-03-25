import { accountKeys } from '@/features/finance/queries/accounts';
import { transactionKeys } from '@/features/finance/queries/transactions';
import axiosInstance from '@/lib/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';

export type IntegrationStatus = 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
export type IntegrationProvider = 'MONOBANK';
export type IntegrationAccountOwner = 'PERSONAL' | 'FOP';

export interface MonobankIntegrationAccount {
  id: string;
  name: string;
  currency: string;
  balance: number;
  accountType: string;
  maskedPan?: string | null;
  iban?: string | null;
  ownerType: IntegrationAccountOwner;
  ownerName?: string | null;
  importEnabled: boolean;
  financeAccountId?: string | null;
  lastSyncedAt?: string | null;
}

export interface MonobankIntegrationSummary {
  totalAccounts: number;
  enabledAccounts: number;
}

export interface MonobankIntegrationResponse {
  integration: {
    id: string;
    provider: IntegrationProvider;
    status: IntegrationStatus;
    lastSyncedAt?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  accounts: MonobankIntegrationAccount[];
  summary: MonobankIntegrationSummary;
  hasEnabledAccounts: boolean;
}

export interface MonobankAccountsUpdatePayload {
  accounts: Array<{
    id: string;
    name: string;
    importEnabled: boolean;
  }>;
}

export const monobankKeys = {
  all: ['integrations', 'monobank'] as const,
  detail: () => [...monobankKeys.all, 'detail'] as const,
};

export function useMonobankIntegration() {
  return useQuery({
    queryKey: monobankKeys.detail(),
    queryFn: async () => {
      const { data } =
        await axiosInstance.get<MonobankIntegrationResponse>('/integrations/monobank');
      return data;
    },
  });
}

export function useMonobankConnect() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload?: { token?: string }) => {
      const { data } = await axiosInstance.post('/integrations/monobank/connect', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monobankKeys.all });
    },
  });
}

export function useMonobankUpdateAccounts() {
  const queryClient = useQueryClient();
  const syncMutateRef = useRef<((payload?: SyncPayload) => void) | null>(null);

  const updateMutation = useMutation({
    mutationFn: async (payload: MonobankAccountsUpdatePayload) => {
      const { data } = await axiosInstance.patch('/integrations/monobank/accounts', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monobankKeys.all });
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
      // Kick off historical sync immediately after enabling accounts
      syncMutateRef.current?.({ force: true, chain: true, reason: 'post_accounts_update' });
    },
  });

  // Keep a stable ref to the sync mutate fn to avoid circular hook deps
  const syncMutation = useMutation({
    mutationFn: async (payload?: SyncPayload) => {
      const { data } = await axiosInstance.post<{
        remainingAccounts?: number;
        skipped?: boolean;
      }>('/integrations/monobank/sync', payload ?? {});
      return data;
    },
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: monobankKeys.all });
      await Promise.all([
        queryClient.refetchQueries({ queryKey: accountKeys.all }),
        queryClient.refetchQueries({ queryKey: transactionKeys.all }),
      ]);

      const remaining = data?.remainingAccounts ?? 0;
      const shouldChain = (variables?.chain ?? false) || variables?.reason === 'chain';
      if (remaining > 0 && !data?.skipped && shouldChain && syncMutateRef.current) {
        setTimeout(() => {
          syncMutateRef.current?.({ reason: 'chain', chain: true, ...variables });
        }, CHAIN_DELAY_MS);
      }
    },
  });

  syncMutateRef.current = syncMutation.mutate as (payload?: SyncPayload) => void;

  return updateMutation;
}

const CHAIN_DELAY_MS = 65_000;

type SyncPayload = {
  reason?: string;
  force?: boolean;
  fromDate?: Date;
  limit?: number;
  chain?: boolean;
};

export function useMonobankSync() {
  const queryClient = useQueryClient();
  const mutateRef = useRef<((payload?: SyncPayload) => void) | null>(null);

  const mutation = useMutation({
    mutationFn: async (payload?: SyncPayload) => {
      const { data } = await axiosInstance.post<{
        remainingAccounts?: number;
        skipped?: boolean;
      }>('/integrations/monobank/sync', payload ?? {});
      return data;
    },
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: monobankKeys.all });
      await Promise.all([
        queryClient.refetchQueries({ queryKey: accountKeys.all }),
        queryClient.refetchQueries({ queryKey: transactionKeys.all }),
      ]);

      const remaining = data?.remainingAccounts ?? 0;
      const shouldChain = (variables?.chain ?? false) || variables?.reason === 'chain';
      if (remaining > 0 && !data?.skipped && shouldChain && mutateRef.current) {
        setTimeout(() => {
          mutateRef.current?.({ reason: 'chain', chain: true, ...variables });
        }, CHAIN_DELAY_MS);
      }
    },
  });

  mutateRef.current = mutation.mutate as (payload?: SyncPayload) => void;
  return mutation;
}
