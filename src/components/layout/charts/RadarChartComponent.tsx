'use client';

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

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
import { formatSummaryAmount } from '@/lib/currency';

interface RadarChartData {
  name: string;
  value: number;
  amount?: number;
}

interface RadarChartComponentProps {
  title: string;
  description: string;
  data: RadarChartData[];
  color: string;
  isLoading?: boolean;
  footer?: React.ReactNode;
}

export function RadarChartComponent({
  title,
  description,
  data,
  isLoading,
  footer,
}: RadarChartComponentProps) {
  const { theme } = useTheme();
  const isDark = theme === THEME.DARK;
  const primaryColor = isDark ? '#ffffff' : '#6b7280';

  if (isLoading) {
    return <ChartSkeleton />;
  }

  const chartConfig = {
    radar: {
      label: title,
      color: primaryColor,
    },
  } satisfies ChartConfig;

  return (
    <ChartWrapper
      title={title}
      description={description}
      footer={footer}
      isLoading={isLoading}
      contentClassName="max-h-260 overflow-hidden"
    >
      <ChartContainer config={chartConfig} className="aspect-square max-h-260 h-full w-full">
        <RadarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <defs>
            <linearGradient id="radarFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={primaryColor} stopOpacity={0.55} />
              <stop offset="15%" stopColor={primaryColor} stopOpacity={0.48} />
              <stop offset="30%" stopColor={primaryColor} stopOpacity={0.38} />
              <stop offset="50%" stopColor={primaryColor} stopOpacity={0.25} />
              <stop offset="70%" stopColor={primaryColor} stopOpacity={0.15} />
              <stop offset="85%" stopColor={primaryColor} stopOpacity={0.08} />
              <stop offset="100%" stopColor={primaryColor} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <PolarGrid
            stroke={isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'}
            strokeWidth={0.5}
            strokeDasharray="1 2"
            radialLines={false}
            gridType="polygon"
            className="hidden md:block" // Hide grid on mobile for simplicity
          />
          <PolarAngleAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 12,
              fill: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
              fontWeight: 400,
            }}
            tickSize={8}
          />
          <Radar
            name="Value"
            dataKey="value"
            stroke={primaryColor}
            strokeWidth={0.7}
            fill="url(#radarFill)"
            fillOpacity={1}
            dot={false}
            activeDot={{
              r: 4,
              strokeWidth: 2,
              stroke: primaryColor,
              fill: isDark ? '#000000' : '#ffffff',
              opacity: 1,
            }}
            isAnimationActive={true}
            animationDuration={800}
            animationBegin={150}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={value => value}
                formatter={(value, name, props) => {
                  const percentage = typeof value === 'number' ? value.toFixed(1) : value;
                  const amount = props?.payload?.amount;
                  if (amount !== undefined) {
                    return [`${formatSummaryAmount(amount)} (${percentage}%)`, name];
                  }
                  return [`${percentage}%`, name];
                }}
                indicator="dot"
                className="rounded-lg border-0 bg-background/95 backdrop-blur-sm shadow-lg"
              />
            }
          />
        </RadarChart>
      </ChartContainer>
    </ChartWrapper>
  );
}
