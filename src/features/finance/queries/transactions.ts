import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

// Types
export interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  amount: number;
  currency: string;
  description?: string;
  date: string;
  tags: string[];
  isRecurring: boolean;
  recurringPattern?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  createdAt: string;
  updatedAt: string;
  account: {
    id: string;
    name: string;
    type: string;
    currency: string;
    color?: string;
    icon?: string;
  };
  category: {
    id: string;
    name: string;
    color: string;
    icon: string;
    type: 'INCOME' | 'EXPENSE';
  };
  transferTo?: {
    id: string;
    name: string;
    type: string;
    currency: string;
  };
  transferAmount?: number; // Amount received in destination account for transfers
  transferCurrency?: string; // Currency of destination account
}

export interface TransactionCategory {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  parentId?: string;
  loanId?: string | null;
  color: string;
  icon: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  parent?: {
    id: string;
    name: string;
    color: string;
  };
  children?: TransactionCategory[];
  _count: {
    transactions: number;
    children: number;
  };
}

export interface CreateTransactionData {
  accountId: string;
  categoryId: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  amount: number;
  currency?: string;
  description?: string;
  date?: string;
  tags?: string[];
  transferToId?: string;
  transferAmount?: number; // Amount received in destination account
  transferCurrency?: string; // Currency of destination account
  isRecurring?: boolean;
  recurringPattern?: Transaction['recurringPattern'];
}

export interface UpdateTransactionData extends Partial<CreateTransactionData> {
  id: string;
}

export interface TransactionFilters {
  type?: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  accountId?: string;
  categoryId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minAmount?: number;
  maxAmount?: number;
}

export interface TransactionResponse {
  transactions: Transaction[];
  summary: {
    income: number;
    expenses: number;
    transfers: number;
    totalTransactions: number;
    incomeCount: number;
    expenseCount: number;
    transferCount: number;
    maxIncome: number;
    maxExpense: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Query keys
export const transactionKeys = {
  all: ['finance', 'transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (filters: TransactionFilters & { page?: number; limit?: number }) =>
    [...transactionKeys.lists(), filters] as const,
  infinite: (filters: TransactionFilters) => [...transactionKeys.all, 'infinite', filters] as const,
  categories: ['finance', 'categories'] as const,
  categoriesList: (filters: CategoryFilters) => [...transactionKeys.categories, filters] as const,
};

// Transactions hooks
export function useTransactions(
  filters: TransactionFilters & { page?: number; limit?: number } = {},
) {
  return useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: async (): Promise<TransactionResponse> => {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      const { data } = await axios.get('/api/finance/transactions', { params });
      return data;
    },
  });
}

export function useInfiniteTransactions(filters: TransactionFilters = {}) {
  return useInfiniteQuery({
    queryKey: transactionKeys.infinite(filters),
    queryFn: async ({ pageParam = 1 }): Promise<TransactionResponse> => {
      const params = new URLSearchParams();

      Object.entries({ ...filters, page: pageParam }).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      const { data } = await axios.get('/api/finance/transactions', { params });
      return data;
    },
    getNextPageParam: lastPage => {
      const { page, pages } = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionData: CreateTransactionData) => {
      const { data } = await axios.post('/api/finance/transactions', transactionData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      // Also invalidate accounts to update balances
      queryClient.invalidateQueries({ queryKey: ['finance', 'accounts'] });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionData: UpdateTransactionData) => {
      const { data } = await axios.put('/api/finance/transactions', transactionData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: ['finance', 'accounts'] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete('/api/finance/transactions', {
        params: { id },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: ['finance', 'accounts'] });
    },
  });
}

// Categories hooks
export function useTransactionCategories(
  type?: 'INCOME' | 'EXPENSE' | 'TRANSFER',
  includeInactive = false,
  hierarchical = false,
) {
  return useQuery({
    queryKey: transactionKeys.categoriesList({ type, includeInactive, hierarchical }),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (includeInactive) params.append('includeInactive', 'true');
      if (hierarchical) params.append('hierarchical', 'true');

      const { data } = await axios.get('/api/finance/categories', { params });
      return data;
    },
  });
}

export function useCreateTransactionCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryData: {
      name: string;
      type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
      parentId?: string;
      color: string;
      icon: string;
      isDefault?: boolean;
    }) => {
      const { data } = await axios.post('/api/finance/categories', categoryData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.categories });
    },
  });
}

export function useUpdateTransactionCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryData: {
      id: string;
      name?: string;
      color?: string;
      icon?: string;
      isActive?: boolean;
    }) => {
      const { data } = await axios.put('/api/finance/categories', categoryData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.categories });
    },
  });
}

export function useDeleteTransactionCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete('/api/finance/categories', {
        params: { id },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.categories });
    },
  });
}

export interface CategoryFilters {
  type?: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  includeInactive?: boolean;
  hierarchical?: boolean;
}
