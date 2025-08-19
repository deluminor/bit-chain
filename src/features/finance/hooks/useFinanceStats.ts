'use client';

import { useQuery } from '@tanstack/react-query';
import { subMonths, format, eachMonthOfInterval } from 'date-fns';
import { currencyService, BASE_CURRENCY } from '@/lib/currency';

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
  const { transactions, summary } = transactionsData;

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
    let balanceInEur = acc.balance;
    if (acc.currency !== BASE_CURRENCY) {
      try {
        balanceInEur = await currencyService.convertToBaseCurrency(acc.balance, acc.currency);
      } catch {
        // Use fallback rates
        const fallbackRates: Record<string, number> = {
          USD: 0.9,
          UAH: 0.025,
          GBP: 1.15,
          PLN: 0.23,
          CZK: 0.04,
          CHF: 1.05,
          CAD: 0.68,
          JPY: 0.0062,
        };
        balanceInEur = acc.balance * (fallbackRates[acc.currency] || 1);
      }
    }
    currentNetWorth += balanceInEur;
  }

  // Generate monthly stats with currency conversion
  const months = eachMonthOfInterval({ start: startDate, end: endDate });
  const monthlyStats: MonthlyStats[] = [];

  for (let i = 0; i < months.length; i++) {
    const month = months[i];
    const monthKey = format(month, 'yyyy-MM');
    const monthName = format(month, 'MMM');

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
      let amountInEur = transaction.amount;
      if (transaction.currency && transaction.currency !== BASE_CURRENCY) {
        try {
          amountInEur = await currencyService.convertToBaseCurrency(
            transaction.amount,
            transaction.currency,
          );
        } catch {
          const fallbackRates: Record<string, number> = {
            USD: 0.9,
            UAH: 0.025,
            GBP: 1.15,
            PLN: 0.23,
            CZK: 0.04,
            CHF: 1.05,
            CAD: 0.68,
            JPY: 0.0062,
          };
          amountInEur = transaction.amount * (fallbackRates[transaction.currency] || 1);
        }
      }

      if (transaction.type === 'INCOME') {
        monthlyIncome += amountInEur;
      } else if (transaction.type === 'EXPENSE') {
        monthlyExpenses += amountInEur;
      }
    }

    // Estimate net worth progression (simplified calculation)
    const netIncomeThisMonth = monthlyIncome - monthlyExpenses;
    const monthsFromEnd = months.length - 1 - i;
    const avgMonthlyChange = netIncomeThisMonth > 0 ? netIncomeThisMonth * 0.8 : netIncomeThisMonth;
    const estimatedNetWorth = currentNetWorth - monthsFromEnd * (avgMonthlyChange / 12);

    monthlyStats.push({
      month: monthName,
      income: monthlyIncome,
      expenses: monthlyExpenses,
      netWorth: Math.max(0, estimatedNetWorth), // Ensure non-negative
    });
  }

  return {
    monthlyStats,
    totalStats: {
      totalIncome: summary.income || 0,
      totalExpenses: summary.expenses || 0,
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
