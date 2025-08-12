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
import { RADAR_COLORS, EFFECTS, CHART_CONFIG } from '@/constants/colors';

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
  color,
  isLoading,
  footer,
}: RadarChartComponentProps) {
  const { theme } = useTheme();

  if (isLoading) {
    return <ChartSkeleton />;
  }

  const chartConfig = {
    radar: {
      label: title,
      color: theme === THEME.DARK ? 'rgba(255, 255, 255, 0.85)' : color,
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
                {RADAR_COLORS.FILL.map((stop, index) => (
                  <stop
                    key={index}
                    offset={stop.offset}
                    stopColor={stop.color}
                    stopOpacity={stop.opacity}
                  />
                ))}
              </radialGradient>
              <filter id="softRadarGlow">
                <feGaussianBlur
                  stdDeviation={EFFECTS.RADAR_GLOW.stdDeviation}
                  result="coloredBlur"
                />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <PolarGrid
              stroke={theme === THEME.DARK ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'}
              strokeWidth={1}
              radialLines={true}
            />
            <PolarAngleAxis
              dataKey="name"
              tick={{
                fontSize: 12,
                fill: theme === THEME.DARK ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                fontWeight: 500,
              }}
            />
            <Radar
              name="Value"
              dataKey="value"
              stroke={RADAR_COLORS.STROKE}
              strokeWidth={CHART_CONFIG.STROKE_WIDTH.THIN}
              fill="url(#radarFill)"
              fillOpacity={0.8}
              dot={{
                r: CHART_CONFIG.DOT_RADIUS.MEDIUM,
                fill: RADAR_COLORS.DOT,
                stroke: '#FFF',
                strokeWidth: CHART_CONFIG.STROKE_WIDTH.MEDIUM,
                opacity: 1.0,
                filter: 'url(#softRadarGlow)',
              }}
              isAnimationActive={true}
              animationDuration={CHART_CONFIG.ANIMATION.DURATION.SLOW}
              animationBegin={CHART_CONFIG.ANIMATION.DELAY.MEDIUM}
              filter="url(#softRadarGlow)"
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
