'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useTheme } from '@/providers/ThemeProvider';
import { THEME } from '@/store';
// Removed unused imports - using minimalist styles instead
import { useFinanceStats } from '@/features/finance/hooks/useFinanceStats';
import { useIsClient } from '@/hooks/useIsClient';
import { formatSummaryAmount } from '@/lib/currency';

const chartConfig = {
  income: {
    label: 'Income',
    color: '#000000',
  },
  expenses: {
    label: 'Expenses',
    color: '#666666',
  },
} satisfies ChartConfig;

export function IncomeExpenseChart() {
  const { theme } = useTheme();
  const isClient = useIsClient();
  const { data: financeStats, isLoading, error } = useFinanceStats();

  if (!isClient || isLoading) {
    return (
      <div className="h-[350px] w-full flex items-center justify-center">
        <div className="animate-pulse bg-muted/40 rounded-lg h-full w-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[350px] w-full flex items-center justify-center">
        <div className="text-muted-foreground">Failed to load chart data</div>
      </div>
    );
  }

  const chartData = financeStats?.monthlyStats.length
    ? financeStats.monthlyStats
    : [
        // Placeholder data starting from 0
        { month: 'Sep', income: 0, expenses: 0 },
        { month: 'Oct', income: 0, expenses: 0 },
        { month: 'Nov', income: 0, expenses: 0 },
        { month: 'Dec', income: 0, expenses: 0 },
        { month: 'Jan', income: 0, expenses: 0 },
        { month: 'Feb', income: 0, expenses: 0 },
        { month: 'Mar', income: 0, expenses: 0 },
        { month: 'Apr', income: 0, expenses: 0 },
        { month: 'May', income: 0, expenses: 0 },
        { month: 'Jun', income: 0, expenses: 0 },
        { month: 'Jul', income: 0, expenses: 0 },
        { month: 'Aug', income: 0, expenses: 0 },
      ];

  return (
    <div className="h-[350px] w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={theme === THEME.DARK ? '#ffffff' : '#6b7280'}
                  stopOpacity={0.55}
                />
                <stop
                  offset="15%"
                  stopColor={theme === THEME.DARK ? '#ffffff' : '#6b7280'}
                  stopOpacity={0.48}
                />
                <stop
                  offset="30%"
                  stopColor={theme === THEME.DARK ? '#ffffff' : '#6b7280'}
                  stopOpacity={0.38}
                />
                <stop
                  offset="50%"
                  stopColor={theme === THEME.DARK ? '#ffffff' : '#6b7280'}
                  stopOpacity={0.25}
                />
                <stop
                  offset="70%"
                  stopColor={theme === THEME.DARK ? '#ffffff' : '#6b7280'}
                  stopOpacity={0.15}
                />
                <stop
                  offset="85%"
                  stopColor={theme === THEME.DARK ? '#ffffff' : '#6b7280'}
                  stopOpacity={0.08}
                />
                <stop
                  offset="100%"
                  stopColor={theme === THEME.DARK ? '#ffffff' : '#6b7280'}
                  stopOpacity={0.02}
                />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={theme === THEME.DARK ? '#d1d5db' : '#9ca3af'}
                  stopOpacity={0.45}
                />
                <stop
                  offset="15%"
                  stopColor={theme === THEME.DARK ? '#d1d5db' : '#9ca3af'}
                  stopOpacity={0.38}
                />
                <stop
                  offset="30%"
                  stopColor={theme === THEME.DARK ? '#d1d5db' : '#9ca3af'}
                  stopOpacity={0.28}
                />
                <stop
                  offset="50%"
                  stopColor={theme === THEME.DARK ? '#d1d5db' : '#9ca3af'}
                  stopOpacity={0.18}
                />
                <stop
                  offset="70%"
                  stopColor={theme === THEME.DARK ? '#d1d5db' : '#9ca3af'}
                  stopOpacity={0.1}
                />
                <stop
                  offset="85%"
                  stopColor={theme === THEME.DARK ? '#d1d5db' : '#9ca3af'}
                  stopOpacity={0.05}
                />
                <stop
                  offset="100%"
                  stopColor={theme === THEME.DARK ? '#d1d5db' : '#9ca3af'}
                  stopOpacity={0.01}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="1 2"
              stroke={theme === THEME.DARK ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}
              vertical={false}
              strokeWidth={0.5}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: theme === THEME.DARK ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: theme === THEME.DARK ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
              }}
              tickFormatter={value => `€ ${(value / 1000).toFixed(0)}k`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    formatSummaryAmount(Number(value)),
                    ` ${name === 'income' ? 'Income' : 'Expenses'}`,
                  ]}
                  labelFormatter={label => `${label}`}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke={theme === THEME.DARK ? '#ffffff' : '#4b5563'}
              strokeWidth={0.7}
              fill="url(#incomeGradient)"
              fillOpacity={1}
              dot={false}
              activeDot={{
                r: 4,
                strokeWidth: 2,
                stroke: theme === THEME.DARK ? '#ffffff' : '#4b5563',
                fill: theme === THEME.DARK ? '#000000' : '#ffffff',
                opacity: 1,
              }}
              animationDuration={800}
              animationBegin={150}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke={theme === THEME.DARK ? '#d1d5db' : '#6b7280'}
              strokeWidth={0.7}
              fill="url(#expenseGradient)"
              fillOpacity={1}
              dot={false}
              activeDot={{
                r: 4,
                strokeWidth: 2,
                stroke: theme === THEME.DARK ? '#d1d5db' : '#6b7280',
                fill: theme === THEME.DARK ? '#000000' : '#ffffff',
                opacity: 1,
              }}
              animationDuration={800}
              animationBegin={250}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
