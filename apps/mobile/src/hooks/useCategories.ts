import api from '~/src/lib/api';
import type { ApiResponse, CategoriesListResponse, CategoryType } from '@bit-chain/api-contracts';
import { useQuery } from '@tanstack/react-query';
import { QUERY_CONFIG } from '~/src/lib/constants';

export const CATEGORIES_QUERY_KEY = ['categories', 'list'] as const;

/**
 * Fetches all categories from /api/mobile/categories.
 * Returns income/expense counts and a flat category list.
 *
 * @example
 * ```tsx
 * const { data } = useCategories();
 * ```
 */
export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn:  async (): Promise<CategoriesListResponse> => {
      const { data } = await api.get<ApiResponse<CategoriesListResponse>>('/categories');
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
    staleTime: QUERY_CONFIG.STALE_TIME_DEFAULT,
  });
}

// ─── Type Filter Helpers ──────────────────────────────────────────────────────

export type CategoryFilter = CategoryType | 'ALL';

export const CATEGORY_FILTERS: ReadonlyArray<{ key: CategoryFilter; label: string }> = [
  { key: 'ALL',     label: 'All'      },
  { key: 'INCOME',  label: 'Income'   },
  { key: 'EXPENSE', label: 'Expenses' },
];
