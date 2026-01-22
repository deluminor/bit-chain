'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { useTheme } from '@/providers/ThemeProvider';
import { THEME } from '@/store';
import { useBudgetPerformance } from '@/features/finance/hooks/useBudgetPerformance';
import { useIsClient } from '@/hooks/useIsClient';
import { formatSummaryAmount, SUPPORTED_CURRENCIES, BASE_CURRENCY } from '@/lib/currency';
import { ChartWrapper } from './ChartWrapper';
import { Target, AlertTriangle } from 'lucide-react';

const chartConfig = {
  budgeted: {
    label: 'Budgeted',
    color: 'var(--primary)',
  },
  spent: {
    label: 'Spent',
    color: 'var(--expense)',
  },
} satisfies ChartConfig;

export function BudgetPerformanceChart() {
  const { theme } = useTheme();
  const isClient = useIsClient();
  const { data: budgetData, isLoading, error } = useBudgetPerformance();

  if (!isClient) {
    return (
      <ChartWrapper
        title="Budget Performance"
        description="Compare budgeted vs actual spending by category"
        isLoading={true}
      >
        <div />
      </ChartWrapper>
    );
  }

  if (error || !budgetData?.length) {
    return (
      <ChartWrapper
        title="Budget Performance"
        description="Compare budgeted vs actual spending by category"
      >
        <div className="h-[300px] w-full flex items-center justify-center">
          <div className="text-muted-foreground">No budget data available</div>
        </div>
      </ChartWrapper>
    );
  }

  // Calculate totals for footer
  const totalBudgeted = budgetData.reduce((sum, item) => sum + item.budgeted, 0);
  const totalSpent = budgetData.reduce((sum, item) => sum + item.spent, 0);
  const overBudgetCategories = budgetData.filter(item => item.spent > item.budgeted).length;
  const budgetUtilization = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

  const footer = (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-1">
        {overBudgetCategories > 0 ? (
          <AlertTriangle className="h-4 w-4 text-expense" />
        ) : (
          <Target className="h-4 w-4 text-income" />
        )}
        <span className="text-muted-foreground">Over Budget:</span>
        <span
          className={`font-medium ${overBudgetCategories > 0 ? 'text-expense' : 'text-income'}`}
        >
          {overBudgetCategories} categories
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground">Utilization:</span>
        <span
          className={`font-medium ${
            budgetUtilization > 100
              ? 'text-expense'
              : budgetUtilization > 80
                ? 'text-amber-600'
                : 'text-income'
          }`}
        >
          {budgetUtilization.toFixed(1)}%
        </span>
      </div>
    </div>
  );

  return (
    <ChartWrapper
      title="Budget Performance"
      description="Compare budgeted vs actual spending by category"
      footer={footer}
      isLoading={isLoading}
    >
      <div className="h-[300px] w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={budgetData}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              barCategoryGap="20%"
            >
              <defs>
                <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                  <stop offset="50%" stopColor="var(--primary)" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.01} />
                </linearGradient>
                <linearGradient id="spentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--income)" stopOpacity={0.4} />
                  <stop offset="50%" stopColor="var(--income)" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="var(--income)" stopOpacity={0.01} />
                </linearGradient>
                <linearGradient id="overSpentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--expense)" stopOpacity={0.4} />
                  <stop offset="50%" stopColor="var(--expense)" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="var(--expense)" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="1 2"
                stroke={theme === THEME.DARK ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}
                vertical={false}
                strokeWidth={0.5}
              />
              <XAxis
                dataKey="category"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: theme === THEME.DARK ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: theme === THEME.DARK ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                }}
                tickFormatter={value =>
                  `${SUPPORTED_CURRENCIES[BASE_CURRENCY]?.symbol || '€'} ${(value / 1000).toFixed(0)}k`
                }
              />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    // Sort payload by value in descending order (highest to lowest)
                    const sortedPayload = [...payload].sort(
                      (a, b) => (Number(b.value) || 0) - (Number(a.value) || 0),
                    );

                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md">
                        <div className="grid gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Category: {label}
                            </span>
                          </div>
                          {sortedPayload.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div
                                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                                style={{
                                  backgroundColor:
                                    entry.name === 'budgeted' || entry.name === 'Budgeted'
                                      ? 'var(--primary)'
                                      : 'var(--expense)',
                                }}
                              />
                              <div className="flex w-full flex-wrap items-stretch gap-2">
                                <span className="flex-1 text-xs text-muted-foreground">
                                  {entry.name === 'Budgeted' ? 'Budgeted' : 'Spent'}
                                </span>
                                <span className="text-xs font-mono font-medium tabular-nums text-foreground">
                                  {formatSummaryAmount(Number(entry.value))}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="budgeted"
                name="Budgeted"
                fill="url(#budgetGradient)"
                radius={[2, 2, 0, 0]}
                animationDuration={800}
                animationBegin={150}
              />
              <Bar
                dataKey="spent"
                name="Spent"
                radius={[2, 2, 0, 0]}
                animationDuration={800}
                animationBegin={250}
              >
                {budgetData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.spent > entry.budgeted
                        ? 'url(#overSpentGradient)'
                        : 'url(#spentGradient)'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </ChartWrapper>
  );
}
