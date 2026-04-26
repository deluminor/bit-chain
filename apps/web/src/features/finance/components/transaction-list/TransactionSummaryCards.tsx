'use client';

import { SummaryStatsRow, SummaryStatTile } from '@/components/ui/summary-stat-tile';
import { formatSummaryAmount } from '@/lib/currency';
import { ArrowRightLeft, DollarSign, TrendingDown, TrendingUp } from 'lucide-react';

interface TransactionSummary {
  income: number;
  expenses: number;
  transfers: number;
  totalTransactions: number;
  incomeCount: number;
  expenseCount: number;
  transferCount: number;
  maxIncome: number;
  maxExpense: number;
}

interface TransactionSummaryCardsProps {
  summary: TransactionSummary;
}

export function TransactionSummaryCards({ summary }: TransactionSummaryCardsProps) {
  const netIncomeEUR = summary.income - summary.expenses;
  const netClass = netIncomeEUR >= 0 ? 'text-income' : 'text-expense';

  return (
    <SummaryStatsRow className="sm:grid-cols-2 lg:grid-cols-4">
      <SummaryStatTile
        title="Net Income"
        value={formatSummaryAmount(netIncomeEUR)}
        hint="This period"
        icon={DollarSign}
        tone="purple"
        valueClassName={netClass}
      />
      <SummaryStatTile
        title="Income"
        value={formatSummaryAmount(summary.income)}
        hint={`${summary.incomeCount} transactions`}
        icon={TrendingUp}
        tone="income"
      />
      <SummaryStatTile
        title="Expenses"
        value={formatSummaryAmount(summary.expenses)}
        hint={`${summary.expenseCount} transactions`}
        icon={TrendingDown}
        tone="expense"
      />
      <SummaryStatTile
        title="Transfers"
        value={formatSummaryAmount(summary.transfers)}
        hint={`${summary.transferCount} transactions`}
        icon={ArrowRightLeft}
        tone="transfer"
      />
    </SummaryStatsRow>
  );
}
