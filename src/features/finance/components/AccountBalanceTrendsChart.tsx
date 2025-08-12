'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { DatePicker } from '@/components/ui/date-picker';
import { THEME, useStore } from '@/store';
import { subDays, format, startOfMonth } from 'date-fns';
import { useMemo, useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { ChartSkeleton } from '@/components/layout/charts/ChartSkeleton';
import { useTransactions } from '../queries/transactions';
import { useAccounts, FinanceAccount } from '../queries/accounts';
import { TrendingUp, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  formatCurrency,
  currencyService,
  formatSummaryAmount,
  BASE_CURRENCY,
} from '@/lib/currency';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';

interface BalanceDataPoint {
  date: string;
  [accountId: string]: number | string;
}

export function AccountBalanceTrendsChart() {
  const { theme } = useStore();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(subDays(new Date(), 90)),
    to: new Date(),
  });
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [chartData, setChartData] = useState<BalanceDataPoint[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  const { data: accountsData, isLoading: accountsLoading } = useAccounts();
  const { data: transactionsData, isLoading: transactionsLoading } = useTransactions({
    dateFrom: dateRange?.from?.toISOString().split('T')[0],
    dateTo: dateRange?.to?.toISOString().split('T')[0],
    limit: 2000,
  });

  const accounts = accountsData?.accounts || [];
  const transactions = transactionsData?.transactions || [];

  // Auto-select top 5 accounts by balance if none selected
  const accountsToShow = useMemo(() => {
    if (selectedAccounts.length > 0) {
      return accounts.filter((acc: FinanceAccount) => selectedAccounts.includes(acc.id));
    }

    // Auto-select top 5 accounts by balance
    return accounts
      .sort((a: FinanceAccount, b: FinanceAccount) => b.balance - a.balance)
      .slice(0, 5);
  }, [accounts, selectedAccounts]);

  // Generate chart data with balance trends converted to EUR
  useEffect(() => {
    const generateChartData = async () => {
      if (!accounts.length || !transactions.length) {
        setChartData([]);
        return;
      }

      setIsConverting(true);
      try {
        const dataMap = new Map<string, BalanceDataPoint>();

        // Initialize account starting balances and convert to EUR
        const accountBalances = new Map<string, number>();

        for (const account of accounts) {
          let balanceInEur = account.balance;
          if (account.currency !== BASE_CURRENCY) {
            try {
              balanceInEur = await currencyService.convertToBaseCurrency(
                account.balance,
                account.currency,
              );
            } catch {
              // Use fallback rates
              const fallbackRates: Record<string, number> = {
                USD: 0.9,
                UAH: 0.025,
                GBP: 1.15,
                PLN: 0.23,
                CZK: 0.04,
                CHF: 1.05,
                CAD: 0.68,
                JPY: 0.0062,
              };
              balanceInEur = account.balance * (fallbackRates[account.currency] || 1);
            }
          }
          accountBalances.set(account.id, balanceInEur);
        }

        // Sort transactions by date (newest first to work backwards)
        const sortedTransactions = [...transactions].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

        // Calculate running balance backwards through time
        for (const transaction of sortedTransactions) {
          const date = format(new Date(transaction.date), 'yyyy-MM-dd');

          if (!dataMap.has(date)) {
            const point: BalanceDataPoint = { date };
            accountsToShow.forEach((account: FinanceAccount) => {
              point[account.id] = accountBalances.get(account.id) || 0;
            });
            dataMap.set(date, point);
          }

          const dayData = dataMap.get(date)!;

          // Convert transaction amount to EUR
          let transactionAmountEur = transaction.amount;
          if (transaction.currency && transaction.currency !== BASE_CURRENCY) {
            try {
              transactionAmountEur = await currencyService.convertToBaseCurrency(
                transaction.amount,
                transaction.currency,
              );
            } catch {
              const fallbackRates: Record<string, number> = {
                USD: 0.9,
                UAH: 0.025,
                GBP: 1.15,
                PLN: 0.23,
                CZK: 0.04,
                CHF: 1.05,
                CAD: 0.68,
                JPY: 0.0062,
              };
              transactionAmountEur =
                transaction.amount * (fallbackRates[transaction.currency] || 1);
            }
          }

          // Adjust balance for this transaction (working backwards)
          if (transaction.type === 'INCOME') {
            const currentBalance = accountBalances.get(transaction.account.id) || 0;
            accountBalances.set(transaction.account.id, currentBalance - transactionAmountEur);
          } else if (transaction.type === 'EXPENSE') {
            const currentBalance = accountBalances.get(transaction.account.id) || 0;
            accountBalances.set(transaction.account.id, currentBalance + transactionAmountEur);
          } else if (transaction.type === 'TRANSFER') {
            const fromBalance = accountBalances.get(transaction.account.id) || 0;
            accountBalances.set(transaction.account.id, fromBalance + transactionAmountEur);

            if (transaction.transferTo) {
              const toBalance = accountBalances.get(transaction.transferTo.id) || 0;
              accountBalances.set(transaction.transferTo.id, toBalance - transactionAmountEur);
            }
          }

          // Update the day data with new balances
          accountsToShow.forEach((account: FinanceAccount) => {
            dayData[account.id] = accountBalances.get(account.id) || 0;
          });
        }

        // Convert to array and sort by date
        const data = Array.from(dataMap.values()).sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

        setChartData(data);
      } catch (error) {
        console.error('Failed to generate chart data:', error);
        setChartData([]);
      } finally {
        setIsConverting(false);
      }
    };

    generateChartData();
  }, [accounts, transactions, accountsToShow]);

  // Generate chart config dynamically based on selected accounts
  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    accountsToShow.forEach((account: FinanceAccount, index: number) => {
      config[account.id] = {
        label: account.name,
        color: account.color || `hsl(${(index * 60) % 360}, 70%, 50%)`,
      };
    });
    return config;
  }, [accountsToShow]);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const handleAccountToggle = (accountId: string) => {
    setSelectedAccounts(prev =>
      prev.includes(accountId) ? prev.filter(id => id !== accountId) : [...prev, accountId],
    );
  };

  if (accountsLoading || transactionsLoading || isConverting) return <ChartSkeleton />;

  if (!accountsToShow.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Account Balance Trends
          </CardTitle>
          <CardDescription>Track balance changes over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <Wallet className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No accounts to display</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Account Balance Trends (EUR)
          </CardTitle>
          <CardDescription>
            Balance changes over time for selected accounts (converted to EUR)
          </CardDescription>
        </div>

        <div className="flex gap-2">
          {/* Account Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Accounts ({accountsToShow.length})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <div className="text-sm font-medium mb-2">Select Accounts</div>
                {accounts.map((account: FinanceAccount) => (
                  <DropdownMenuCheckboxItem
                    key={account.id}
                    checked={
                      selectedAccounts.includes(account.id) ||
                      (selectedAccounts.length === 0 &&
                        accountsToShow.some((a: FinanceAccount) => a.id === account.id))
                    }
                    onCheckedChange={() => handleAccountToggle(account.id)}
                    className="flex items-center gap-2"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: account.color }}
                    />
                    <span className="flex-1">{account.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {formatCurrency(account.balance, account.currency, {
                        useLargeNumberFormat: false,
                      })}
                    </Badge>
                  </DropdownMenuCheckboxItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Date Picker */}
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

      <CardContent>
        {/* Account Legend */}
        <div className="flex flex-wrap gap-3 mb-6">
          {accountsToShow.map((account: FinanceAccount) => (
            <div key={account.id} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: account.color }} />
              <span className="text-sm font-medium">{account.name}</span>
              <Badge variant="secondary" className="text-xs">
                {formatCurrency(account.balance, account.currency, { useLargeNumberFormat: false })}
              </Badge>
            </div>
          ))}
        </div>

        <ChartContainer config={chartConfig} className="aspect-auto h-[400px] w-full">
          <LineChart data={chartData} margin={{ top: 10, right: 5, left: 5, bottom: 10 }}>
            <CartesianGrid
              vertical={false}
              horizontal={true}
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

            {/* Zero reference line */}
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
                  formatter={(
                    value: unknown,
                    name: string | number,
                  ): [React.ReactNode, React.ReactNode] => {
                    if (typeof value === 'number') {
                      const account = accountsToShow.find((a: FinanceAccount) => a.id === name);
                      return [formatSummaryAmount(value) + ' EUR', account?.name || name];
                    }
                    return [String(value), name];
                  }}
                  indicator="line"
                />
              }
            />

            {accountsToShow.map((account: FinanceAccount) => (
              <Line
                key={account.id}
                dataKey={account.id}
                type="monotone"
                stroke={account.color || `hsl(${accountsToShow.indexOf(account) * 60}, 70%, 50%)`}
                strokeWidth={2.5}
                dot={{ fill: account.color, strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
                connectNulls
                isAnimationActive={true}
                animationDuration={1200}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
