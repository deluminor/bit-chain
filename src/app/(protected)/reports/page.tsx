'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  PieChart,
  BarChart3,
  Activity,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Target,
} from 'lucide-react';
import { useState } from 'react';
import {
  useGenerateReport,
  useExportReport,
  getReportTypes,
  getReportStatus,
} from '@/features/finance/queries/reports';
import { useReportsStats } from '@/features/finance/hooks/useReportsStats';
import { AnimatedDiv } from '@/components/ui/animations';
import { formatSummaryAmount } from '@/lib/currency';

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const { toast } = useToast();
  const generateReport = useGenerateReport();
  const exportReport = useExportReport();
  const { data: reportsStats, isLoading: statsLoading } = useReportsStats();

  const iconMap = {
    BarChart3,
    PieChart,
    Activity,
    TrendingUp,
    DollarSign,
    Target,
  };

  const reportTypes = getReportTypes();

  const reports = reportTypes.map(reportType => ({
    id: reportType.id,
    title: reportType.name,
    description: reportType.description,
    type: reportType.id,
    icon: iconMap[reportType.icon as keyof typeof iconMap] || Activity,
    period: selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1),
    lastGenerated: '2024-01-15', // Mock data for now
    status: getReportStatus(reportType.id),
  }));

  const quickStats = reportsStats
    ? [
        {
          title: 'Total Income',
          value: formatSummaryAmount(reportsStats.totalIncome * 0.025),
          change: `${reportsStats.incomeChange >= 0 ? '+' : ''}${reportsStats.incomeChange.toFixed(1)}%`,
          trend: reportsStats.incomeChange >= 0 ? 'up' : 'down',
          period: 'This month',
        },
        {
          title: 'Total Expenses',
          value: formatSummaryAmount(reportsStats.totalExpenses * 0.025),
          change: `${reportsStats.expenseChange >= 0 ? '+' : ''}${reportsStats.expenseChange.toFixed(1)}%`,
          trend: reportsStats.expenseChange <= 0 ? 'up' : 'down', // Lower expenses = good
          period: 'This month',
        },
        {
          title: 'Net Savings',
          value: formatSummaryAmount(reportsStats.netSavings * 0.025),
          change: `${reportsStats.savingsChange >= 0 ? '+' : ''}${reportsStats.savingsChange.toFixed(1)}%`,
          trend: reportsStats.savingsChange >= 0 ? 'up' : 'down',
          period: 'This month',
        },
        {
          title: 'Budget Adherence',
          value: `${reportsStats.budgetAdherence.toFixed(0)}%`,
          change: `${reportsStats.budgetChange >= 0 ? '+' : ''}${reportsStats.budgetChange.toFixed(1)}%`,
          trend: reportsStats.budgetAdherence >= 85 ? 'up' : 'down',
          period: 'This month',
        },
      ]
    : [];

  const handleGenerateReport = async (reportId: string) => {
    try {
      await generateReport.mutateAsync({
        type: reportId as any,
        period: selectedPeriod,
        format: 'json',
      });

      toast({
        title: 'Success',
        description: 'Report generated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate report',
        variant: 'destructive',
      });
    }
  };

  const handleExportReport = async (reportId: string, format: 'csv' | 'pdf' = 'csv') => {
    try {
      await exportReport.mutateAsync({
        type: reportId as any,
        period: selectedPeriod,
        format,
      });

      toast({
        title: 'Success',
        description: `Report exported as ${format.toUpperCase()} successfully`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to export report',
        variant: 'destructive',
      });
    }
  };

  const handleExportAll = async () => {
    try {
      for (const report of reports) {
        if (report.status === 'ready') {
          await handleExportReport(report.id, 'csv');
          // Small delay between exports to avoid overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      toast({
        title: 'Success',
        description: 'All reports exported successfully',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to export some reports',
        variant: 'destructive',
      });
    }
  };

  return (
    <AnimatedDiv variant="slideUp" className="flex flex-col gap-6 py-6 min-h-screen">
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-2">Financial Reports</h1>
            <p className="text-muted-foreground">Comprehensive analysis of your financial data</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Custom Range
            </Button>
            <Button size="sm" onClick={handleExportAll} disabled={exportReport.isPending}>
              <Download className="h-4 w-4 mr-2" />
              {exportReport.isPending ? 'Exporting...' : 'Export All'}
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="p-4">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-8 bg-muted rounded w-1/2"></div>
                    <div className="h-6 bg-muted rounded w-full"></div>
                  </div>
                </Card>
              ))
            : quickStats.map((stat, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-sm text-muted-foreground">{stat.title}</h3>
                    <div
                      className={`p-1.5 rounded-lg ${
                        stat.trend === 'up'
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                          : 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400'
                      }`}
                    >
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                  <div className="text-2xl font-semibold mb-2">{stat.value}</div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium px-2 py-1 rounded ${
                        stat.trend === 'up'
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                          : 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400'
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-xs text-muted-foreground">{stat.period}</span>
                  </div>
                </Card>
              ))}
        </div>
      </div>

      {/* Period Selection */}
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-center mb-8">
          <div className="inline-flex bg-muted rounded-lg p-1">
            {['weekly', 'monthly', 'quarterly', 'yearly'].map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period as 'weekly' | 'monthly' | 'yearly')}
                className={`px-4 py-2 rounded-md font-medium transition-colors text-sm ${
                  selectedPeriod === period
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Available Reports */}
      <div className="px-4 lg:px-6 space-y-6">
        <h2 className="text-xl font-semibold mb-6">Available Reports</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <report.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{report.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {report.type}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {report.period}
                      </Badge>
                      <Badge
                        variant={report.status === 'ready' ? 'default' : 'secondary'}
                        className={`text-xs ${
                          report.status === 'ready'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                        }`}
                      >
                        {report.status === 'ready' ? 'Ready' : 'Generating'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-xs text-muted-foreground">
                    Last updated: {report.lastGenerated}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleGenerateReport(report.id)}
                      disabled={generateReport.isPending}
                    >
                      View
                    </Button>
                    {report.status === 'ready' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExportReport(report.id, 'csv')}
                        disabled={exportReport.isPending}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Export
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={() => handleGenerateReport(report.id)}
                      disabled={report.status === 'generating' || generateReport.isPending}
                    >
                      {report.status === 'generating' || generateReport.isPending
                        ? 'Generating...'
                        : 'Generate'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Download className="h-5 w-5" />
              Export Options
            </CardTitle>
            <CardDescription>Choose your preferred format for data export</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                className="w-full sm:w-40 flex flex-col items-center justify-center gap-2"
                onClick={() => handleExportReport('income-expenses', 'pdf')}
                disabled={exportReport.isPending}
              >
                <FileText className="h-6 w-6 text-red-500" />
                <span className="text-sm font-medium">PDF Report</span>
              </Button>

              <Button
                variant="outline"
                className="w-full sm:w-40 flex flex-col items-center justify-center gap-2"
                onClick={() => handleExportReport('category-analysis', 'csv')}
                disabled={exportReport.isPending}
              >
                <BarChart3 className="h-6 w-6 text-emerald-500" />
                <span className="text-sm font-medium">Excel</span>
              </Button>

              <Button
                variant="outline"
                className="w-full sm:w-40 flex flex-col items-center justify-center gap-2"
                onClick={() => handleExportReport('cash-flow', 'csv')}
                disabled={exportReport.isPending}
              >
                <Activity className="h-6 w-6 text-blue-500" />
                <span className="text-sm font-medium">CSV Data</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="px-4 lg:px-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest report generations and downloads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <div>
                    <span className="font-medium text-sm">Income vs Expenses - January 2024</span>
                    <p className="text-xs text-muted-foreground">PDF • 2.4 MB</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <span className="font-medium text-sm">Category Analysis - December 2023</span>
                    <p className="text-xs text-muted-foreground">Excel • 1.8 MB</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">1 day ago</span>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <span className="font-medium text-sm">Budget Performance - December 2023</span>
                    <p className="text-xs text-muted-foreground">PDF • 3.1 MB</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">3 days ago</span>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AnimatedDiv>
  );
}
