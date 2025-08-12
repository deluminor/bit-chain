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
import { AREA_GRADIENTS, CHART_COLORS, ACTIVE_DOT_COLORS, CHART_CONFIG } from '@/constants/colors';
import { useFinanceStats } from '@/features/finance/hooks/useFinanceStats';
import { useIsClient } from '@/hooks/useIsClient';
import { formatSummaryAmount } from '@/lib/currency';

const chartConfig = {
  income: {
    label: 'Income',
    color: '#10B981',
  },
  expenses: {
    label: 'Expenses',
    color: '#EF4444',
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

  const chartData = financeStats?.monthlyStats || [];

  return (
    <div className="h-[350px] w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                {AREA_GRADIENTS.FILL.INCOME.map((stop, index) => (
                  <stop
                    key={index}
                    offset={stop.offset}
                    stopColor={stop.color}
                    stopOpacity={stop.opacity}
                  />
                ))}
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                {AREA_GRADIENTS.FILL.EXPENSE.map((stop, index) => (
                  <stop
                    key={index}
                    offset={stop.offset}
                    stopColor={stop.color}
                    stopOpacity={stop.opacity}
                  />
                ))}
              </linearGradient>
              <linearGradient id="incomeStroke" x1="0" y1="0" x2="1" y2="0">
                {CHART_COLORS.SUCCESS.GRADIENT_STOPS.map((stop, index) => (
                  <stop
                    key={index}
                    offset={stop.offset}
                    stopColor={stop.color}
                    stopOpacity={stop.opacity}
                  />
                ))}
              </linearGradient>
              <linearGradient id="expenseStroke" x1="0" y1="0" x2="1" y2="0">
                {CHART_COLORS.WARNING.GRADIENT_STOPS.map((stop, index) => (
                  <stop
                    key={index}
                    offset={stop.offset}
                    stopColor={stop.color}
                    stopOpacity={stop.opacity}
                  />
                ))}
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme === THEME.DARK ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
              vertical={false}
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
              tickFormatter={value => `€${(value / 1000).toFixed(0)}k`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    formatSummaryAmount(Number(value)),
                    name === 'income' ? 'Income' : 'Expenses',
                  ]}
                  labelFormatter={label => `Month: ${label}`}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="url(#incomeStroke)"
              strokeWidth={CHART_CONFIG.STROKE_WIDTH.THIN}
              fill="url(#incomeGradient)"
              fillOpacity={1}
              activeDot={{
                r: CHART_CONFIG.DOT_RADIUS.SMALL,
                strokeWidth: CHART_CONFIG.STROKE_WIDTH.THICK,
                stroke: ACTIVE_DOT_COLORS.SUCCESS,
                fill: '#FFF',
                opacity: 1.0,
              }}
              animationDuration={CHART_CONFIG.ANIMATION.DURATION.FAST}
              animationBegin={CHART_CONFIG.ANIMATION.DELAY.SHORT}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="url(#expenseStroke)"
              strokeWidth={CHART_CONFIG.STROKE_WIDTH.THIN}
              fill="url(#expenseGradient)"
              fillOpacity={1}
              activeDot={{
                r: CHART_CONFIG.DOT_RADIUS.SMALL,
                strokeWidth: CHART_CONFIG.STROKE_WIDTH.THICK,
                stroke: ACTIVE_DOT_COLORS.WARNING,
                fill: '#FFF',
                opacity: 1.0,
              }}
              animationDuration={CHART_CONFIG.ANIMATION.DURATION.FAST}
              animationBegin={CHART_CONFIG.ANIMATION.DELAY.MEDIUM}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
