'use client';

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useTheme } from '@/providers/ThemeProvider';
import { THEME } from '@/store';
import { ChartSkeleton } from './ChartSkeleton';
import { getMinimalistColors } from '@/constants/minimalist-chart-styles';

interface RadarChartData {
  name: string;
  value: number;
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
  const colors = getMinimalistColors(isDark);

  if (isLoading) {
    return <ChartSkeleton />;
  }

  const chartConfig = {
    radar: {
      label: title,
      color: colors.primary,
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-square h-[300px] w-full">
          <RadarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <defs>
              <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={colors.primary} stopOpacity={0.3} />
                <stop offset="50%" stopColor={colors.primary} stopOpacity={0.15} />
                <stop offset="100%" stopColor={colors.primary} stopOpacity={0.05} />
              </radialGradient>
            </defs>
            <PolarGrid stroke={colors.grid} strokeWidth={0.5} radialLines={true} />
            <PolarAngleAxis
              dataKey="name"
              tick={{
                fontSize: 12,
                fill: colors.text,
                fontWeight: 500,
              }}
            />
            <Radar
              name="Value"
              dataKey="value"
              stroke={colors.primary}
              strokeWidth={1}
              fill="url(#radarFill)"
              fillOpacity={1}
              dot={{
                r: 3,
                fill: colors.primary,
                stroke: isDark ? '#000000' : '#ffffff',
                strokeWidth: 1.5,
                opacity: 1,
              }}
              isAnimationActive={true}
              animationDuration={800}
              animationBegin={150}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent labelFormatter={value => value} indicator="dot" />}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
