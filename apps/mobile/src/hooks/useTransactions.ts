import type {
  ApiResponse,
  TransactionByIdResponse,
  TransactionListItem,
  TransactionsListResponse,
  TransactionsQuery,
  TransactionType,
} from '@bit-chain/api-contracts';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { z } from 'zod';
import { ACCOUNTS_QUERY_KEY } from '~/src/hooks/useAccounts';
import { DASHBOARD_QUERY_KEY } from '~/src/hooks/useDashboard';
import api from '~/src/lib/api';
import { QUERY_CONFIG } from '~/src/lib/constants';

export const TRANSACTIONS_QUERY_KEY = ['transactions', 'list'] as const;
export const TRANSACTION_BY_ID_QUERY_KEY = ['transactions', 'by-id'] as const;
const TRANSACTION_BY_ID_FALLBACK_PAGE_SIZE = 50;
const TRANSACTION_BY_ID_FALLBACK_MAX_PAGES = 40;
const TRANSACTION_MUTATION_TIMEOUT_MS = 60_000;

function extractMutationErrorMessage(error: unknown, fallbackMessage: string): string {
  if (isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return `Request timeout (${TRANSACTION_MUTATION_TIMEOUT_MS / 1000}s). Please retry.`;
    }

    const responseData = error.response?.data;
    if (typeof responseData === 'object' && responseData !== null) {
      const candidate = responseData as Record<string, unknown>;
      const detailsField = candidate.details;
      if (Array.isArray(detailsField) && detailsField.length > 0) {
        const first = detailsField[0];
        if (typeof first === 'object' && first !== null) {
          const detailsIssue = first as Record<string, unknown>;
          const detailsMessage = detailsIssue.message;
          const detailsPath = Array.isArray(detailsIssue.path)
            ? detailsIssue.path.filter(item => typeof item === 'string' || typeof item === 'number')
            : [];

          if (typeof detailsMessage === 'string' && detailsMessage.trim()) {
            return detailsPath.length > 0
              ? `${detailsPath.join('.')}: ${detailsMessage}`
              : detailsMessage;
          }
        }
      }

      const errorField = candidate.error;

      if (typeof errorField === 'string' && errorField.trim()) {
        return errorField;
      }

      if (typeof errorField === 'object' && errorField !== null) {
        const nestedMessage = (errorField as Record<string, unknown>).message;
        if (typeof nestedMessage === 'string' && nestedMessage.trim()) {
          return nestedMessage;
        }
      }

      const messageField = candidate.message;
      if (typeof messageField === 'string' && messageField.trim()) {
        return messageField;
      }
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
}

function mapMutationTransactionToListItem(payload: unknown): TransactionListItem | null {
  if (typeof payload !== 'object' || payload === null) return null;
  if (!('transaction' in payload)) return null;
  const transaction = payload.transaction;
  if (typeof transaction !== 'object' || transaction === null) return null;

  const source = transaction as Record<string, unknown>;
  const account = source.account as Record<string, unknown> | undefined;
  const category = source.category as Record<string, unknown> | null | undefined;
  const transferTo = source.transferTo as Record<string, unknown> | null | undefined;

  if (
    typeof source.id !== 'string' ||
    typeof source.amount !== 'number' ||
    (source.type !== 'INCOME' && source.type !== 'EXPENSE' && source.type !== 'TRANSFER') ||
    typeof source.currency !== 'string' ||
    typeof source.accountId !== 'string'
  ) {
    return null;
  }

  const dateValue = source.date;
  const dateString =
    typeof dateValue === 'string'
      ? dateValue
      : dateValue instanceof Date
        ? dateValue.toISOString()
        : null;
  if (!dateString) return null;

  const accountName = typeof account?.name === 'string' ? account.name : '';
  if (!accountName) return null;

  return {
    id: source.id,
    amount: source.amount,
    type: source.type,
    description: typeof source.description === 'string' ? source.description : null,
    date: dateString,
    currency: source.currency,
    accountId: source.accountId,
    accountName,
    categoryId: typeof source.categoryId === 'string' ? source.categoryId : null,
    categoryName: typeof category?.name === 'string' ? category.name : null,
    categoryColor: typeof category?.color === 'string' ? category.color : null,
    transferToId: typeof source.transferToId === 'string' ? source.transferToId : null,
    transferToAccountName: typeof transferTo?.name === 'string' ? transferTo.name : null,
    transferAmount: typeof source.transferAmount === 'number' ? source.transferAmount : null,
    transferCurrency: typeof source.transferCurrency === 'string' ? source.transferCurrency : null,
  };
}

async function fetchTransactionByIdViaList(transactionId: string): Promise<TransactionListItem> {
  let page = 1;
  let hasMore = true;
  let pagesLoaded = 0;

  while (hasMore && pagesLoaded < TRANSACTION_BY_ID_FALLBACK_MAX_PAGES) {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(TRANSACTION_BY_ID_FALLBACK_PAGE_SIZE),
    });

    const { data } = await api.get<ApiResponse<TransactionsListResponse>>(
      `/transactions?${params.toString()}`,
    );
    if (!data.ok) throw new Error(data.error.code);

    const found = data.data.transactions.find(transaction => transaction.id === transactionId);
    if (found) {
      return found;
    }

    hasMore = data.data.hasMore;
    page += 1;
    pagesLoaded += 1;
  }

  throw new Error('TRANSACTION_NOT_FOUND');
}

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

