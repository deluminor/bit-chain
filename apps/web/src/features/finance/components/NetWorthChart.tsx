'use client';

import { ChartSkeleton } from '@/components/layout/charts/ChartSkeleton';
import { ChartWrapper } from '@/components/layout/charts/ChartWrapper';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { FINANCE_COLORS } from '@/constants/colors';
import { formatSummaryAmount } from '@/lib/currency';
import { THEME, useStore } from '@/store';
import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from 'recharts';
import { useAccounts } from '../queries/accounts';
import { useTransactions } from '../queries/transactions';
import { NetWorthInsightsPanels } from './net-worth/NetWorthInsightsPanels';
import { NetWorthSummaryCards } from './net-worth/NetWorthSummaryCards';
import { useNetWorthChartData } from './net-worth/use-net-worth-chart-data';
import { useNetWorthPerformance } from './net-worth/use-net-worth-performance';

export function NetWorthChart() {
  const { theme, selectedDateRange } = useStore();

  const { data: accountsData, isLoading: accountsLoading } = useAccounts();
  const canFetchTransactions = Boolean(selectedDateRange?.from && selectedDateRange?.to);
  const { data: transactionsData, isLoading: transactionsLoading } = useTransactions({
    dateFrom: selectedDateRange?.from?.toISOString().split('T')[0],
    dateTo: selectedDateRange?.to?.toISOString().split('T')[0],
    limit: 3000,
  });

  const accounts = useMemo(() => accountsData?.accounts ?? [], [accountsData?.accounts]);
  const transactions = useMemo(
    () => transactionsData?.transactions ?? [],
    [transactionsData?.transactions],
  );

  const { chartData, isConverting } = useNetWorthChartData({
    accounts,
    transactions,
    canFetchTransactions,
  });

  const performance = useNetWorthPerformance(chartData);

  const chartConfig = {
    netWorth: {
      label: 'Net Worth',
      color: FINANCE_COLORS.NET_WORTH,
    },
    totalAssets: {
      label: 'Total Assets',
      color: FINANCE_COLORS.TRANSFER,
    },
  } satisfies ChartConfig;

  if (accountsLoading || transactionsLoading || isConverting) {
    return <ChartSkeleton />;
  }

  return (
    <ChartWrapper
      title="Net Worth Tracking (EUR)"
      description="Your total wealth over time (converted to EUR)"
      className="gap-1.5"
      headerClassName="pb-1.5 sm:pb-2"
    >
      <div className="pb-0">
        <div className="mb-4 sm:mb-5">
          <NetWorthSummaryCards performance={performance} />
        </div>

        <ChartContainer config={chartConfig} className="aspect-auto h-[400px] w-full">
          <AreaChart data={chartData} margin={{ top: 10, right: 5, left: 5, bottom: 10 }}>
            <defs>
              <linearGradient id="fillNetWorth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                <stop offset="50%" stopColor="var(--primary)" stopOpacity={0.15} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              horizontal
              stroke={theme === THEME.DARK ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}
              strokeDasharray="1 2"
              strokeWidth={0.5}
            />
            <ReferenceLine
              y={0}
              stroke={theme === THEME.DARK ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}
              strokeDasharray="2 2"
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
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
              padding={{ left: 0, right: 0 }}
            />
            <YAxis
              domain={['dataMin', 'dataMax']}
              tickFormatter={value => formatSummaryAmount(value)}
              tickLine={false}
              axisLine={false}
              tick={{
                fill: theme === THEME.DARK ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                fontSize: 12,
              }}
              tickMargin={10}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={value => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                  }}
                  formatter={(value, name) =>
                    `${formatSummaryAmount(Number(value))} EUR — ${
                      name === 'netWorth' ? 'Net Worth' : String(name)
                    }`
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="netWorth"
              type="monotone"
              fill="url(#fillNetWorth)"
              stroke="var(--primary)"
              strokeWidth={1.5}
              connectNulls
              dot={false}
              activeDot={{
                r: 4,
                strokeWidth: 2,
                stroke: 'var(--primary)',
                fill: theme === THEME.DARK ? '#000000' : '#ffffff',
                opacity: 1,
              }}
              isAnimationActive
              animationDuration={800}
              animationBegin={150}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ChartContainer>

        <div className="mt-5 sm:mt-6">
          <NetWorthInsightsPanels performance={performance} daysCount={chartData.length} />
        </div>
      </div>
    </ChartWrapper>
  );
}
