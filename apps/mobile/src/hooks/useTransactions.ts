import type {
  ApiResponse,
  TransactionsListResponse,
  TransactionsQuery,
  TransactionType,
} from '@bit-chain/api-contracts';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { ACCOUNTS_QUERY_KEY } from '~/src/hooks/useAccounts';
import { DASHBOARD_QUERY_KEY } from '~/src/hooks/useDashboard';
import api from '~/src/lib/api';
import { QUERY_CONFIG } from '~/src/lib/constants';

export const TRANSACTIONS_QUERY_KEY = ['transactions', 'list'] as const;

/**
 * Fetches a paginated, filterable list of transactions.
 *
 * @param filters - Optional query filters (type, search, page, etc.)
 *
 * @example
 * ```tsx
 * const { data } = useTransactions({ type: 'EXPENSE', page: 1 });
 * ```
 */
export function useTransactions(filters?: Partial<TransactionsQuery>) {
  return useQuery({
    queryKey: [...TRANSACTIONS_QUERY_KEY, filters] as const,
    queryFn: async (): Promise<TransactionsListResponse> => {
      const params = new URLSearchParams();

      if (filters?.page) params.set('page', String(filters.page));
      if (filters?.pageSize) params.set('pageSize', String(filters.pageSize));
      if (filters?.type) params.set('type', filters.type);
      if (filters?.accountId) params.set('accountId', filters.accountId);
      if (filters?.categoryId) params.set('categoryId', filters.categoryId);
      if (filters?.search) params.set('search', filters.search);
      if (filters?.dateFrom) params.set('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.set('dateTo', filters.dateTo);

      const query = params.toString();
      const { data } = await api.get<ApiResponse<TransactionsListResponse>>(
        `/transactions${query ? `?${query}` : ''}`,
      );
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
    staleTime: QUERY_CONFIG.STALE_TIME_DEFAULT,
    // Keep previous page data visible while the next page loads,
    // so the full-screen LoadingScreen never triggers during pagination.
    placeholderData: keepPreviousData,
  });
}

export type TransactionFilter = TransactionType | 'ALL';

export const TRANSACTION_FILTERS: ReadonlyArray<{ key: TransactionFilter; label: string }> = [
  { key: 'ALL', label: 'All' },
  { key: 'INCOME', label: 'Income' },
  { key: 'EXPENSE', label: 'Expenses' },
  { key: 'TRANSFER', label: 'Transfers' },
];

export const createTransactionSchema = z
  .object({
    accountId: z.string().min(1, 'Account is required'),
    categoryId: z.string().optional(),
    type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
    amount: z.number().positive('Amount must be greater than 0'),
    currency: z.string().min(3).max(3).optional(),
    description: z.string().max(200).optional(),
    date: z.date().optional(),
    tags: z.array(z.string()).default([]),
    transferToId: z.string().optional(),
    transferAmount: z.number().positive().optional(),
    transferCurrency: z.string().min(3).max(3).optional(),
  })
  .refine(
    data => {
      if (data.type === 'TRANSFER' && !data.transferToId) {
        return false;
      }
      return true;
    },
    {
      message: 'Destination account is required for transfers',
      path: ['transferToId'],
    },
  )
  .refine(
    data => {
      if (data.type !== 'TRANSFER' && !data.categoryId) {
        return false;
      }
      return true;
    },
    {
      message: 'Category is required',
      path: ['categoryId'],
    },
  );

export type CreateTransactionPayload = z.infer<typeof createTransactionSchema>;

export const updateTransactionSchema = createTransactionSchema.and(
  z.object({ id: z.string().min(1) }),
);

export type UpdateTransactionPayload = z.input<typeof updateTransactionSchema>;

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateTransactionPayload) => {
      // The backend expects the date as an ISO string
      const apiPayload = {
        ...payload,
        date: payload.date?.toISOString(),
      };

      const { data } = await api.post<ApiResponse<any>>('/transactions', apiPayload);
      if (data && 'error' in data && data.error) {
        throw new Error(
          typeof data.error === 'string' ? data.error : 'Failed to create transaction',
        );
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateTransactionPayload) => {
      const apiPayload = {
        ...payload,
        date: payload.date?.toISOString(),
      };

      const { data } = await api.put<ApiResponse<any>>('/transactions', apiPayload);
      if (data && 'error' in data && data.error) {
        throw new Error(
          typeof data.error === 'string' ? data.error : 'Failed to update transaction',
        );
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete<ApiResponse<any>>(`/transactions?id=${id}`);
      if (data && 'error' in data && data.error) {
        throw new Error(
          typeof data.error === 'string' ? data.error : 'Failed to delete transaction',
        );
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });
}
