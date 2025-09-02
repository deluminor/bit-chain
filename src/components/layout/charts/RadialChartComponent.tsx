'use client';

import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

import { ChartWrapper } from './ChartWrapper';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { useTheme } from '@/providers/ThemeProvider';
import { THEME } from '@/store';
import { ChartSkeleton } from './ChartSkeleton';

interface RadialChartData {
  name: string;
  percentage: number;
  value?: number;
}

interface RadialChartComponentProps {
  title: string;
  description: string;
  data: RadialChartData[];
  colors: string[];
  isLoading?: boolean;
  footer?: React.ReactNode;
}

export function RadialChartComponent({
  title,
  description,
  data,
  colors,
  isLoading,
  footer,
}: RadialChartComponentProps) {
  const { theme } = useTheme();

  if (isLoading) {
    return <ChartSkeleton />;
  }

  // Get primary data (first item)
  const primaryData = data[0] || { name: '', percentage: 0 };

  // Ensure we have valid data to display
  const displayValue = typeof primaryData.percentage === 'number' ? primaryData.percentage : 0;

  // Create chart data with safe values
  const chartData = [
    {
      name: primaryData.name,
      value: displayValue,
      fill: theme === THEME.DARK ? 'rgba(255, 255, 255, 0.85)' : colors[0],
    },
  ];

  // Create chart config
  const chartConfig = {
    [primaryData.name.toLowerCase()]: {
      label: primaryData.name,
      color: theme === THEME.DARK ? 'rgba(255, 255, 255, 0.85)' : colors[0],
    },
  } satisfies ChartConfig;

  return (
    <ChartWrapper
      title={title}
      description={description}
      footer={footer}
      isLoading={isLoading}
      contentClassName="flex-1 pb-0"
    >
      <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
        <RadialBarChart data={chartData} endAngle={100} innerRadius={80} outerRadius={140}>
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className="first:fill-muted last:fill-background"
            polarRadius={[86, 74]}
          />
          <RadialBar
            dataKey="value"
            background
            fill={theme === THEME.DARK ? 'rgba(255, 255, 255, 0.85)' : undefined}
            minPointSize={5}
          />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-4xl font-bold"
                      >
                        {displayValue}%
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className={
                          theme === THEME.DARK
                            ? 'fill-white fill-opacity-60'
                            : 'fill-muted-foreground'
                        }
                      >
                        {primaryData.name}
                      </tspan>
                    </text>
                  );
                }
                return null;
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
    </ChartWrapper>
  );
}
