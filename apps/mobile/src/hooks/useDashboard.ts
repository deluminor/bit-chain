import type { ApiResponse, DashboardSummary } from '@bit-chain/api-contracts';
import { useQuery } from '@tanstack/react-query';
import api from '~/src/lib/api';
import { QUERY_CONFIG } from '~/src/lib/constants';

export const DASHBOARD_QUERY_KEY = ['dashboard', 'summary'] as const;

export interface DashboardFilters {
  /** ISO datetime lower bound for period stats (e.g. start of selected period). */
  dateFrom?: string;
  /** ISO datetime upper bound for period stats (e.g. end of selected period / now). */
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

export function useDashboardHistory() {
  return useQuery({
    queryKey: DASHBOARD_HISTORY_QUERY_KEY,
    queryFn: async (): Promise<any> => {
      const { data } = await api.get<ApiResponse<any>>('/dashboard/history');
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
    staleTime: QUERY_CONFIG.STALE_TIME_DASHBOARD,
  });
}
