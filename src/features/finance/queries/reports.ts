import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface ReportData {
  title: string;
  period: string;
  data: unknown;
  generatedAt: string;
}

export interface ReportParams {
  type:
    | 'income-expenses'
    | 'category-analysis'
    | 'cash-flow'
    | 'budget-performance'
    | 'account-summary'
    | 'goal-progress';
  period?: 'weekly' | 'monthly' | 'yearly';
  format?: 'json' | 'csv' | 'pdf';
}

// Generate report
export const useGenerateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: ReportParams) => {
      const searchParams = new URLSearchParams({
        type: params.type,
        period: params.period || 'monthly',
        format: params.format || 'json',
      });

      const response = await fetch(`/api/reports?${searchParams.toString()}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate report');
      }

      // Handle CSV/PDF downloads
      if (params.format === 'csv') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${params.type}-report-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return { success: true, message: 'Report downloaded successfully' };
      }

      const result = await response.json();
      return result as ReportData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};

// Preview report data
export const usePreviewReport = (params: ReportParams) => {
  return useQuery({
    queryKey: ['report-preview', params.type, params.period],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        type: params.type,
        period: params.period || 'monthly',
        format: 'json',
      });

      const response = await fetch(`/api/reports?${searchParams.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to preview report');
      }

      return (await response.json()) as ReportData;
    },
    enabled: !!params.type,
  });
};

// Export report in different formats
export const useExportReport = () => {
  return useMutation({
    mutationFn: async (params: ReportParams & { format: 'csv' | 'pdf' }) => {
      const searchParams = new URLSearchParams({
        type: params.type,
        period: params.period || 'monthly',
        format: params.format,
      });

      const response = await fetch(`/api/reports?${searchParams.toString()}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to export report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const fileExtension = params.format === 'csv' ? 'csv' : 'pdf';
      const fileName = `${params.type}-report-${new Date().toISOString().split('T')[0]}.${fileExtension}`;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return {
        success: true,
        message: `Report exported as ${fileExtension.toUpperCase()} successfully`,
      };
    },
  });
};

// Get available report types
export const getReportTypes = () =>
  [
    {
      id: 'income-expenses',
      name: 'Income vs Expenses',
      description: 'Monthly comparison of your income and spending',
      icon: 'BarChart3',
    },
    {
      id: 'category-analysis',
      name: 'Category Analysis',
      description: 'Detailed breakdown of spending by category',
      icon: 'PieChart',
    },
    {
      id: 'cash-flow',
      name: 'Cash Flow Statement',
      description: 'Comprehensive cash flow analysis',
      icon: 'Activity',
    },
    {
      id: 'budget-performance',
      name: 'Budget Performance',
      description: "How well you're sticking to your budgets",
      icon: 'TrendingUp',
    },
    {
      id: 'account-summary',
      name: 'Account Summary',
      description: 'Overview of all accounts and balances',
      icon: 'DollarSign',
    },
    {
      id: 'goal-progress',
      name: 'Goal Progress Report',
      description: 'Track progress towards your financial goals',
      icon: 'Target',
    },
  ] as const;

// Helper function to get report status (mock for now)
export const getReportStatus = (_type: string) => {
  // In a real app, this would check actual generation status
  const isGenerating = Math.random() < 0.2; // 20% chance of being in generating state
  return isGenerating ? 'generating' : 'ready';
};
