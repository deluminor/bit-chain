import type { ApiResponse, ReportResponse } from '@bit-chain/api-contracts';
import { useQuery } from '@tanstack/react-query';
import api from '~/src/lib/api';

export const REPORTS_QUERY_KEY = ['reports'] as const;

interface ReportFilters {
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Fetches a financial report for the given date range.
 *
 * @param filters - Optional dateFrom / dateTo (ISO strings)
 *
 * @example
 * ```tsx
 * const { data } = useReport({ dateFrom: '2025-01-01', dateTo: '2025-01-31' });
 * ```
 */
export function useReport(filters?: ReportFilters) {
  return useQuery({
    queryKey: [...REPORTS_QUERY_KEY, filters] as const,
    queryFn: async (): Promise<ReportResponse> => {
      const params = new URLSearchParams();
      if (filters?.dateFrom) params.set('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.set('dateTo', filters.dateTo);

      const query = params.toString();
      const { data } = await api.get<ApiResponse<ReportResponse>>(
        `/reports${query ? `?${query}` : ''}`,
      );
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
  });
}
