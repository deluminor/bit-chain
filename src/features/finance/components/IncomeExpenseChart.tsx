'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { DatePicker } from '@/components/ui/date-picker';
import { useIsMobile } from '@/hooks/useMobile';
import { THEME, useStore } from '@/store';
import { startOfDay, subDays, format, startOfMonth } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { ChartSkeleton } from '@/components/layout/charts/ChartSkeleton';
import { useTransactions } from '../queries/transactions';
import { TrendingUp } from 'lucide-react';
import { formatSummaryAmount } from '@/lib/currency';

export function IncomeExpenseChart() {
  const isMobile = useIsMobile();
  const { theme } = useStore();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(subDays(new Date(), 90)),
    to: new Date(),
  });

  const { data: transactionsData, isLoading } = useTransactions({
    dateFrom: dateRange?.from?.toISOString().split('T')[0],
    dateTo: dateRange?.to?.toISOString().split('T')[0],
    limit: 1000,
  });

  const chartConfig = {
    income: {
      label: 'Income',
      color: '#10B981', // Green
    },
    expenses: {
      label: 'Expenses',
      color: '#EF4444', // Red
    },
  } satisfies ChartConfig;

  useEffect(() => {
    if (isMobile) {
      setDateRange({
        from: subDays(new Date(), 30),
        to: new Date(),
      });
    }
  }, [isMobile]);

  // Process transaction data into daily/weekly chart data
  const chartData = useMemo(() => {
    if (!transactionsData?.transactions) return [];

    const transactions = transactionsData.transactions;
    const dataMap = new Map<string, { date: string; income: number; expenses: number }>();

    transactions.forEach(transaction => {
      const date = format(new Date(transaction.date), 'yyyy-MM-dd');

      if (!dataMap.has(date)) {
        dataMap.set(date, { date, income: 0, expenses: 0 });
      }

      const dayData = dataMap.get(date)!;

      if (transaction.type === 'INCOME') {
        dayData.income += transaction.amount;
      } else if (transaction.type === 'EXPENSE') {
        dayData.expenses += transaction.amount;
      }
    });

    // Convert map to array and sort by date
    const sortedData = Array.from(dataMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    // If we have more than 60 days, group by week for better readability
    if (sortedData.length > 60) {
      const weeklyData = new Map<string, { date: string; income: number; expenses: number }>();

      sortedData.forEach(day => {
        const weekStart = format(startOfDay(new Date(day.date)), 'yyyy-MM-dd');
        const weekKey = `Week of ${format(new Date(weekStart), 'MMM dd')}`;

        if (!weeklyData.has(weekKey)) {
          weeklyData.set(weekKey, { date: weekKey, income: 0, expenses: 0 });
        }

        const weekData = weeklyData.get(weekKey)!;
        weekData.income += day.income;
        weekData.expenses += day.expenses;
      });

      return Array.from(weeklyData.values());
    }

    return sortedData;
  }, [transactionsData]);

  // Calculate totals for summary
  const totals = useMemo(() => {
    if (!chartData.length) return { income: 0, expenses: 0, net: 0 };

    const income = chartData.reduce((sum, day) => sum + day.income, 0);
    const expenses = chartData.reduce((sum, day) => sum + day.expenses, 0);

    return {
      income,
      expenses,
      net: income - expenses,
    };
  }, [chartData]);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  if (isLoading) return <ChartSkeleton />;

  return (
    <Card className="@container/card">
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Income vs Expenses
          </CardTitle>
          <CardDescription>Daily income and expense tracking over time</CardDescription>
        </div>
        <div>
          <DatePicker
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            mode="range"
            showPresets
            placeholder="Last 3 months"
            className="w-full"
          />
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatSummaryAmount(totals.income)}
            </div>
            <div className="text-sm text-muted-foreground">Total Income</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {formatSummaryAmount(totals.expenses)}
            </div>
            <div className="text-sm text-muted-foreground">Total Expenses</div>
          </div>
          <div className="text-center">
            <div
              className={`text-2xl font-bold ${totals.net >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {totals.net >= 0 ? '+' : ''}
              {formatSummaryAmount(totals.net)}
            </div>
            <div className="text-sm text-muted-foreground">Net Amount</div>
          </div>
        </div>

        <ChartContainer config={chartConfig} className="aspect-auto h-[400px] w-full">
          <AreaChart data={chartData} margin={{ top: 10, right: 5, left: 5, bottom: 10 }}>
            <defs>
              <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
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
              <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
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
              vertical={false}
              horizontal={true}
              stroke={theme === THEME.DARK ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}
              strokeDasharray="1 2"
              strokeWidth={0.5}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: theme === THEME.DARK ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                fontSize: 12,
              }}
              tickMargin={10}
              minTickGap={40}
              tickFormatter={value => {
                if (value.startsWith('Week of')) {
                  return value.replace('Week of ', '');
                }
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
              padding={{ left: 0, right: 0 }}
            />
            <YAxis
              tickFormatter={value => formatSummaryAmount(value)}
              tickLine={false}
              axisLine={false}
              tick={{
                fill: theme === THEME.DARK ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                fontSize: 12,
              }}
              tickMargin={10}
              domain={[0, 'dataMax']}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={value => {
                    if (typeof value === 'string' && value.startsWith('Week of')) {
                      return value;
                    }
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                  }}
                  formatter={(value: any, name: string) => [
                    formatSummaryAmount(typeof value === 'number' ? value : Number(value)),
                    name === 'income' ? 'Income' : 'Expenses',
                  ]}
                  indicator="line"
                />
              }
            />
            <Area
              dataKey="expenses"
              type="monotone"
              fill="url(#fillExpenses)"
              stroke={theme === THEME.DARK ? '#d1d5db' : '#6b7280'}
              strokeWidth={0.7}
              connectNulls
              dot={false}
              activeDot={{
                r: 4,
                strokeWidth: 2,
                stroke: theme === THEME.DARK ? '#d1d5db' : '#6b7280',
                fill: theme === THEME.DARK ? '#000000' : '#ffffff',
                opacity: 1,
              }}
              isAnimationActive={true}
              animationDuration={800}
              stackId="1"
            />
            <Area
              dataKey="income"
              type="monotone"
              fill="url(#fillIncome)"
              stroke={theme === THEME.DARK ? '#ffffff' : '#4b5563'}
              strokeWidth={0.7}
              connectNulls
              dot={false}
              activeDot={{
                r: 4,
                strokeWidth: 2,
                stroke: theme === THEME.DARK ? '#ffffff' : '#4b5563',
                fill: theme === THEME.DARK ? '#000000' : '#ffffff',
                opacity: 1,
              }}
              isAnimationActive={true}
              animationDuration={800}
              stackId="2"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
