'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from 'recharts';
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
import { useAccounts } from '../queries/accounts';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { TotalBalanceDisplay } from '@/components/layout/TotalBalanceDisplay';
import { BASE_CURRENCY, currencyService, formatSummaryAmount } from '@/lib/currency';

interface NetWorthDataPoint {
  date: string;
  netWorth: number;
  totalAssets: number;
  change: number;
}

export function NetWorthChart() {
  const { theme } = useStore();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(subDays(new Date(), 180)), // 6 months
    to: new Date(),
  });
  const [chartData, setChartData] = useState<NetWorthDataPoint[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  const { data: accountsData, isLoading: accountsLoading } = useAccounts();
  const { data: transactionsData, isLoading: transactionsLoading } = useTransactions({
    dateFrom: dateRange?.from?.toISOString().split('T')[0],
    dateTo: dateRange?.to?.toISOString().split('T')[0],
    limit: 3000,
  });

  const accounts = accountsData?.accounts || [];
  const transactions = transactionsData?.transactions || [];

  // Calculate net worth trends over time with currency conversion
  useEffect(() => {
    const generateChartData = async () => {
      if (!accounts.length || !transactions.length) {
        // If no transactions, just show current net worth converted to EUR
        setIsConverting(true);
        let currentNetWorthEur = 0;

        try {
          for (const acc of accounts) {
            let balanceInEur = acc.balance;
            if (acc.currency !== BASE_CURRENCY) {
              try {
                balanceInEur = await currencyService.convertToBaseCurrency(
                  acc.balance,
                  acc.currency,
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
                balanceInEur = acc.balance * (fallbackRates[acc.currency] || 1);
              }
            }
            currentNetWorthEur += balanceInEur;
          }

          setChartData([
            {
              date: format(new Date(), 'yyyy-MM-dd'),
              netWorth: currentNetWorthEur,
              totalAssets: currentNetWorthEur,
              change: 0,
            },
          ]);
        } catch (error) {
          console.error('Failed to convert currencies:', error);
          setChartData([]);
        } finally {
          setIsConverting(false);
        }
        return;
      }

      setIsConverting(true);
      try {
        const dataMap = new Map<string, NetWorthDataPoint>();

        // Initialize with current account balances converted to EUR
        const currentBalances = new Map<string, number>();
        for (const account of accounts) {
          let balanceInEur = account.balance;
          if (account.currency !== BASE_CURRENCY) {
            try {
              balanceInEur = await currencyService.convertToBaseCurrency(
                account.balance,
                account.currency,
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
              balanceInEur = account.balance * (fallbackRates[account.currency] || 1);
            }
          }
          currentBalances.set(account.id, balanceInEur);
        }

        // Sort transactions by date (newest first to work backwards)
        const sortedTransactions = [...transactions].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

        let previousNetWorth = 0;

        // Calculate net worth for each day working backwards
        for (let index = 0; index < sortedTransactions.length; index++) {
          const transaction = sortedTransactions[index];
          if (!transaction) continue;
          const date = format(new Date(transaction.date), 'yyyy-MM-dd');

          // Calculate current net worth
          const currentNetWorth = Array.from(currentBalances.values()).reduce(
            (sum, balance) => sum + balance,
            0,
          );

          if (!dataMap.has(date)) {
            const change = index === 0 ? 0 : currentNetWorth - previousNetWorth;
            dataMap.set(date, {
              date,
              netWorth: currentNetWorth,
              totalAssets: Math.max(currentNetWorth, 0), // Only positive assets
              change,
            });
          }

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

          // Update balances for previous day (working backwards)
          if (transaction.type === 'INCOME') {
            const currentBalance = currentBalances.get(transaction.account.id) || 0;
            currentBalances.set(transaction.account.id, currentBalance - transactionAmountEur);
          } else if (transaction.type === 'EXPENSE') {
            const currentBalance = currentBalances.get(transaction.account.id) || 0;
            currentBalances.set(transaction.account.id, currentBalance + transactionAmountEur);
          } else if (transaction.type === 'TRANSFER') {
            const fromBalance = currentBalances.get(transaction.account.id) || 0;
            currentBalances.set(transaction.account.id, fromBalance + transactionAmountEur);

            if (transaction.transferTo) {
              const toBalance = currentBalances.get(transaction.transferTo.id) || 0;
              currentBalances.set(transaction.transferTo.id, toBalance - transactionAmountEur);
            }
          }

          previousNetWorth = currentNetWorth;
        }

        // Convert to array and sort by date
        const sortedData = Array.from(dataMap.values()).sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

        // Calculate proper change values
        const finalData = sortedData.map((item, index) => ({
          ...item,
          change: index === 0 ? 0 : item.netWorth - (sortedData[index - 1]?.netWorth || 0),
        }));

        setChartData(finalData);
      } catch (error) {
        console.error('Failed to generate net worth chart data:', error);
        setChartData([]);
      } finally {
        setIsConverting(false);
      }
    };

    generateChartData();
  }, [accounts, transactions]);

  // Calculate performance metrics
  const performance = useMemo(() => {
    if (chartData.length < 2) {
      const currentNetWorth = chartData[0]?.netWorth || 0;
      return {
        currentNetWorth,
        startNetWorth: currentNetWorth,
        totalChange: 0,
        percentageChange: 0,
        highestNetWorth: currentNetWorth,
        lowestNetWorth: currentNetWorth,
        averageChange: 0,
      };
    }

    const current = chartData[chartData.length - 1]?.netWorth || 0;
    const start = chartData[0]?.netWorth || 0;
    const totalChange = current - start;
    const percentageChange = start !== 0 ? (totalChange / Math.abs(start)) * 100 : 0;

    const values = chartData.map(d => d.netWorth);
    const highest = Math.max(...values);
    const lowest = Math.min(...values);

    const changes = chartData.slice(1).map(d => d.change);
    const averageChange =
      changes.length > 0 ? changes.reduce((sum, change) => sum + change, 0) / changes.length : 0;

    return {
      currentNetWorth: current,
      startNetWorth: start,
      totalChange,
      percentageChange,
      highestNetWorth: highest,
      lowestNetWorth: lowest,
      averageChange,
    };
  }, [chartData]);

  const chartConfig = {
    netWorth: {
      label: 'Net Worth',
      color: '#10B981', // Green
    },
    totalAssets: {
      label: 'Total Assets',
      color: '#3B82F6', // Blue
    },
  } satisfies ChartConfig;

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  if (accountsLoading || transactionsLoading || isConverting) return <ChartSkeleton />;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Net Worth Tracking (EUR)
          </CardTitle>
          <CardDescription>Your total wealth over time (converted to EUR)</CardDescription>
        </div>

        <DatePicker
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          mode="range"
          showPresets
          placeholder="Last 6 months"
          className="w-full"
        />
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Performance Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-green-600">
              <TotalBalanceDisplay size="lg" className="text-green-600" />
            </div>
            <div className="text-sm text-muted-foreground">Current Net Worth</div>
          </div>

          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div
              className={`text-2xl font-bold flex items-center justify-center gap-1 ${
                performance.totalChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {performance.totalChange >= 0 ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
              {performance.totalChange >= 0 ? '+' : ''}
              {formatSummaryAmount(performance.totalChange)}
            </div>
            <div className="text-sm text-muted-foreground">Total Change</div>
          </div>

          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div
              className={`text-2xl font-bold ${
                performance.percentageChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {performance.percentageChange >= 0 ? '+' : ''}
              {performance.percentageChange.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">Growth Rate</div>
          </div>

          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold">
              <TotalBalanceDisplay size="lg" />
            </div>
            <div className="text-sm text-muted-foreground">Peak Value</div>
          </div>
        </div>

        {/* Chart */}
        <ChartContainer config={chartConfig} className="aspect-auto h-[400px] w-full">
          <AreaChart data={chartData} margin={{ top: 10, right: 5, left: 5, bottom: 10 }}>
            <defs>
              <linearGradient id="fillNetWorth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-netWorth)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-netWorth)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              horizontal={true}
              stroke={theme === THEME.DARK ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
              strokeDasharray="3 4"
              strokeWidth={0.8}
            />

            {/* Zero reference line */}
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
                  formatter={(value, name) => [
                    formatSummaryAmount(Number(value)) + ' EUR',
                    name === 'netWorth' ? 'Net Worth' : (name as string),
                  ]}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="netWorth"
              type="monotone"
              fill="url(#fillNetWorth)"
              stroke="var(--color-netWorth)"
              strokeWidth={3}
              connectNulls
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
              isAnimationActive={true}
              animationDuration={1500}
              animationBegin={0}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ChartContainer>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border bg-card">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Growth Insights
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average daily change:</span>
                <span
                  className={`font-medium ${
                    performance.averageChange >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {performance.averageChange >= 0 ? '+' : ''}€{performance.averageChange.toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Peak net worth:</span>
                <span className="font-medium">
                  {formatSummaryAmount(performance.highestNetWorth)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lowest point:</span>
                <span className="font-medium">
                  {formatSummaryAmount(performance.lowestNetWorth)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-card">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Wealth Status
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Growth trend:</span>
                <Badge variant={performance.totalChange >= 0 ? 'default' : 'destructive'}>
                  {performance.totalChange >= 0 ? 'Positive' : 'Negative'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Volatility:</span>
                <Badge variant="outline">
                  {Math.abs(performance.highestNetWorth - performance.lowestNetWorth) >= 10000
                    ? 'High'
                    : 'Low'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Period analyzed:</span>
                <span className="font-medium">{chartData.length} days</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
