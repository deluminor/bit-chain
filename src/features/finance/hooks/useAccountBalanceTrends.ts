'use client';

import { useQuery } from '@tanstack/react-query';
import { subMonths, format, eachMonthOfInterval } from 'date-fns';

interface AccountBalanceTrend {
  date: string;
  [accountName: string]: string | number;
}

async function fetchAccountBalanceTrends(): Promise<AccountBalanceTrend[]> {
  // Get accounts data
  const accountsResponse = await fetch('/api/finance/accounts');
  if (!accountsResponse.ok) {
    throw new Error('Failed to fetch accounts');
  }

  const accountsData = await accountsResponse.json();
  const { accounts } = accountsData;

  // Get last 12 months of data
  const endDate = new Date();
  const startDate = subMonths(endDate, 11);
  const months = eachMonthOfInterval({ start: startDate, end: endDate });

  // Get transactions for balance calculations
  const transactionsResponse = await fetch(
    `/api/finance/transactions?dateFrom=${startDate.toISOString()}&dateTo=${endDate.toISOString()}&limit=10000`,
  );

  if (!transactionsResponse.ok) {
    throw new Error('Failed to fetch transactions');
  }

  const transactionsData = await transactionsResponse.json();
  const { transactions } = transactionsData;

  // Calculate balance trends
  return months.map(month => {
    const monthName = format(month, 'MMM');

    const result: AccountBalanceTrend = {
      date: monthName,
    };

    // For each account, calculate the balance at the end of this month
    accounts.forEach((account: any) => {
      // Get all transactions for this account up to the end of this month
      const monthEndDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

      // Calculate balance based on current balance minus future transactions
      let calculatedBalance = account.balance;
      const futureTransactions = transactions.filter(
        (t: any) => t.accountId === account.id && new Date(t.date) > monthEndDate,
      );

      // Subtract future transactions to get historical balance
      futureTransactions.forEach((t: any) => {
        if (t.type === 'INCOME') {
          calculatedBalance -= t.amount;
        } else if (t.type === 'EXPENSE') {
          calculatedBalance += t.amount;
        }
      });

      // Ensure non-negative balance
      result[account.name] = Math.max(0, calculatedBalance);
    });

    return result;
  });
}

export function useAccountBalanceTrends() {
  return useQuery({
    queryKey: ['account-balance-trends'],
    queryFn: fetchAccountBalanceTrends,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
