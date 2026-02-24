import type {
  ApiResponse,
  Budget,
  CreateBudgetRequest,
  GetBudgetsResponse,
  UpdateBudgetRequest,
} from '@bit-chain/api-contracts';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '~/src/lib/api';
import { queryClient } from '~/src/lib/query';

export const BUDGETS_QUERY_KEY = ['budgets', 'list'] as const;

/**
 * Fetches all budgets for the authenticated user
 */
export function useBudgets() {
  return useQuery({
    queryKey: BUDGETS_QUERY_KEY,
    queryFn: async (): Promise<GetBudgetsResponse> => {
      const res = await api.get<ApiResponse<GetBudgetsResponse>>('/budget');
      const { data } = res;
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
  });
}

/**
 * Creates a new budget
 */
export function useCreateBudget() {
  return useMutation({
    mutationFn: async (payload: CreateBudgetRequest) => {
      const { data } = await api.post<ApiResponse<{ budget: Budget }>>('/budget', payload);
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEY });
    },
  });
}

/**
 * Updates an existing budget
 */
export function useUpdateBudget() {
  return useMutation({
    mutationFn: async (payload: UpdateBudgetRequest) => {
      const { data } = await api.put<ApiResponse<{ budget: Budget }>>('/budget', payload);
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEY });
    },
  });
}

/**
 * Deletes a budget
 */
export function useDeleteBudget() {
  return useMutation({
    mutationFn: async (budgetId: string) => {
      const { data } = await api.delete<ApiResponse<{ message: string }>>(`/budget?id=${budgetId}`);
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEY });
    },
  });
}
