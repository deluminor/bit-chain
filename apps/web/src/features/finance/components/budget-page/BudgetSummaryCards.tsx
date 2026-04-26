'use client';

import { SummaryStatsRow, SummaryStatTile } from '@/components/ui/summary-stat-tile';
import { formatEuroAmount } from '@/lib/currency';
import { DollarSign, Target, TrendingUp } from 'lucide-react';

interface BudgetSummaryCardsProps {
  totalPlannedBase: number;
  totalActualBase: number;
}

export function BudgetSummaryCards({ totalPlannedBase, totalActualBase }: BudgetSummaryCardsProps) {
  const pctSpent =
    totalPlannedBase > 0 ? Math.round((totalActualBase / totalPlannedBase) * 100) : 0;
  const remaining = totalPlannedBase - totalActualBase;
  const pctRemaining = totalPlannedBase > 0 ? Math.round((remaining / totalPlannedBase) * 100) : 0;

  return (
    <SummaryStatsRow className="sm:grid-cols-2 lg:grid-cols-3">
      <SummaryStatTile
        title="Total Budgeted"
        value={formatEuroAmount(totalPlannedBase)}
        hint="Total planned"
        icon={DollarSign}
        tone="green"
      />
      <SummaryStatTile
        title="Total Spent"
        value={formatEuroAmount(totalActualBase)}
        hint={`${pctSpent}% of budget`}
        icon={TrendingUp}
        tone="blue"
      />
      <SummaryStatTile
        title="Remaining"
        value={formatEuroAmount(remaining)}
        hint={`${pctRemaining}% remaining`}
        icon={Target}
        tone="purple"
      />
    </SummaryStatsRow>
  );
}
