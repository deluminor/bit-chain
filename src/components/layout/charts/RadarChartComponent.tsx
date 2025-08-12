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
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={chartConfig} className="aspect-square h-[300px] w-full">
          <RadarChart data={data} margin={{ top: 30, right: 30, bottom: 30, left: 30 }}>
            <defs>
              <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={colors.primary} stopOpacity={0.15} />
                <stop offset="70%" stopColor={colors.primary} stopOpacity={0.08} />
                <stop offset="100%" stopColor={colors.primary} stopOpacity={0.02} />
              </radialGradient>
            </defs>
            <PolarGrid
              stroke={isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}
              strokeWidth={0.3}
              radialLines={true}
              gridType="polygon"
            />
            <PolarAngleAxis
              dataKey="name"
              tick={{
                fontSize: 11,
                fill: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                fontWeight: 400,
              }}
              tickSize={8}
            />
            <Radar
              name="Value"
              dataKey="value"
              stroke={colors.primary}
              strokeWidth={0.8}
              fill="url(#radarFill)"
              fillOpacity={1}
              dot={{
                r: 2.5,
                fill: colors.primary,
                stroke: isDark ? '#000000' : '#ffffff',
                strokeWidth: 1,
                opacity: 0.9,
              }}
              isAnimationActive={true}
              animationDuration={1000}
              animationBegin={200}
            />
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
          </RadarChart>
        </ChartContainer>
      </CardContent>
      {footer && (
        <CardFooter className="pt-4 border-t border-border/50">
          <div className="text-sm text-muted-foreground">{footer}</div>
        </CardFooter>
      )}
    </Card>
  );
}
