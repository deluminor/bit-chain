'use client';

import { SummaryStatsRow, SummaryStatTile } from '@/components/ui/summary-stat-tile';
import { BASE_CURRENCY, formatDisplayAmount } from '@/lib/currency';
import { Calendar, Target, TrendingUp } from 'lucide-react';

interface GoalsSummary {
  total: number;
  active: number;
  totalTarget: number;
  totalCurrent: number;
  completed: number;
}

interface GoalsSummaryCardsProps {
  summary: GoalsSummary;
  nearestDeadlineDays: number | null;
}

export function GoalsSummaryCards({ summary, nearestDeadlineDays }: GoalsSummaryCardsProps) {
  return (
    <SummaryStatsRow className="sm:grid-cols-2 lg:grid-cols-3">
      <SummaryStatTile
        title="Total Target"
        value={formatDisplayAmount(summary.totalTarget, BASE_CURRENCY, 'summary')}
        hint="Target amount"
        icon={TrendingUp}
        tone="purple"
      />
      <SummaryStatTile
        title="Next Deadline"
        value={nearestDeadlineDays ?? 0}
        hint="Days remaining"
        icon={Calendar}
        tone="orange"
      />
      <SummaryStatTile
        title="Active Goals"
        value={summary.active}
        hint="In progress"
        icon={Target}
        tone="blue"
      />
    </SummaryStatsRow>
  );
}
