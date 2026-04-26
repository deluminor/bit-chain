'use client';

import { SummaryStatsRow, SummaryStatTile } from '@/components/ui/summary-stat-tile';
import { BASE_CURRENCY, formatDisplayAmount } from '@/lib/currency';
import { BadgeDollarSign, CalendarClock, Landmark, Wallet } from 'lucide-react';

interface LoansSummary {
  total: number;
  active: number;
  loanCount: number;
  debtCount: number;
  totalOutstandingBase: number;
}

interface LoansSummaryCardsProps {
  summary: LoansSummary;
  nearestDueDate: Date | undefined;
}

export function LoansSummaryCards({ summary, nearestDueDate }: LoansSummaryCardsProps) {
  return (
    <SummaryStatsRow className="sm:grid-cols-2 lg:grid-cols-4">
      <SummaryStatTile
        title="Outstanding"
        value={formatDisplayAmount(summary.totalOutstandingBase, BASE_CURRENCY, 'summary')}
        hint="Base currency total"
        icon={BadgeDollarSign}
        tone="rose"
      />
      <SummaryStatTile
        title="Active"
        value={summary.active}
        hint="Unpaid loans"
        icon={Wallet}
        tone="emerald"
      />
      <SummaryStatTile
        title="Loans vs Debts"
        value={`${summary.loanCount} / ${summary.debtCount}`}
        hint="Loans / debts"
        icon={Landmark}
        tone="blue"
      />
      <SummaryStatTile
        title="Next Due"
        value={nearestDueDate ? nearestDueDate.toLocaleDateString('en-GB') : '—'}
        hint="Closest deadline"
        icon={CalendarClock}
        tone="orange"
      />
    </SummaryStatsRow>
  );
}
