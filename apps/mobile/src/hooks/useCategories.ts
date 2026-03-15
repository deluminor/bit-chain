import type {
  ApiResponse,
  CategoriesListResponse,
  CategoryListItem,
  CategoryType,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@bit-chain/api-contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '~/src/lib/api';
import { QUERY_CONFIG } from '~/src/lib/constants';
import { CATEGORIES_QUERY_KEY } from '~/src/lib/query-keys';

export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: async (): Promise<CategoriesListResponse> => {
      const { data } = await api.get<ApiResponse<CategoriesListResponse>>('/categories');
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
    staleTime: QUERY_CONFIG.STALE_TIME_DEFAULT,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateCategoryRequest): Promise<CategoryListItem> => {
      const { data } = await api.post<ApiResponse<CategoryListItem>>('/categories', payload);
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateCategoryRequest): Promise<CategoryListItem> => {
      const { data } = await api.put<ApiResponse<CategoryListItem>>('/categories', payload);
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { data } = await api.delete<ApiResponse<{ message: string }>>(`/categories?id=${id}`);
      if (!data.ok) throw new Error(data.error.code);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
}

export type CategoryFilter = CategoryType | 'ALL';

export const CATEGORY_FILTERS: ReadonlyArray<{ key: CategoryFilter; label: string }> = [
  { key: 'ALL', label: 'All' },
  { key: 'INCOME', label: 'Income' },
  { key: 'EXPENSE', label: 'Expenses' },
];
