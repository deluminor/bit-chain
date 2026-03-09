import type {
  ApiResponse,
  CreateGoalRequest,
  GoalItem,
  GoalsListResponse,
  UpdateGoalRequest,
} from '@bit-chain/api-contracts';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '~/src/lib/api';
import { queryClient } from '~/src/lib/query';

export const GOALS_QUERY_KEY = ['goals', 'list'] as const;

/**
 * Fetches all financial goals for the authenticated user.
 *
 * @example
 * ```tsx
 * const { data } = useGoals();
 * const goals = data?.goals ?? [];
 * ```
 */
export function useGoals() {
  return useQuery({
    queryKey: GOALS_QUERY_KEY,
    queryFn: async (): Promise<GoalsListResponse> => {
      const { data } = await api.get<ApiResponse<GoalsListResponse>>('/goals');
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
  });
}

export function useCreateGoal() {
  return useMutation({
    mutationFn: async (payload: CreateGoalRequest): Promise<GoalItem> => {
      const { data } = await api.post<ApiResponse<GoalItem>>('/goals', payload);
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEY });
    },
  });
}

export function useUpdateGoal() {
  return useMutation({
    mutationFn: async (payload: UpdateGoalRequest): Promise<GoalItem> => {
      const { data } = await api.put<ApiResponse<GoalItem>>('/goals', payload);
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEY });
    },
  });
}

export function useDeleteGoal() {
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { data } = await api.delete<ApiResponse<{ message: string }>>(`/goals?id=${id}`);
      if (!data.ok) throw new Error(data.error.code);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEY });
    },
  });
}
