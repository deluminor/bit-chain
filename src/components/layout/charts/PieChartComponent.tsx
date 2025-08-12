'use client';

import { Pie, PieChart, Cell, ResponsiveContainer } from 'recharts';

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
import { PIE_COLORS, EFFECTS, CHART_CONFIG } from '@/constants/colors';

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

// Use colors from constants
const COLORS = PIE_COLORS;

export function PieChartComponent({
  title,
  description,
  data,
  isLoading,
  footer,
}: PieChartComponentProps) {
  const { theme } = useTheme();

  if (isLoading) {
    return <ChartSkeleton />;
  }

  const chartConfig = {
    pie: {
      label: title,
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-square h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {COLORS.map((color, index) => (
                  <linearGradient key={index} id={`gradient${index}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.7} />
                    <stop offset="50%" stopColor={color} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.3} />
                  </linearGradient>
                ))}
                <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow
                    dx={EFFECTS.SOFT_SHADOW.dx}
                    dy={EFFECTS.SOFT_SHADOW.dy}
                    stdDeviation={EFFECTS.SOFT_SHADOW.stdDeviation}
                    floodColor={EFFECTS.SOFT_SHADOW.floodColor}
                  />
                </filter>
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={105}
                innerRadius={50}
                paddingAngle={1}
                dataKey="value"
                stroke={theme === THEME.DARK ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'}
                strokeWidth={0.5}
                animationBegin={CHART_CONFIG.ANIMATION.DELAY.MEDIUM}
                animationDuration={CHART_CONFIG.ANIMATION.DURATION.MEDIUM}
                filter="url(#softShadow)"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#gradient${index % COLORS.length})`} />
                ))}
              </Pie>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={value => value}
                    formatter={(value, name) => [`${value}%`, name]}
                    indicator="dot"
                  />
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