/**
 * Fetches a single transaction by ID.
 *
 * @param id - Transaction ID.
 */
export function useTransactionById(id?: string) {
  return useQuery({
    queryKey: [...TRANSACTION_BY_ID_QUERY_KEY, id] as const,
    queryFn: async (): Promise<TransactionByIdResponse['transaction']> => {
      if (!id) {
        throw new Error('MISSING_TRANSACTION_ID');
      }

      try {
        const { data } = await api.get<ApiResponse<TransactionByIdResponse>>(`/transactions/${id}`);
        if (!data.ok) throw new Error(data.error.code);
        return data.data.transaction;
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          return fetchTransactionByIdViaList(id);
        }
        throw error;
      }
    },
    enabled: Boolean(id),
    staleTime: QUERY_CONFIG.STALE_TIME_DEFAULT,
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

export type CreateTransactionPayload = z.input<typeof createTransactionSchema>;

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

      try {
        const { data } = await api.post<ApiResponse<unknown>>('/transactions', apiPayload, {
          timeout: TRANSACTION_MUTATION_TIMEOUT_MS,
        });
        if (data && 'ok' in data && data.ok === false) {
          throw new Error(data.error.message || data.error.code);
        }
        return data;
      } catch (error) {
        throw new Error(extractMutationErrorMessage(error, 'Failed to create transaction'));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TRANSACTION_BY_ID_QUERY_KEY });
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

      try {
        const { data } = await api.put<ApiResponse<unknown>>('/transactions', apiPayload, {
          timeout: TRANSACTION_MUTATION_TIMEOUT_MS,
        });
        if (data && 'ok' in data && data.ok === false) {
          throw new Error(data.error.message || data.error.code);
        }
        return data;
      } catch (error) {
        throw new Error(extractMutationErrorMessage(error, 'Failed to update transaction'));
      }
    },
    onSuccess: (response, payload) => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TRANSACTION_BY_ID_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });

      const mapped = mapMutationTransactionToListItem(response);
      if (mapped && payload.id) {
        queryClient.setQueryData([...TRANSACTION_BY_ID_QUERY_KEY, payload.id], mapped);
      }
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const { data } = await api.delete<ApiResponse<unknown>>(`/transactions?id=${id}`, {
          timeout: TRANSACTION_MUTATION_TIMEOUT_MS,
        });
        if (data && 'ok' in data && data.ok === false) {
          throw new Error(data.error.message || data.error.code);
        }
        return data;
      } catch (error) {
        throw new Error(extractMutationErrorMessage(error, 'Failed to delete transaction'));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TRANSACTION_BY_ID_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });
}
