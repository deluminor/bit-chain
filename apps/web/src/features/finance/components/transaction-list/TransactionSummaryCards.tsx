'use client';

import { Card } from '@/components/ui/card';
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      <Card className="p-4 sm:p-5 lg:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div className="p-1.5 sm:p-2 bg-purple-500/10 rounded-lg">
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
          </div>
          <h3 className="font-medium sm:font-semibold text-sm sm:text-base">Net Income</h3>
        </div>
        <div
          className={`text-lg sm:text-xl lg:text-2xl font-bold mb-1 ${
            netIncomeEUR >= 0 ? 'text-income' : 'text-expense'
          }`}
        >
          {formatSummaryAmount(netIncomeEUR)}
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">This period</p>
      </Card>

      <Card className="p-4 sm:p-5 lg:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div className="p-1.5 sm:p-2 bg-income/10 rounded-lg">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-income" />
          </div>
          <h3 className="font-medium sm:font-semibold text-sm sm:text-base">Income</h3>
        </div>
        <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 text-income">
          {formatSummaryAmount(summary.income)}
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {summary.incomeCount} transactions
        </p>
      </Card>

      <Card className="p-4 sm:p-5 lg:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div className="p-1.5 sm:p-2 bg-expense/10 rounded-lg">
            <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-expense" />
          </div>
          <h3 className="font-medium sm:font-semibold text-sm sm:text-base">Expenses</h3>
        </div>
        <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 text-expense">
          {formatSummaryAmount(summary.expenses)}
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {summary.expenseCount} transactions
        </p>
      </Card>

      <Card className="p-4 sm:p-5 lg:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div className="p-1.5 sm:p-2 bg-transfer/10 rounded-lg">
            <ArrowRightLeft className="h-4 w-4 sm:h-5 sm:w-5 text-transfer" />
          </div>
          <h3 className="font-medium sm:font-semibold text-sm sm:text-base">Transfers</h3>
        </div>
        <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 text-transfer">
          {formatSummaryAmount(summary.transfers)}
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {summary.transferCount} transactions
        </p>
      </Card>
    </div>
  );
}
