'use client';

import { Card } from '@/components/ui/card';
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <Card className="p-3 md:p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-purple-500/10 rounded-lg">
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </div>
          <h3 className="font-semibold text-sm">Total Target</h3>
        </div>
        <div className="text-xl font-bold">
          {formatDisplayAmount(summary.totalTarget, BASE_CURRENCY, 'summary')}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">Target amount</p>
      </Card>

      <Card className="p-3 md:p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-orange-500/10 rounded-lg">
            <Calendar className="h-4 w-4 text-orange-500" />
          </div>
          <h3 className="font-semibold text-sm">Next Deadline</h3>
        </div>
        <div className="text-xl font-bold">{nearestDeadlineDays ?? 0}</div>
        <p className="text-xs text-muted-foreground mt-0.5">Days remaining</p>
      </Card>

      <Card className="p-3 md:p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-blue-500/10 rounded-lg">
            <Target className="h-4 w-4 text-blue-500" />
          </div>
          <h3 className="font-semibold text-sm">Active Goals</h3>
        </div>
        <div className="text-xl font-bold">{summary.active}</div>
        <p className="text-xs text-muted-foreground mt-0.5">In progress</p>
      </Card>
    </div>
  );
}
