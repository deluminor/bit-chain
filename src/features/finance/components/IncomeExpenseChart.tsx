'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartWrapper } from '@/components/layout/charts/ChartWrapper';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { THEME, useStore } from '@/store';
import { startOfDay, format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { ChartSkeleton } from '@/components/layout/charts/ChartSkeleton';
import { useTransactions } from '../queries/transactions';
import { FINANCE_COLORS } from '@/constants/colors';

import { convertToBaseCurrencySafe, formatSummaryAmount } from '@/lib/currency';

export function IncomeExpenseChart() {
  const { theme, selectedDateRange } = useStore();

  const { data: transactionsData, isLoading } = useTransactions({
    dateFrom: selectedDateRange?.from?.toISOString().split('T')[0],
    dateTo: selectedDateRange?.to?.toISOString().split('T')[0],
    limit: 1000,
  });

  const chartConfig = {
    income: {
      label: 'Income',
      color: FINANCE_COLORS.INCOME,
    },
    expenses: {
      label: 'Expenses',
      color: FINANCE_COLORS.EXPENSE,
    },
  } satisfies ChartConfig;

  // Process transaction data into daily/weekly chart data
  const [processedData, setProcessedData] = useState<
    Array<{ date: string; income: number; expenses: number }>
  >([]);

  useEffect(() => {
    const buildData = async () => {
      if (!transactionsData?.transactions) {
        setProcessedData([]);
        return;
      }

      const dataMap = new Map<string, { date: string; income: number; expenses: number }>();

      for (const transaction of transactionsData.transactions) {
        const date = format(new Date(transaction.date), 'yyyy-MM-dd');

        if (!dataMap.has(date)) {
          dataMap.set(date, { date, income: 0, expenses: 0 });
        }

        const dayData = dataMap.get(date)!;
        const amountInEur = await convertToBaseCurrencySafe(
          transaction.amount,
          transaction.currency,
        );

        if (transaction.type === 'INCOME') {
          dayData.income += amountInEur;
        } else if (transaction.type === 'EXPENSE') {
          dayData.expenses += amountInEur;
        }
      }

      const sortedData = Array.from(dataMap.values()).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

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

        setProcessedData(Array.from(weeklyData.values()));
        return;
      }

      setProcessedData(sortedData);
    };

    buildData();
  }, [transactionsData]);

  // Calculate totals for summary
  const totals = useMemo(() => {
    if (!processedData.length) return { income: 0, expenses: 0, net: 0 };

    const income = processedData.reduce((sum, day) => sum + day.income, 0);
    const expenses = processedData.reduce((sum, day) => sum + day.expenses, 0);

    return {
      income,
      expenses,
      net: income - expenses,
    };
  }, [processedData]);

  if (isLoading) return <ChartSkeleton />;

  return (
    <ChartWrapper
      title="Income vs Expenses"
      description="Daily income and expense tracking over time"
      className="@container/card"
    >
      <div className="px-2 pt-4 sm:px-6 sm:pt-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-income">
              {formatSummaryAmount(totals.income)}
            </div>
            <div className="text-sm text-muted-foreground">Total Income</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-expense">
              {formatSummaryAmount(totals.expenses)}
            </div>
            <div className="text-sm text-muted-foreground">Total Expenses</div>
          </div>
          <div className="text-center">
            <div
              className={`text-2xl font-bold ${totals.net >= 0 ? 'text-income' : 'text-expense'}`}
            >
              {totals.net >= 0 ? '+' : ''}
              {formatSummaryAmount(totals.net)}
            </div>
            <div className="text-sm text-muted-foreground">Net Amount</div>
          </div>
        </div>

        <ChartContainer config={chartConfig} className="aspect-auto h-[400px] w-full">
          <AreaChart data={processedData} margin={{ top: 10, right: 5, left: 5, bottom: 10 }}>
            <defs>
              <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--income)" stopOpacity={0.4} />
                <stop offset="50%" stopColor="var(--income)" stopOpacity={0.15} />
                <stop offset="100%" stopColor="var(--income)" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--expense)" stopOpacity={0.4} />
                <stop offset="50%" stopColor="var(--expense)" stopOpacity={0.15} />
                <stop offset="100%" stopColor="var(--expense)" stopOpacity={0.01} />
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
                  formatter={(value: any, name: any) => [
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
              stroke="var(--expense)"
              strokeWidth={1.5}
              connectNulls
              dot={false}
              activeDot={{
                r: 4,
                strokeWidth: 2,
                stroke: 'var(--expense)',
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
              stroke="var(--income)"
              strokeWidth={1.5}
              connectNulls
              dot={false}
              activeDot={{
                r: 4,
                strokeWidth: 2,
                stroke: 'var(--income)',
                fill: theme === THEME.DARK ? '#000000' : '#ffffff',
                opacity: 1,
              }}
              isAnimationActive={true}
              animationDuration={800}
              stackId="2"
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </ChartWrapper>
  );
}
