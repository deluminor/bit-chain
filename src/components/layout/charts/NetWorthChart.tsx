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
import { useNetWorth } from '@/features/finance/hooks/useNetWorth';
import { useIsClient } from '@/hooks/useIsClient';
import { formatSummaryAmount } from '@/lib/currency';
import { ChartWrapper } from './ChartWrapper';
import { TrendingUp, TrendingDown } from 'lucide-react';

const chartConfig = {
  netWorth: {
    label: 'Net Worth',
    color: '#000000',
  },
} satisfies ChartConfig;

export function NetWorthChart() {
  const { theme } = useTheme();
  const isClient = useIsClient();
  const { data: netWorthData, isLoading, error } = useNetWorth();
  const isDark = theme === THEME.DARK;
  const primaryColor = isDark ? '#ffffff' : '#6b7280';

  if (!isClient) {
    return (
      <ChartWrapper title="Net Worth" description="Track your total net worth over time">
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </ChartWrapper>
    );
  }

  if (isLoading) {
    return (
      <ChartWrapper title="Net Worth" description="Track your total net worth over time">
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </ChartWrapper>
    );
  }

  if (error || !netWorthData || netWorthData.length === 0) {
    return (
      <ChartWrapper title="Net Worth" description="Track your total net worth over time">
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-muted-foreground">No data available</div>
        </div>
      </ChartWrapper>
    );
  }

  // Calculate growth metrics
  const currentNetWorth = netWorthData[netWorthData.length - 1]?.netWorth || 0;
  const totalGrowth = currentNetWorth - (netWorthData[0]?.netWorth || 0);
  const growthPercentage = netWorthData[0]?.netWorth
    ? ((totalGrowth / Math.abs(netWorthData[0].netWorth)) * 100).toFixed(1)
    : '0';
  const isPositive = totalGrowth >= 0;

  const footer = (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-1">
        {isPositive ? (
          <TrendingUp className="h-4 w-4 text-green-600" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-600" />
        )}
        <span className="text-muted-foreground">Change:</span>
        <span className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}
          {growthPercentage}%
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground">Current:</span>
        <span className="font-medium">{formatSummaryAmount(currentNetWorth)}</span>
      </div>
    </div>
  );

  return (
    <ChartWrapper
      title="Net Worth"
      description="Track your total net worth over time"
      footer={footer}
      isLoading={isLoading}
    >
      <div className="h-[300px] w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={netWorthData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
              <defs>
                <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={primaryColor} stopOpacity={0.55} />
                  <stop offset="15%" stopColor={primaryColor} stopOpacity={0.48} />
                  <stop offset="30%" stopColor={primaryColor} stopOpacity={0.38} />
                  <stop offset="50%" stopColor={primaryColor} stopOpacity={0.25} />
                  <stop offset="70%" stopColor={primaryColor} stopOpacity={0.15} />
                  <stop offset="85%" stopColor={primaryColor} stopOpacity={0.08} />
                  <stop offset="100%" stopColor={primaryColor} stopOpacity={0.02} />
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
                    formatter={value => [formatSummaryAmount(Number(value)), ' Net Worth']}
                    labelFormatter={label => `${label}`}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="netWorth"
                stroke={primaryColor}
                strokeWidth={0.7}
                fill="url(#netWorthGradient)"
                fillOpacity={1}
                dot={false}
                activeDot={{
                  r: 4,
                  strokeWidth: 2,
                  stroke: primaryColor,
                  fill: isDark ? '#000000' : '#ffffff',
                  opacity: 1,
                }}
                animationDuration={800}
                animationBegin={150}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </ChartWrapper>
  );
}
