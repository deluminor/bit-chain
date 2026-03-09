import { TotalBalanceDisplay } from '@/components/layout/TotalBalanceDisplay';
import { formatSummaryAmount } from '@/lib/currency';
import { TrendingDown, TrendingUp } from 'lucide-react';
import type { NetWorthPerformance } from './net-worth.types';

interface NetWorthSummaryCardsProps {
  performance: NetWorthPerformance;
}

export function NetWorthSummaryCards({ performance }: NetWorthSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <div className="rounded-lg bg-muted/50 p-3 text-center">
        <div className="text-2xl font-bold text-income">
          <TotalBalanceDisplay size="lg" className="text-income" />
        </div>
        <div className="text-sm text-muted-foreground">Current Net Worth</div>
      </div>

      <div className="rounded-lg bg-muted/50 p-3 text-center">
        <div
          className={`flex items-center justify-center gap-1 text-2xl font-bold ${
            performance.totalChange >= 0 ? 'text-income' : 'text-expense'
          }`}
        >
          {performance.totalChange >= 0 ? (
            <TrendingUp className="h-5 w-5" />
          ) : (
            <TrendingDown className="h-5 w-5" />
          )}
          {performance.totalChange >= 0 ? '+' : ''}
          {formatSummaryAmount(performance.totalChange)}
        </div>
        <div className="text-sm text-muted-foreground">Total Change</div>
      </div>

      <div className="rounded-lg bg-muted/50 p-3 text-center">
        <div
          className={`text-2xl font-bold ${
            performance.percentageChange >= 0 ? 'text-income' : 'text-expense'
          }`}
        >
          {performance.percentageChange >= 0 ? '+' : ''}
          {performance.percentageChange.toFixed(1)}%
        </div>
        <div className="text-sm text-muted-foreground">Growth Rate</div>
      </div>

      <div className="rounded-lg bg-muted/50 p-3 text-center">
        <div className="text-2xl font-bold">
          <TotalBalanceDisplay size="lg" />
        </div>
        <div className="text-sm text-muted-foreground">Peak Value</div>
      </div>
    </div>
  );
}
