'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useTheme } from '@/providers/ThemeProvider';
import { THEME } from '@/store';
import { BAR_COLORS, CHART_CONFIG } from '@/constants/colors';
import { useBudgetPerformance } from '@/features/finance/hooks/useBudgetPerformance';
import { useIsClient } from '@/hooks/useIsClient';

const chartConfig = {
  budgeted: {
    label: 'Budgeted',
    color: '#3B82F6',
  },
  spent: {
    label: 'Spent',
    color: '#F59E0B',
  },
} satisfies ChartConfig;

export function BudgetPerformanceChart() {
  const { theme } = useTheme();
  const isClient = useIsClient();
  const { data: budgetData, isLoading, error } = useBudgetPerformance();

  if (!isClient || isLoading) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <div className="animate-pulse bg-muted/40 rounded-lg h-full w-full"></div>
      </div>
    );
  }

  if (error || !budgetData?.length) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Budget vs Spending</CardTitle>
          <CardDescription>Current month budget performance by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center">
            <div className="text-muted-foreground">No budget data available</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-[400px] w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={budgetData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            barCategoryGap="20%"
          >
            <defs>
              <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                {BAR_COLORS.BUDGET.GRADIENT.map((stop, index) => (
                  <stop
                    key={index}
                    offset={stop.offset}
                    stopColor={stop.color}
                    stopOpacity={stop.opacity}
                  />
                ))}
              </linearGradient>
              <linearGradient id="spentGradient" x1="0" y1="0" x2="0" y2="1">
                {BAR_COLORS.SPENT.GRADIENT.map((stop, index) => (
                  <stop
                    key={index}
                    offset={stop.offset}
                    stopColor={stop.color}
                    stopOpacity={stop.opacity}
                  />
                ))}
              </linearGradient>
              <linearGradient id="overSpentGradient" x1="0" y1="0" x2="0" y2="1">
                {BAR_COLORS.OVER_SPENT.GRADIENT.map((stop, index) => (
                  <stop
                    key={index}
                    offset={stop.offset}
                    stopColor={stop.color}
                    stopOpacity={stop.opacity}
                  />
                ))}
              </linearGradient>
              <filter id="barShadow">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.15)" />
              </filter>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme === THEME.DARK ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
              vertical={false}
            />
            <XAxis
              dataKey="category"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: theme === THEME.DARK ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
              }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: theme === THEME.DARK ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
              }}
              tickFormatter={value => `$${value}`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name, _props) => [
                    `$${value}`,
                    name === 'budgeted' ? 'Budgeted' : 'Spent',
                  ]}
                  labelFormatter={label => `Category: ${label}`}
                />
              }
            />
            <Bar
              dataKey="budgeted"
              name="Budgeted"
              fill="url(#budgetGradient)"
              radius={[4, 4, 0, 0]}
              filter="url(#barShadow)"
              animationDuration={CHART_CONFIG.ANIMATION.DURATION.FAST}
              animationBegin={CHART_CONFIG.ANIMATION.DELAY.SHORT}
            />
            <Bar
              dataKey="spent"
              name="Spent"
              radius={[4, 4, 0, 0]}
              filter="url(#barShadow)"
              animationDuration={CHART_CONFIG.ANIMATION.DURATION.FAST}
              animationBegin={CHART_CONFIG.ANIMATION.DELAY.LONG}
            >
              {budgetData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.spent > entry.budgeted ? 'url(#overSpentGradient)' : 'url(#spentGradient)'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
