import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Types
export interface FinanceAccount {
  id: string;
  name: string;
  type: 'CASH' | 'BANK_CARD' | 'SAVINGS' | 'INVESTMENT';
  currency: string;
  balance: number;
  isActive: boolean;
  color?: string;
  icon?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    transactions: number;
  };
}

export interface CreateAccountData {
  name: string;
  type: FinanceAccount['type'];
  currency: string;
  balance?: number;
  color?: string;
  icon?: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateAccountData extends Partial<CreateAccountData> {
  id: string;
}

export interface AccountStats {
  overview: {
    totalAccounts: number;
    activeAccounts: number;
    totalBalances: Record<string, number>;
    recentTransactions30Days: number;
  };
  byAccountType: Array<{
    type: string;
    count: number;
    totalBalance: number;
    averageBalance: number;
  }>;
  byCurrency: Array<{
    currency: string;
    accountCount: number;
    totalBalance: number;
  }>;
  highlights: {
    highestBalance: {
      id: string;
      name: string;
      balance: number;
      currency: string;
    } | null;
    lowestBalance: {
      id: string;
      name: string;
      balance: number;
      currency: string;
    } | null;
    mostActiveAccount: FinanceAccount | null;
  };
  distribution: {
    accountTypes: Record<string, number>;
    currencies: Record<string, number>;
  };
}

// Query keys
export const accountKeys = {
  all: ['finance', 'accounts'] as const,
  lists: () => [...accountKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...accountKeys.lists(), filters] as const,
  details: () => [...accountKeys.all, 'detail'] as const,
  detail: (id: string) => [...accountKeys.details(), id] as const,
  stats: () => [...accountKeys.all, 'stats'] as const,
};

// Hooks
export function useAccounts(includeInactive = false) {
  return useQuery({
    queryKey: accountKeys.list({ includeInactive }),
    queryFn: async () => {
      const { data } = await axios.get('/api/finance/accounts', {
        params: { includeInactive },
      });
      return data;
    },
  });
}

export function useAccount(accountId: string, includeTransactions = false, transactionLimit = 10) {
  return useQuery({
    queryKey: accountKeys.detail(accountId),
    queryFn: async () => {
      const { data } = await axios.get(`/api/finance/accounts/${accountId}`, {
        params: {
          includeTransactions,
          limit: transactionLimit,
        },
      });
      return data.account;
    },
    enabled: !!accountId,
  });
}

export function useAccountStats() {
  return useQuery({
    queryKey: accountKeys.stats(),
    queryFn: async () => {
      const { data } = await axios.get('/api/finance/accounts/stats');
      return data as AccountStats;
    },
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (accountData: CreateAccountData) => {
      const { data } = await axios.post('/api/finance/accounts', accountData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
    },
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (accountData: UpdateAccountData) => {
      const { data } = await axios.put('/api/finance/accounts', accountData);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
      queryClient.invalidateQueries({ queryKey: accountKeys.detail(variables.id) });
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, force = false }: { id: string; force?: boolean }) => {
      const { data } = await axios.delete('/api/finance/accounts', {
        params: { id, force },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
    },
  });
}

export function useAccountAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      action,
      amount,
    }: {
      id: string;
      action: 'activate' | 'deactivate' | 'adjustBalance';
      amount?: number;
    }) => {
      const { data } = await axios.patch(`/api/finance/accounts/${id}`, {
        action,
        amount,
      });
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
      queryClient.invalidateQueries({ queryKey: accountKeys.detail(variables.id) });
    },
  });
}
