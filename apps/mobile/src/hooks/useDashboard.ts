import type {
  ApiResponse,
  DashboardHistoryResponse,
  DashboardSummary,
} from '@bit-chain/api-contracts';
import { useQuery } from '@tanstack/react-query';
import api from '~/src/lib/api';
import { QUERY_CONFIG } from '~/src/lib/constants';

export const DASHBOARD_QUERY_KEY = ['dashboard', 'summary'] as const;

export interface DashboardFilters {
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Fetches aggregated dashboard summary from /api/mobile/dashboard/summary.
 * Accepts optional period filters so that `periodStats` reflect the selected
 * period rather than always defaulting to the current calendar month.
 *
 * @param filters - Optional `dateFrom` / `dateTo` ISO strings.
 *
 * @example
 * ```tsx
 * const { dateFrom, dateTo } = getPeriodRange(period);
 * const { data } = useDashboard({ dateFrom, dateTo });
 * ```
 */
export function useDashboard(filters?: DashboardFilters) {
  return useQuery({
    // Include filters in the cache key so each period gets its own cache entry.
    queryKey: [...DASHBOARD_QUERY_KEY, filters] as const,
    queryFn: async (): Promise<DashboardSummary> => {
      const params = new URLSearchParams();
      if (filters?.dateFrom) params.set('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.set('dateTo', filters.dateTo);

      const query = params.toString();
      const { data } = await api.get<ApiResponse<DashboardSummary>>(
        `/dashboard/summary${query ? `?${query}` : ''}`,
      );
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
    staleTime: QUERY_CONFIG.STALE_TIME_DASHBOARD,
  });
}

export const DASHBOARD_HISTORY_QUERY_KEY = ['dashboard', 'history'] as const;

export interface DashboardHistoryFilters {
  dateFrom?: string;
  dateTo?: string;
}

export function useDashboardHistory(filters?: DashboardHistoryFilters) {
  return useQuery({
    queryKey: [...DASHBOARD_HISTORY_QUERY_KEY, filters] as const,
    queryFn: async (): Promise<DashboardHistoryResponse> => {
      const params = new URLSearchParams();
      if (filters?.dateFrom) params.set('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.set('dateTo', filters.dateTo);

      const query = params.toString();
      const { data } = await api.get<ApiResponse<DashboardHistoryResponse>>(
        `/dashboard/history${query ? `?${query}` : ''}`,
      );
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
    staleTime: QUERY_CONFIG.STALE_TIME_DASHBOARD,
  });
}
