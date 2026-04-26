'use client';

import { TotalBalanceDisplay } from '@/components/layout/TotalBalanceDisplay';
import { SummaryStatsRow, SummaryStatTile } from '@/components/ui/summary-stat-tile';
import { formatSummaryAmount } from '@/lib/currency';
import { Activity, DollarSign, TrendingUp, Wallet } from 'lucide-react';

interface AccountSummary {
  total: number;
  active: number;
  inactive: number;
  totalBalance: number;
}

interface AccountSummaryCardsProps {
  isLoading: boolean;
  isConverting: boolean;
  totalBalanceEUR: number;
  summary: AccountSummary;
}

export function AccountSummaryCards({
  isLoading,
  isConverting,
  totalBalanceEUR,
  summary,
}: AccountSummaryCardsProps) {
  return (
    <SummaryStatsRow className="sm:grid-cols-2 lg:grid-cols-4">
      <SummaryStatTile
        title="Total Balance"
        value={<TotalBalanceDisplay size="sm" showLoading={isLoading} className="font-semibold" />}
        hint="Converted to EUR"
        icon={DollarSign}
        tone="purple"
      />
      <SummaryStatTile
        title="Avg Balance"
        value={
          isConverting ? (
            <span className="text-xs text-muted-foreground">Converting…</span>
          ) : (
            formatSummaryAmount(totalBalanceEUR / Math.max(summary.active, 1))
          )
        }
        hint="Per active account"
        icon={TrendingUp}
        tone="orange"
      />
      <SummaryStatTile
        title="Total Accounts"
        value={summary.total}
        hint="All accounts"
        icon={Wallet}
        tone="blue"
      />
      <SummaryStatTile
        title="Active"
        value={summary.active}
        hint="Currently active"
        icon={Activity}
        tone="emerald"
      />
    </SummaryStatsRow>
  );
}
