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
import { CHART_COLORS, AREA_GRADIENTS, CHART_CONFIG, ACTIVE_DOT_COLORS } from '@/constants/colors';
import { useFinanceStats } from '@/features/finance/hooks/useFinanceStats';
import { useIsClient } from '@/hooks/useIsClient';
import { formatSummaryAmount } from '@/lib/currency';

const chartConfig = {
  netWorth: {
    label: 'Net Worth',
    color: '#8B5CF6',
  },
} satisfies ChartConfig;

export function NetWorthChart() {
  const { theme } = useTheme();
  const isClient = useIsClient();
  const { data: financeStats, isLoading, error } = useFinanceStats();

  if (!isClient || isLoading) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <div className="animate-pulse bg-muted/40 rounded-lg h-full w-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <div className="text-muted-foreground">Failed to load chart data</div>
      </div>
    );
  }

  const chartData =
    financeStats?.monthlyStats.map(stat => ({
      date: stat.month,
      netWorth: stat.netWorth,
    })) || [];

  // Calculate growth metrics
  const startValue = chartData[0]?.netWorth || 0;
  const endValue = chartData[chartData.length - 1]?.netWorth || 0;
  const totalGrowth = endValue - startValue;
  const growthPercentage = startValue > 0 ? ((totalGrowth / startValue) * 100).toFixed(1) : '0';

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
                  {AREA_GRADIENTS.FILL.PRIMARY.map((stop, index) => (
                    <stop
                      key={index}
                      offset={stop.offset}
                      stopColor={stop.color}
                      stopOpacity={stop.opacity}
                    />
                  ))}
                </linearGradient>
                <linearGradient id="netWorthStroke" x1="0" y1="0" x2="1" y2="0">
                  {CHART_COLORS.PRIMARY.GRADIENT_STOPS.map((stop, index) => (
                    <stop
                      key={index}
                      offset={stop.offset}
                      stopColor={stop.color}
                      stopOpacity={stop.opacity}
                    />
                  ))}
                </linearGradient>
              </defs>
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
                tickFormatter={value => `€${(value / 1000).toFixed(0)}k`}
                domain={[0, 'dataMax']}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={value => [formatSummaryAmount(Number(value)), 'Net Worth']}
                    labelFormatter={label => `Month: ${label}`}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="netWorth"
                stroke="url(#netWorthStroke)"
                strokeWidth={CHART_CONFIG.STROKE_WIDTH.THIN}
                fill="url(#netWorthGradient)"
                fillOpacity={1}
                activeDot={{
                  r: CHART_CONFIG.DOT_RADIUS.MEDIUM,
                  strokeWidth: CHART_CONFIG.STROKE_WIDTH.THICK,
                  stroke: ACTIVE_DOT_COLORS.PRIMARY,
                  fill: '#FFF',
                  opacity: 1.0,
                }}
                animationDuration={CHART_CONFIG.ANIMATION.DURATION.NORMAL}
                animationBegin={CHART_CONFIG.ANIMATION.DELAY.SHORT}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
