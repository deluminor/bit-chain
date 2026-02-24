'use client';

import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  trend: {
    value: number | string;
    label: string;
    isPositive: boolean;
  };
  footer: {
    title: string;
    description: string;
  };
}

export function StatCard({ title, value, trend, footer }: StatCardProps) {
  const TrendIcon = trend.isPositive ? TrendingUpIcon : TrendingDownIcon;
  const trendColor = trend.isPositive ? 'text-green-500' : 'text-red-500';

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className=" flex items-center justify-between">
          <CardDescription className="truncate">{title}</CardDescription>
          <Badge variant="outline" className={`flex gap-1 rounded-lg text-xs ${trendColor}`}>
            <TrendIcon className="size-3" />
            {Number(trend.value) > 0 ? '+' : ''}
            {trend.value}%
          </Badge>
        </div>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums truncate">
          {value}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {footer.title} <TrendIcon className={`size-4 ${trendColor}`} />
        </div>
        <div className="text-muted-foreground">{footer.description}</div>
      </CardFooter>
    </Card>
  );
}
