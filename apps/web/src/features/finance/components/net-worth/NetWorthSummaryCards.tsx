'use client';

import { TotalBalanceDisplay } from '@/components/layout/TotalBalanceDisplay';
import { SummaryStatsRow, SummaryStatTile } from '@/components/ui/summary-stat-tile';
import { formatSummaryAmount } from '@/lib/currency';
import { TrendingDown, TrendingUp } from 'lucide-react';
import type { NetWorthPerformance } from './net-worth.types';

interface NetWorthSummaryCardsProps {
  performance: NetWorthPerformance;
}

export function NetWorthSummaryCards({ performance }: NetWorthSummaryCardsProps) {
  const changePositive = performance.totalChange >= 0;
  const pctPositive = performance.percentageChange >= 0;

  return (
    <SummaryStatsRow className="sm:grid-cols-2 lg:grid-cols-4">
      <SummaryStatTile
        title="Current Net Worth"
        value={<TotalBalanceDisplay size="sm" className="font-semibold text-income" showLoading />}
        hint="Live total"
        icon={TrendingUp}
        tone="income"
      />
      <SummaryStatTile
        title="Total Change"
        value={`${changePositive ? '+' : ''}${formatSummaryAmount(performance.totalChange)}`}
        hint="In range"
        icon={changePositive ? TrendingUp : TrendingDown}
        tone={changePositive ? 'income' : 'expense'}
      />
      <SummaryStatTile
        title="Growth Rate"
        value={`${pctPositive ? '+' : ''}${performance.percentageChange.toFixed(1)}%`}
        hint="vs start of range"
        icon={pctPositive ? TrendingUp : TrendingDown}
        tone={pctPositive ? 'income' : 'expense'}
      />
      <SummaryStatTile
        title="Peak Value"
        value={formatSummaryAmount(performance.highestNetWorth)}
        hint="High water mark in range"
        icon={TrendingUp}
        tone="default"
      />
    </SummaryStatsRow>
  );
}
