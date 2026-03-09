'use client';

import { ChartSkeleton } from '@/components/layout/charts/ChartSkeleton';
import { ChartWrapper } from '@/components/layout/charts/ChartWrapper';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { formatSummaryAmount } from '@/lib/currency';
import { THEME, useStore } from '@/store';
import { Wallet } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from 'recharts';
import { useAccounts, type FinanceAccount } from '../queries/accounts';
import { useTransactions, type Transaction } from '../queries/transactions';
import { AccountBalanceTrendsControls } from './account-balance-trends/AccountBalanceTrendsControls';
import { AccountBalanceTrendsLegend } from './account-balance-trends/AccountBalanceTrendsLegend';
import { useAccountBalanceTrendData } from './account-balance-trends/use-account-balance-trend-data';

export function AccountBalanceTrendsChart() {
  const { theme, selectedDateRange } = useStore();
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);

  const { data: accountsData, isLoading: accountsLoading } = useAccounts();
  const { data: transactionsData, isLoading: transactionsLoading } = useTransactions({
    dateFrom: selectedDateRange?.from?.toISOString().split('T')[0],
    dateTo: selectedDateRange?.to?.toISOString().split('T')[0],
    limit: 2000,
  });

  const canFetchTransactions = Boolean(selectedDateRange?.from && selectedDateRange?.to);

  const accounts = useMemo<FinanceAccount[]>(
    () => accountsData?.accounts ?? [],
    [accountsData?.accounts],
  );
  const transactions = useMemo<Transaction[]>(
    () => transactionsData?.transactions ?? [],
    [transactionsData?.transactions],
  );

  const accountsToShow = useMemo(() => {
    if (selectedAccounts.length > 0) {
      return accounts.filter(account => selectedAccounts.includes(account.id));
    }

    return [...accounts].sort((a, b) => b.balance - a.balance).slice(0, 5);
  }, [accounts, selectedAccounts]);

  const { chartData, isConverting } = useAccountBalanceTrendData({
    accounts,
    accountsToShow,
    transactions,
    canFetchTransactions,
  });

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    accountsToShow.forEach((account, index) => {
      config[account.id] = {
        label: account.name,
        color: account.color || `hsl(${(index * 60) % 360}, 70%, 50%)`,
      };
    });
    return config;
  }, [accountsToShow]);

  const handleAccountToggle = (accountId: string) => {
    setSelectedAccounts(previous =>
      previous.includes(accountId)
        ? previous.filter(currentId => currentId !== accountId)
        : [...previous, accountId],
    );
  };

  if (accountsLoading || transactionsLoading || isConverting) {
    return <ChartSkeleton />;
  }

  if (!accountsToShow.length) {
    return (
      <ChartWrapper
        title="Account Balance Trends"
        description="Track balance changes over time"
        isLoading={false}
      >
        <div className="py-8 text-center text-muted-foreground">
          <Wallet className="mx-auto mb-2 h-8 w-8 opacity-50" />
          <p className="text-sm">No accounts to display</p>
        </div>
      </ChartWrapper>
    );
  }

  const isChartLoading = accountsLoading || transactionsLoading || isConverting;

  return (
    <ChartWrapper
      title="Account Balance Trends (EUR)"
      description="Balance changes over time for selected accounts (converted to EUR)"
      headerActions={
        <AccountBalanceTrendsControls
          accounts={accounts}
          accountsToShow={accountsToShow}
          selectedAccounts={selectedAccounts}
          onToggle={handleAccountToggle}
        />
      }
      isLoading={isChartLoading}
    >
      <div className="space-y-6">
        <AccountBalanceTrendsLegend accounts={accountsToShow} />

        <ChartContainer config={chartConfig} className="aspect-auto h-[400px] w-full">
          <LineChart data={chartData} margin={{ top: 10, right: 5, left: 5, bottom: 10 }}>
            <CartesianGrid
              vertical={false}
              horizontal
              stroke={theme === THEME.DARK ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
              strokeDasharray="3 4"
              strokeWidth={0.8}
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
              tickFormatter={value => formatSummaryAmount(value)}
              tickLine={false}
              axisLine={false}
              tick={{
                fill: theme === THEME.DARK ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                fontSize: 12,
              }}
              tickMargin={10}
              domain={['dataMin', 'dataMax']}
            />
            <ReferenceLine
              y={0}
              stroke={theme === THEME.DARK ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}
              strokeDasharray="2 2"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={value => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                  }}
                  formatter={(value: unknown, name: string | number) => {
                    if (typeof value === 'number') {
                      const account = accountsToShow.find(
                        (candidate: FinanceAccount) => candidate.id === name,
                      );
                      return [`${formatSummaryAmount(value)} EUR`, account?.name || name];
                    }
                    return [String(value), name];
                  }}
                  indicator="line"
                />
              }
            />

            {accountsToShow.map((account, index) => (
              <Line
                key={account.id}
                dataKey={account.id}
                type="monotone"
                stroke={account.color || `hsl(${index * 60}, 70%, 50%)`}
                strokeWidth={2.5}
                dot={{ fill: account.color, strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
                connectNulls
                isAnimationActive
                animationDuration={1200}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </div>
    </ChartWrapper>
  );
}
