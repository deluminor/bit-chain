import { Calendar, TrendingDown, TrendingUp } from 'lucide-react';

interface ChartAreaInteractiveFooterProps {
  trend: number;
  isPositiveTrend: boolean;
  pointsCount: number;
}

export function ChartAreaInteractiveFooter({
  trend,
  isPositiveTrend,
  pointsCount,
}: ChartAreaInteractiveFooterProps) {
  return (
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
        <span className="font-medium">{pointsCount}</span>
      </div>
    </div>
  );
}
