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
import { useAccountBalanceTrends } from '@/features/finance/hooks/useAccountBalanceTrends';
import { useIsClient } from '@/hooks/useIsClient';
import { formatSummaryAmount } from '@/lib/currency';

const chartConfig = {
  netWorth: {
    label: 'Net Worth',
    color: '#000000',
  },
} satisfies ChartConfig;

export function NetWorthChart() {
  const { theme } = useTheme();
  const isClient = useIsClient();
  const { data: balanceTrends, isLoading, error } = useAccountBalanceTrends();
  const isDark = theme === THEME.DARK;
  const primaryColor = isDark ? '#ffffff' : '#6b7280';

  if (!isClient || isLoading) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <div className="animate-pulse bg-muted/40 rounded-lg h-full w-full"></div>
      </div>
    );
  }

  if (error || !balanceTrends?.length) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <div className="text-muted-foreground">Failed to load chart data</div>
      </div>
    );
  }

  // Calculate net worth for each month by summing all account balances
  const chartData = balanceTrends.map(dataPoint => {
    const accountNames = Object.keys(dataPoint).filter(key => key !== 'date');
    const totalNetWorth = accountNames.reduce((sum, accountName) => {
      return sum + (Number(dataPoint[accountName]) || 0);
    }, 0);

    return {
      date: dataPoint.date,
      netWorth: totalNetWorth,
    };
  });

  // Calculate growth metrics
  const startValue = chartData[0]?.netWorth || 0;
  const endValue = chartData[chartData.length - 1]?.netWorth || 0;
  const totalGrowth = endValue - startValue;
  const growthPercentage = startValue > 0.01 ? ((totalGrowth / startValue) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-4">
      {/* Growth Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="text-lg font-semibold text-foreground">
            {formatSummaryAmount(totalGrowth)}
          </div>
          <div className="text-xs text-muted-foreground">Total Growth</div>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div
            className={`text-lg font-semibold ${totalGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}
          >
            {totalGrowth >= 0 ? '+' : ''}
            {growthPercentage}%
          </div>
          <div className="text-xs text-muted-foreground">Growth Rate</div>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="text-lg font-semibold text-foreground">
            {formatSummaryAmount(endValue)}
          </div>
          <div className="text-xs text-muted-foreground">Current Worth</div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full pt-4">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
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
    </div>
  );
}
