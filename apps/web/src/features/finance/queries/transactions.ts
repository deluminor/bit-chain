import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import type {
  CategoryFilters,
  CreateTransactionData,
  TransactionFilters,
  TransactionImportPreviewResponse,
  TransactionImportRequestItem,
  TransactionResponse,
  UpdateTransactionData,
} from './transactions.types';

export type {
  CategoryFilters,
  CreateTransactionData,
  Transaction,
  TransactionCategory,
  TransactionFilters,
  TransactionImportPreviewItem,
  TransactionImportPreviewResponse,
  TransactionImportRequestItem,
  TransactionResponse,
  UpdateTransactionData,
} from './transactions.types';

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
    placeholderData: keepPreviousData,
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

export function usePreviewTransactionImport() {
  return useMutation({
    mutationFn: async (payload: {
      file: File;
      accountId: string;
      incomeCategoryId: string;
      expenseCategoryId: string;
    }): Promise<TransactionImportPreviewResponse> => {
      const formData = new FormData();
      formData.append('file', payload.file);
      formData.append('accountId', payload.accountId);
      formData.append('incomeCategoryId', payload.incomeCategoryId);
      formData.append('expenseCategoryId', payload.expenseCategoryId);

      const { data } = await axios.post('/api/finance/transactions/import/preview', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
  });
}

export function useImportTransactions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { accountId: string; items: TransactionImportRequestItem[] }) => {
      const { data } = await axios.post('/api/finance/transactions/import', payload);
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
