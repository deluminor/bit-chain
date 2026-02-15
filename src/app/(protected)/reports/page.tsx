'use client';

import { useMemo } from 'react';
import { startOfDay, endOfDay, format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Download,
  FileText,
  FileJson,
  TrendingUp,
  TrendingDown,
  Wallet,
  Loader2,
} from 'lucide-react';
import { useGenerateComprehensiveReport } from '@/features/finance/queries/reports';
import { useTransactions } from '@/features/finance/queries/transactions';
import { useStore, DATE_PRESET_LABELS } from '@/store';
import { AnimatedDiv } from '@/components/ui/animations';
import { formatSummaryAmount } from '@/lib/currency';

export default function ReportsPage() {
  const { toast } = useToast();
  const generateReport = useGenerateComprehensiveReport();
  const { selectedDateRange, globalDatePreset } = useStore();

  // Derive dateFrom/dateTo from global filter (pattern from FinanceDashboard)
  const dateFrom = useMemo(() => {
    if (selectedDateRange?.from) {
      return startOfDay(selectedDateRange.from).toISOString();
    }
    return undefined;
  }, [selectedDateRange?.from]);

  const dateTo = useMemo(() => {
    if (selectedDateRange?.to) {
      return endOfDay(selectedDateRange.to).toISOString();
    }
    return new Date().toISOString();
  }, [selectedDateRange?.to]);

  // Fetch summary stats for the selected period
  const { data: transactionsData, isLoading: statsLoading } = useTransactions({
    dateFrom,
    dateTo,
    limit: 1,
  });

  const summary = transactionsData?.summary;
  const totalTransactions = summary?.totalTransactions ?? 0;

  const periodLabel = useMemo(() => {
    if (globalDatePreset === 'all_time') return 'All Time';
    if (globalDatePreset === 'custom' && selectedDateRange?.from && selectedDateRange?.to) {
      return `${format(selectedDateRange.from, 'dd.MM.yyyy')} — ${format(selectedDateRange.to, 'dd.MM.yyyy')}`;
    }
    return DATE_PRESET_LABELS[globalDatePreset] ?? 'This Month';
  }, [globalDatePreset, selectedDateRange]);

  const handleGenerate = async (reportFormat: 'json' | 'markdown') => {
    try {
      const result = await generateReport.mutateAsync({
        dateFrom: globalDatePreset === 'all_time' ? undefined : dateFrom,
        dateTo: globalDatePreset === 'all_time' ? undefined : dateTo,
        format: reportFormat,
      });

      toast({
        title: 'Report Downloaded',
        description: `${result.fileName} saved successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate report',
        variant: 'destructive',
      });
    }
  };

  const isGenerating = generateReport.isPending;

  return (
    <AnimatedDiv variant="slideUp" className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="flex flex-col gap-3 md:gap-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
              Financial Report
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Generate a comprehensive report for AI analysis — period:{' '}
              <span className="font-medium text-foreground">{periodLabel}</span>
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {statsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-4 sm:p-5">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-8 bg-muted rounded w-1/2" />
                  </div>
                </Card>
              ))
            ) : (
              <>
                <Card className="p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm text-muted-foreground font-medium">
                      Income
                    </span>
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="text-lg sm:text-xl font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatSummaryAmount(summary?.income ?? 0)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {summary?.incomeCount ?? 0} transactions
                  </div>
                </Card>

                <Card className="p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm text-muted-foreground font-medium">
                      Expenses
                    </span>
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  </div>
                  <div className="text-lg sm:text-xl font-semibold text-red-600 dark:text-red-400">
                    {formatSummaryAmount(summary?.expenses ?? 0)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {summary?.expenseCount ?? 0} transactions
                  </div>
                </Card>

                <Card className="p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm text-muted-foreground font-medium">
                      Net Savings
                    </span>
                    <Wallet className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="text-lg sm:text-xl font-semibold">
                    {formatSummaryAmount((summary?.income ?? 0) - (summary?.expenses ?? 0))}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {totalTransactions} total transactions
                  </div>
                </Card>
              </>
            )}
          </div>

          {/* Report Info + Download */}
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Generate Report
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Downloads a single file containing all your financial data for the selected
                    period: transactions, income/expense summaries, category breakdowns, account
                    balances, budget performance, loans, goals, and trends. Optimized for AI
                    analysis.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    onClick={() => handleGenerate('json')}
                    disabled={isGenerating}
                    className="flex-1 sm:flex-none"
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <FileJson className="h-4 w-4 mr-2" />
                    )}
                    {isGenerating ? 'Generating...' : 'Download JSON'}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleGenerate('markdown')}
                    disabled={isGenerating}
                    className="flex-1 sm:flex-none"
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <FileText className="h-4 w-4 mr-2" />
                    )}
                    {isGenerating ? 'Generating...' : 'Download Markdown'}
                  </Button>
                </div>

                {totalTransactions > 5000 && (
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    Large dataset ({totalTransactions.toLocaleString()} transactions) — report
                    generation may take a moment.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AnimatedDiv>
  );
}
