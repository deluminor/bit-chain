import type {
  ApiResponse,
  CreateLoanRequest,
  LoanItem,
  LoansListResponse,
  UpdateLoanRequest,
} from '@bit-chain/api-contracts';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '~/src/lib/api';
import { queryClient } from '~/src/lib/query';

export const LOANS_QUERY_KEY = ['loans', 'list'] as const;

/**
 * Fetches all loans and debts for the authenticated user.
 *
 * @param showPaid - When true, includes fully paid loans (default: false)
 *
 * @example
 * ```tsx
 * const { data } = useLoans(showPaid);
 * const loans = data?.loans ?? [];
 * ```
 */
export function useLoans(showPaid = false) {
  return useQuery({
    queryKey: [...LOANS_QUERY_KEY, { showPaid }] as const,
    queryFn: async (): Promise<LoansListResponse> => {
      const { data } = await api.get<ApiResponse<LoansListResponse>>(
        `/loans${showPaid ? '?showPaid=true' : ''}`,
      );
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
  });
}

export function useCreateLoan() {
  return useMutation({
    mutationFn: async (payload: CreateLoanRequest): Promise<LoanItem> => {
      const { data } = await api.post<ApiResponse<LoanItem>>('/loans', payload);
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOANS_QUERY_KEY });
    },
  });
}

export function useUpdateLoan() {
  return useMutation({
    mutationFn: async (payload: UpdateLoanRequest): Promise<LoanItem> => {
      const { data } = await api.put<ApiResponse<LoanItem>>('/loans', payload);
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOANS_QUERY_KEY });
    },
  });
}

export function useDeleteLoan() {
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { data } = await api.delete<ApiResponse<{ message: string }>>(`/loans?id=${id}`);
      if (!data.ok) throw new Error(data.error.code);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOANS_QUERY_KEY });
    },
  });
}
