'use client';

import { useQuery } from '@tanstack/react-query';
import { subMonths, format, eachMonthOfInterval } from 'date-fns';
import { convertToBaseCurrencySafe } from '@/lib/currency';

interface MonthlyStats {
  month: string;
  income: number;
  expenses: number;
  netWorth: number;
}

interface FinanceStatsResponse {
  monthlyStats: MonthlyStats[];
  totalStats: {
    totalIncome: number;
    totalExpenses: number;
    currentNetWorth: number;
  };
}

async function fetchFinanceStats(): Promise<FinanceStatsResponse> {
  // Get data from last 12 months
  const endDate = new Date();
  const startDate = subMonths(endDate, 11);

  // Get transactions for the period
  const transactionsResponse = await fetch(
    `/api/finance/transactions?dateFrom=${startDate.toISOString()}&dateTo=${endDate.toISOString()}&limit=10000`,
  );

  if (!transactionsResponse.ok) {
    throw new Error('Failed to fetch transactions');
  }

  const transactionsData = await transactionsResponse.json();
  const { transactions } = transactionsData;

  // Get accounts for net worth calculation
  const accountsResponse = await fetch('/api/finance/accounts');
  if (!accountsResponse.ok) {
    throw new Error('Failed to fetch accounts');
  }

  interface Account {
    balance: number;
    currency: string;
    isActive: boolean;
  }
  const accountsData = await accountsResponse.json();
  const { accounts } = accountsData as { accounts: Account[] };

  // Calculate current net worth (converted to EUR)
  let currentNetWorth = 0;
  for (const acc of accounts.filter((acc: Account) => acc.isActive)) {
    currentNetWorth += await convertToBaseCurrencySafe(acc.balance, acc.currency);
  }

  // Generate monthly stats with currency conversion
  const months = eachMonthOfInterval({ start: startDate, end: endDate });
  const monthlyStats: MonthlyStats[] = [];

  const monthSnapshots: Array<{ month: string; income: number; expenses: number }> = [];

  for (const month of months) {
    if (!month) {
      continue;
    }

    const monthKey = format(month, 'yyyy-MM');
    const monthName = format(month, 'MMM yyyy');

    // Filter transactions for this month
    interface Transaction {
      date: string;
      amount: number;
      currency: string;
      type: 'INCOME' | 'EXPENSE';
    }
    const monthTransactions = transactions.filter((t: Transaction) => {
      const transactionDate = new Date(t.date);
      return format(transactionDate, 'yyyy-MM') === monthKey;
    });

    // Calculate income and expenses for the month (converted to EUR)
    let monthlyIncome = 0;
    let monthlyExpenses = 0;

    for (const transaction of monthTransactions as Transaction[]) {
      const amountInEur = await convertToBaseCurrencySafe(transaction.amount, transaction.currency);

      if (transaction.type === 'INCOME') {
        monthlyIncome += amountInEur;
      } else if (transaction.type === 'EXPENSE') {
        monthlyExpenses += amountInEur;
      }
    }

    monthSnapshots.push({ month: monthName, income: monthlyIncome, expenses: monthlyExpenses });
  }

  let runningNetWorth = currentNetWorth;
  let totalIncome = 0;
  let totalExpenses = 0;

  for (let i = monthSnapshots.length - 1; i >= 0; i -= 1) {
    const snapshot = monthSnapshots[i];
    const netIncomeThisMonth = snapshot ? snapshot.income - snapshot.expenses : 0;

    if (snapshot) {
      totalIncome += snapshot.income;
      totalExpenses += snapshot.expenses;
      monthlyStats.unshift({
        month: snapshot.month,
        income: snapshot.income,
        expenses: snapshot.expenses,
        netWorth: Math.max(0, runningNetWorth),
      });
    }

    runningNetWorth -= netIncomeThisMonth;
  }

  return {
    monthlyStats,
    totalStats: {
      totalIncome,
      totalExpenses,
      currentNetWorth,
    },
  };
}

export function useFinanceStats() {
  return useQuery({
    queryKey: ['finance-stats'],
    queryFn: fetchFinanceStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
