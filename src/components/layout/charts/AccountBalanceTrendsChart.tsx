'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useTheme } from '@/providers/ThemeProvider';
import { THEME } from '@/store';
import { LINE_COLORS, CHART_CONFIG, CHART_COLORS } from '@/constants/colors';
import { useAccountBalanceTrends } from '@/features/finance/hooks/useAccountBalanceTrends';
import { useIsClient } from '@/hooks/useIsClient';
import { formatSummaryAmount } from '@/lib/currency';

const chartConfig = {
  'Main Bank Account': {
    label: 'Main Bank Account',
    color: LINE_COLORS['Bank Account'],
  },
  'Savings Account': {
    label: 'Savings Account',
    color: LINE_COLORS.Savings,
  },
  'Cash Wallet': {
    label: 'Cash Wallet',
    color: LINE_COLORS.Cash,
  },
  'Investment Account': {
    label: 'Investment Account',
    color: LINE_COLORS.Investment,
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

  // Get all account names from the data (excluding 'date')
  const accountNames = Object.keys(balanceTrends[0] || {}).filter(key => key !== 'date');
  const colors = [
    CHART_COLORS.PRIMARY.DEFAULT,
    CHART_COLORS.SUCCESS.DEFAULT,
    CHART_COLORS.WARNING.DEFAULT,
    CHART_COLORS.INFO.DEFAULT,
    CHART_COLORS.PURPLE.DEFAULT,
  ];

  return (
    <div className="h-[350px] w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={balanceTrends} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme === THEME.DARK ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
              vertical={false}
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
              tickFormatter={value => formatSummaryAmount(value)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [formatSummaryAmount(Number(value)), name as string]}
                  labelFormatter={label => `Month: ${label}`}
                />
              }
            />
            {accountNames.map((accountName, index) => (
              <Line
                key={accountName}
                type="monotone"
                dataKey={accountName}
                stroke={colors[index] || CHART_COLORS.PRIMARY.DEFAULT}
                strokeWidth={CHART_CONFIG.STROKE_WIDTH.THIN}
                dot={false}
                activeDot={{
                  r: CHART_CONFIG.DOT_RADIUS.SMALL,
                  strokeWidth: CHART_CONFIG.STROKE_WIDTH.THICK,
                  stroke: colors[index] || CHART_COLORS.PRIMARY.DEFAULT,
                  fill: '#FFF',
                  opacity: 1.0,
                }}
                animationDuration={CHART_CONFIG.ANIMATION.DURATION.FAST}
                animationBegin={CHART_CONFIG.ANIMATION.DELAY.SHORT + index * 100}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
