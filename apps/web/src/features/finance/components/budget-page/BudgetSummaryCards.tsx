'use client';

import { Card } from '@/components/ui/card';
import { formatEuroAmount } from '@/lib/currency';
import { DollarSign, Target, TrendingUp } from 'lucide-react';

interface BudgetSummaryCardsProps {
  totalPlannedBase: number;
  totalActualBase: number;
}

export function BudgetSummaryCards({ totalPlannedBase, totalActualBase }: BudgetSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="p-2 md:p-6 shadow-md rounded-lg hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <DollarSign className="h-5 w-5 text-green-500" />
          </div>
          <h3 className="font-semibold">Total Budgeted</h3>
        </div>
        <div className="text-2xl font-bold mb-1">{formatEuroAmount(totalPlannedBase)}</div>
        <p className="text-sm text-muted-foreground">Total planned</p>
      </Card>

      <Card className="p-2 md:p-6 shadow-md rounded-lg hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          <h3 className="font-semibold">Total Spent</h3>
        </div>
        <div className="text-2xl font-bold mb-1">{formatEuroAmount(totalActualBase)}</div>
        <p className="text-sm text-muted-foreground">
          {totalPlannedBase > 0 ? Math.round((totalActualBase / totalPlannedBase) * 100) : 0}% of
          budget
        </p>
      </Card>

      <Card className="p-2 md:p-6 shadow-md rounded-lg hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Target className="h-5 w-5 text-purple-500" />
          </div>
          <h3 className="font-semibold">Remaining</h3>
        </div>
        <div className="text-2xl font-bold mb-1">
          {formatEuroAmount(Math.max(totalPlannedBase - totalActualBase, 0))}
        </div>
        <p className="text-sm text-muted-foreground">
          {totalPlannedBase > 0
            ? Math.round(((totalPlannedBase - totalActualBase) / totalPlannedBase) * 100)
            : 0}
          % remaining
        </p>
      </Card>
    </div>
  );
}
