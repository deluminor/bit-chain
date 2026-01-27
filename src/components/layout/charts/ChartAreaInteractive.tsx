'use client';

import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useTradingStats } from '@/hooks/useTradingStats';
import { THEME, useStore } from '@/store';
import { endOfDay, startOfDay } from 'date-fns';
import { useMemo } from 'react';
import { ChartWrapper } from './ChartWrapper';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

export function ChartAreaInteractive() {
  const { selectedDateRange: dateRange, theme } = useStore();
  const { stats, isLoading } = useTradingStats();

  const chartConfig = {
    pnl: {
      label: 'PnL',
      color: theme === THEME.DARK ? 'rgba(255, 255, 255, 0.85)' : 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;

  const filteredData = useMemo(() => {
    if (!stats?.pnlData || stats.pnlData.length === 0) return [];

    let dataToUse = [...stats.pnlData];

    // Apply date filtering if a range is selected (using global date range)
    if (dateRange?.from) {
      const startDate = startOfDay(dateRange.from);
      const endDate = dateRange.to ? endOfDay(dateRange.to) : new Date();

      dataToUse = dataToUse.filter(item => {
        const date = new Date(item.date);
        return date >= startDate && date <= endDate;
      });
    }

    // If we have data, ensure the first entry starts with PnL at 0
    if (dataToUse.length > 0) {
      // Sort data by date (just to be safe)
      dataToUse.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Create a new array with a zero point before the first item
      const firstDate = new Date(dataToUse[0]?.date || new Date());
      const zeroPnlDate = new Date(firstDate);
      zeroPnlDate.setDate(firstDate.getDate() - 1);

      return [
        {
          date: zeroPnlDate.toISOString(),
          pnl: 0,
        },
        ...dataToUse,
      ];
    }

    return dataToUse;
  }, [stats?.pnlData, dateRange]);

  // Calculate min and max PnL values for domain calculation
  const pnlValues = useMemo(() => {
    if (!filteredData.length) return { min: 0, max: 0 };
    const values = filteredData.map(item => item.pnl);
    const min = Math.min(...values);
    const max = Math.max(...values);

    // Calculate the range of the data
    const range = max - min;
    // Add just a small amount of padding (5%) to prevent exact edge alignment
    const paddingFactor = 0.05;
    const padding = range * paddingFactor;

    return {
      min: min - padding,
      max: max + padding,
    };
  }, [filteredData]);

  // Calculate appropriate tick values with even intervals
  const yAxisTicks = useMemo(() => {
    const min = pnlValues.min < 0 ? Math.floor(pnlValues.min) : 0;
    const max = pnlValues.max > 0 ? Math.ceil(pnlValues.max) : 10;

    // For consistent spacing, use a fixed number of divisions
    const tickCount = 7; // Create evenly spaced divisions

    // Calculate exact interval for perfect division
    const range = max - min;

    // Choose an interval that divides the range evenly
    const exactInterval = range / tickCount;

    // Round to nice values based on magnitude
    const magnitude = Math.pow(10, Math.floor(Math.log10(exactInterval)));
    let interval;

    if (exactInterval / magnitude < 1) {
      interval = magnitude / 2; // 0.5x base unit
    } else if (exactInterval / magnitude < 2) {
      interval = magnitude; // 1x base unit
    } else if (exactInterval / magnitude < 5) {
      interval = 2 * magnitude; // 2x base unit
    } else {
      interval = 5 * magnitude; // 5x base unit
    }

    // Find the properly aligned min and max bounds
    // These should be exact multiples of the interval
    const adjustedMin = Math.floor(min / interval) * interval;
    const adjustedMax = Math.ceil(max / interval) * interval;

    // Generate evenly spaced ticks
    const ticks = [];
    let currentTick = adjustedMin;

    // Always ensure 0 is included
    let hasZero = false;

    while (currentTick <= adjustedMax + interval * 0.01) {
      ticks.push(currentTick);
      if (Math.abs(currentTick) < 0.01) hasZero = true;
      currentTick += interval;
    }

    // If zero isn't already in our ticks, add it
    if (!hasZero && min < 0 && max > 0) {
      ticks.push(0);
      ticks.sort((a, b) => a - b);
    }

    return ticks;
  }, [pnlValues]);

  // Compute the exact domain for Y-axis to ensure grid lines are evenly spaced
  const yAxisDomain = useMemo(() => {
    if (yAxisTicks.length < 2) return [pnlValues.min, pnlValues.max] as [number, number];

    // Use the first and last tick as our domain bounds without extra padding
    // This ensures only grid lines with labels are shown
    return [yAxisTicks[0], yAxisTicks[yAxisTicks.length - 1]] as [number, number];
  }, [yAxisTicks, pnlValues]);

  // Calculate trend for footer
  const firstValue = filteredData.length > 0 ? filteredData[0]?.pnl || 0 : 0;
  const lastValue = filteredData.length > 0 ? filteredData[filteredData.length - 1]?.pnl || 0 : 0;
  const trend = lastValue - firstValue;
  const isPositiveTrend = trend >= 0;

  const footer = (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-1">
        {isPositiveTrend ? (
          <TrendingUp className="h-4 w-4 text-green-600" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-600" />
        )}
        <span className="text-muted-foreground">Trend:</span>
        <span className={`font-medium ${isPositiveTrend ? 'text-green-600' : 'text-red-600'}`}>
          {isPositiveTrend ? '+' : ''}
          {trend.toFixed(2)}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">Data Points:</span>
        <span className="font-medium">{filteredData.length}</span>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <ChartWrapper
        title="Cumulative PnL"
        description="Total profit/loss over time"
        isLoading={true}
      >
        <div />
      </ChartWrapper>
    );
  }

  if (!filteredData || filteredData.length === 0) {
    return (
      <ChartWrapper title="Cumulative PnL" description="Total profit/loss over time">
        <div className="h-[350px] w-full flex items-center justify-center">
          <div className="text-muted-foreground">No data available for the selected period</div>
        </div>
      </ChartWrapper>
    );
  }

  return (
    <ChartWrapper
      title="Cumulative PnL"
      description="Total profit/loss over time"
      footer={footer}
      className="@container/card"
    >
      <div className="px-2 sm:px-6 pt-4">
        <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
          <AreaChart data={filteredData} margin={{ top: 10, right: 5, left: 5, bottom: 10 }}>
            <defs>
              <linearGradient id="fillPnl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-pnl)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-pnl)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              horizontal={true}
              stroke={theme === THEME.DARK ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'}
              strokeDasharray="3 4"
              strokeWidth={0.8}
            />
            {/* Add a special zero line if data crosses zero */}
            {yAxisDomain[0] < 0 && yAxisDomain[1] > 0 && (
              <ReferenceLine
                y={0}
                stroke={theme === THEME.DARK ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'}
                strokeWidth={0.8}
                strokeDasharray="3 4"
                ifOverflow="extendDomain"
              />
            )}
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
              domain={yAxisDomain}
              ticks={yAxisTicks}
              tickCount={yAxisTicks.length}
              interval="preserveEnd"
              tickFormatter={value => {
                // Use abbreviated currency format for tick values
                if (Math.abs(value) < 0.01) return '$0';

                // Format with abbreviations
                const absValue = Math.abs(value);
                let formattedValue;

                if (absValue >= 1000000) {
                  formattedValue = `$${(value / 1000000).toFixed(1)}M`;
                } else if (absValue >= 1000) {
                  formattedValue = `$${(value / 1000).toFixed(1)}k`;
                } else {
                  // Don't add decimals for values under 1000
                  formattedValue = `$${value.toFixed(2)}`;
                }

                return formattedValue;
              }}
              tickLine={false}
              axisLine={false}
              tick={{
                fill: theme === THEME.DARK ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                fontSize: 12,
              }}
              tickMargin={10}
              allowDataOverflow={false}
              hide={false}
              padding={{ top: 0, bottom: 0 }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={value => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="pnl"
              type="monotone"
              fill="url(#fillPnl)"
              stroke="var(--color-pnl)"
              strokeWidth={theme === THEME.DARK ? 2 : 1.5}
              connectNulls
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
              isAnimationActive={true}
              animationDuration={1200}
              animationBegin={0}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </ChartWrapper>
  );
}
