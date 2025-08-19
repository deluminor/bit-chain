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
// Using minimalist styles to match other charts
import { useAccountBalanceTrends } from '@/features/finance/hooks/useAccountBalanceTrends';
import { useIsClient } from '@/hooks/useIsClient';
import { formatSummaryAmount } from '@/lib/currency';

const chartConfig = {
  accounts: {
    label: 'Account Balances',
    color: '#6b7280',
  },
} satisfies ChartConfig;

export function AccountBalanceTrendsChart() {
  const { theme } = useTheme();
  const isClient = useIsClient();
  const { data: balanceTrends, isLoading, error } = useAccountBalanceTrends();

  if (!isClient || isLoading) {
    return (
      <div className="h-[350px] w-full flex items-center justify-center">
        <div className="animate-pulse bg-muted/40 rounded-lg h-full w-full"></div>
      </div>
    );
  }

  if (error || !balanceTrends?.length) {
    return (
      <div className="h-[350px] w-full flex items-center justify-center">
        <div className="text-muted-foreground">Failed to load balance trends</div>
      </div>
    );
  }

  // Get all account names from the data (excluding 'date') and sort by latest balance
  const accountNames = Object.keys(balanceTrends[0] || {}).filter(key => key !== 'date');

  // Sort accounts by their latest balance (largest first)
  const sortedAccountNames = accountNames.sort((a, b) => {
    const latestDataPoint = balanceTrends[balanceTrends.length - 1] || {};
    const balanceA = Number((latestDataPoint as any)[a] || 0);
    const balanceB = Number((latestDataPoint as any)[b] || 0);
    return balanceB - balanceA;
  });

  // Filter to show only accounts with non-zero balances
  const filteredAccountNames = sortedAccountNames.filter(accountName => {
    return balanceTrends.some(dataPoint => Number((dataPoint as any)[accountName] || 0) > 0);
  });

  // Use original balance trends data for individual account lines

  return (
    <div className="h-[350px] w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={balanceTrends} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
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
              dataKey="date"
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
              domain={[0, 'dataMax']}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    const numValue = Number(value);
                    if (numValue === 0) return null;
                    return [formatSummaryAmount(numValue), ` ${name as string}`];
                  }}
                  labelFormatter={label => `Month: ${label}`}
                />
              }
            />
            {filteredAccountNames.map((accountName, index) => {
              const isIncomeStyle = index % 2 === 0;
              const gradientId = isIncomeStyle ? 'incomeGradient' : 'expenseGradient';
              const strokeColor = isIncomeStyle
                ? (theme === THEME.DARK ? '#ffffff' : '#4b5563')
                : (theme === THEME.DARK ? '#d1d5db' : '#6b7280');
              return (
                <Area
                  key={accountName}
                  type="monotone"
                  dataKey={accountName}
                  stroke={strokeColor}
                  strokeWidth={0.7}
                  fill={`url(#${gradientId})`}
                  fillOpacity={1}
                  dot={false}
                  activeDot={{
                    r: 4,
                    strokeWidth: 2,
                    stroke: strokeColor,
                    fill: theme === THEME.DARK ? '#000000' : '#ffffff',
                    opacity: 1,
                  }}
                  animationDuration={800}
                  animationBegin={150 + index * 100}
                />
              );
            })}
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
