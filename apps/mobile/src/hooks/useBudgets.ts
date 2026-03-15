import type {
  ApiResponse,
  Budget,
  CreateBudgetRequest,
  GetBudgetsResponse,
  UpdateBudgetRequest,
} from '@bit-chain/api-contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '~/src/lib/api';
import { BUDGETS_QUERY_KEY } from '~/src/lib/query-keys';

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

export function useCreateBudget() {
  const queryClient = useQueryClient();
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

export function useUpdateBudget() {
  const queryClient = useQueryClient();
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

export function useDeleteBudget() {
  const queryClient = useQueryClient();
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
