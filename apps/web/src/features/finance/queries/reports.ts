import { useMutation } from '@tanstack/react-query';

export interface ComprehensiveReportParams {
  dateFrom?: string;
  dateTo?: string;
  format: 'json' | 'markdown';
}

/**
 * Mutation hook to generate and download a comprehensive financial report.
 *
 * Fetches all financial data for the given period from the API and triggers
 * a file download in the selected format (JSON or Markdown).
 *
 * @example
 * ```tsx
 * const generateReport = useGenerateComprehensiveReport();
 *
 * generateReport.mutate({
 *   dateFrom: '2025-01-01T00:00:00.000Z',
 *   dateTo: '2025-01-31T23:59:59.999Z',
 *   format: 'json',
 * });
 * ```
 */
export function useGenerateComprehensiveReport() {
  return useMutation({
    mutationFn: async (params: ComprehensiveReportParams) => {
      const searchParams = new URLSearchParams();
      if (params.dateFrom) searchParams.set('dateFrom', params.dateFrom);
      if (params.dateTo) searchParams.set('dateTo', params.dateTo);
      searchParams.set('format', params.format);

      const response = await fetch(`/api/reports/comprehensive?${searchParams.toString()}`);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to generate report' }));
        throw new Error(error.error || 'Failed to generate report');
      }

      const blob = await response.blob();
      const ext = params.format === 'markdown' ? 'md' : 'json';
      const fileName = `financial-report-${new Date().toISOString().split('T')[0]}.${ext}`;

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return { success: true, fileName };
    },
  });
}
