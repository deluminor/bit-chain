'use client';

import { Pie, PieChart, Cell, ResponsiveContainer } from 'recharts';

import { ChartWrapper } from './ChartWrapper';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useTheme } from '@/providers/ThemeProvider';
import { THEME } from '@/store';
import { ChartSkeleton } from './ChartSkeleton';
import {
  MINIMALIST_PIE_COLORS,
  MINIMALIST_PIE_COLORS_DARK,
} from '@/constants/minimalist-chart-styles';

interface PieChartData {
  name: string;
  value: number;
}

interface PieChartComponentProps {
  title: string;
  description: string;
  data: PieChartData[];
  isLoading?: boolean;
  footer?: React.ReactNode;
}

// Use minimalist colors based on theme
const getColors = (isDark: boolean) =>
  isDark ? MINIMALIST_PIE_COLORS_DARK : MINIMALIST_PIE_COLORS;

export function PieChartComponent({
  title,
  description,
  data,
  isLoading,
  footer,
}: PieChartComponentProps) {
  const { theme } = useTheme();
  const isDark = theme === THEME.DARK;
  const colors = getColors(isDark);

  if (isLoading) {
    return <ChartSkeleton />;
  }

  // Show placeholder data if no data
  const chartData = data.length > 0 ? data : [{ name: 'No data', value: 100 }];

  const chartConfig = {
    pie: {
      label: title,
    },
  } satisfies ChartConfig;

  return (
    <ChartWrapper title={title} description={description} footer={footer} isLoading={isLoading}>
      <ChartContainer config={chartConfig} className="aspect-square h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={110}
              innerRadius={55}
              paddingAngle={data.length > 1 ? 0.5 : 0}
              dataKey="value"
              stroke={isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'}
              strokeWidth={0.3}
              animationBegin={150}
              animationDuration={1000}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    data.length > 0 ? colors[index % colors.length] : isDark ? '#333333' : '#cccccc'
                  }
                  style={{
                    filter: 'drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.1))',
                    transition: 'all 0.2s ease-in-out',
                  }}
                />
              ))}
            </Pie>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={value => value}
                  formatter={(value, name) => [
                    `${typeof value === 'number' ? value.toFixed(1) : value}%`,
                    name,
                  ]}
                  indicator="dot"
                  className="rounded-lg border-0 bg-background/95 backdrop-blur-sm shadow-lg"
                />
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </ChartWrapper>
  );
}
