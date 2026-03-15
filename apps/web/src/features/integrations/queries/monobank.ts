import { accountKeys } from '@/features/finance/queries/accounts';
import { transactionKeys } from '@/features/finance/queries/transactions';
import axiosInstance from '@/lib/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

  return useMutation({
    mutationFn: async (payload: MonobankAccountsUpdatePayload) => {
      const { data } = await axiosInstance.patch('/integrations/monobank/accounts', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monobankKeys.all });
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
    },
  });
}

export function useMonobankSync() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload?: {
      reason?: string;
      force?: boolean;
      fromDate?: Date;
      limit?: number;
    }) => {
      const { data } = await axiosInstance.post('/integrations/monobank/sync', payload ?? {});
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monobankKeys.all });
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}
