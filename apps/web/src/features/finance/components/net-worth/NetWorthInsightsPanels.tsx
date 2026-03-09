import { Badge } from '@/components/ui/badge';
import { formatSummaryAmount } from '@/lib/currency';
import { DollarSign, TrendingUp } from 'lucide-react';
import type { NetWorthPerformance } from './net-worth.types';

interface NetWorthInsightsPanelsProps {
  performance: NetWorthPerformance;
  daysCount: number;
}

export function NetWorthInsightsPanels({ performance, daysCount }: NetWorthInsightsPanelsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="rounded-lg border bg-card p-4">
        <h4 className="mb-2 flex items-center gap-2 font-semibold">
          <TrendingUp className="h-4 w-4" />
          Growth Insights
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Average daily change:</span>
            <span
              className={`font-medium ${
                performance.averageChange >= 0 ? 'text-income' : 'text-expense'
              }`}
            >
              {performance.averageChange >= 0 ? '+' : ''}€{performance.averageChange.toFixed(0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Peak net worth:</span>
            <span className="font-medium">{formatSummaryAmount(performance.highestNetWorth)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Lowest point:</span>
            <span className="font-medium">{formatSummaryAmount(performance.lowestNetWorth)}</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <h4 className="mb-2 flex items-center gap-2 font-semibold">
          <DollarSign className="h-4 w-4" />
          Wealth Status
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Growth trend:</span>
            <Badge variant={performance.totalChange >= 0 ? 'default' : 'destructive'}>
              {performance.totalChange >= 0 ? 'Positive' : 'Negative'}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Volatility:</span>
            <Badge variant="outline">
              {Math.abs(performance.highestNetWorth - performance.lowestNetWorth) >= 10000
                ? 'High'
                : 'Low'}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Period analyzed:</span>
            <span className="font-medium">{daysCount} days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
