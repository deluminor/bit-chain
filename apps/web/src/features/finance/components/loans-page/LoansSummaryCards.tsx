'use client';

import { Card } from '@/components/ui/card';
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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-4 md:p-6">
        <div className="flex items-center gap-3 mb-3">
          <BadgeDollarSign className="h-5 w-5 text-rose-500" />
          <h3 className="font-semibold">Outstanding</h3>
        </div>
        <div className="text-2xl font-bold">
          {formatDisplayAmount(summary.totalOutstandingBase, BASE_CURRENCY, 'summary')}
        </div>
        <p className="text-sm text-muted-foreground">Base currency total</p>
      </Card>
      <Card className="p-4 md:p-6">
        <div className="flex items-center gap-3 mb-3">
          <Wallet className="h-5 w-5 text-emerald-500" />
          <h3 className="font-semibold">Active</h3>
        </div>
        <div className="text-2xl font-bold">{summary.active}</div>
        <p className="text-sm text-muted-foreground">Unpaid loans</p>
      </Card>
      <Card className="p-4 md:p-6">
        <div className="flex items-center gap-3 mb-3">
          <Landmark className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold">Loans vs Debts</h3>
        </div>
        <div className="text-2xl font-bold">
          {summary.loanCount} / {summary.debtCount}
        </div>
        <p className="text-sm text-muted-foreground">Loans / Debts</p>
      </Card>
      <Card className="p-4 md:p-6">
        <div className="flex items-center gap-3 mb-3">
          <CalendarClock className="h-5 w-5 text-orange-500" />
          <h3 className="font-semibold">Next Due</h3>
        </div>
        <div className="text-2xl font-bold">
          {nearestDueDate ? nearestDueDate.toLocaleDateString('en-GB') : '—'}
        </div>
        <p className="text-sm text-muted-foreground">Closest deadline</p>
      </Card>
    </div>
  );
}
