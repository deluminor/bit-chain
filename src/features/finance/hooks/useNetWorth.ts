'use client';

import { useQuery } from '@tanstack/react-query';
import { currencyService } from '@/lib/currency';

interface NetWorthDataPoint {
  date: string;
  netWorth: number;
}

async function fetchNetWorthData(): Promise<NetWorthDataPoint[]> {
  // Get all accounts (including inactive to get full history)
  const accountsResponse = await fetch('/api/finance/accounts?includeInactive=true');
  if (!accountsResponse.ok) {
    throw new Error('Failed to fetch accounts');
  }
  const accountsData = await accountsResponse.json();
  const accounts = accountsData.accounts;

  if (accounts.length === 0) {
    return [];
  }

  // Get all transactions for net worth calculation
  const transactionsResponse = await fetch('/api/finance/transactions?limit=10000');
  if (!transactionsResponse.ok) {
    throw new Error('Failed to fetch transactions');
  }
  const transactionsData = await transactionsResponse.json();
  const transactions = transactionsData.transactions;

  // Fallback conversion rates
  const fallbackRates: Record<string, number> = {
    USD: 0.9,
    UAH: 0.025,
    GBP: 1.15,
    PLN: 0.23,
    CZK: 0.04,
    CHF: 1.05,
    CAD: 0.68,
    JPY: 0.0062,
    HUF: 0.0027,
  };

  // Calculate current net worth from active accounts
  let currentNetWorth = 0;
  for (const account of accounts.filter((acc: any) => acc.isActive)) {
    let convertedBalance = account.balance;
    if (account.currency !== 'EUR') {
      try {
        convertedBalance = await currencyService.convertToBaseCurrency(
          account.balance,
          account.currency || 'USD',
        );
      } catch {
        convertedBalance = account.balance * (fallbackRates[account.currency] || 1);
      }
    }
    currentNetWorth += convertedBalance;
  }

  // Group transactions by month
  const monthlyTransactions = new Map<string, number>();

  for (const transaction of transactions) {
    const transactionDate = new Date(transaction.date);
    const monthKey = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;

    let convertedAmount = transaction.amount;
    if (transaction.currency !== 'EUR') {
      try {
        convertedAmount = await currencyService.convertToBaseCurrency(
          transaction.amount,
          transaction.currency || 'USD',
        );
      } catch {
        convertedAmount = transaction.amount * (fallbackRates[transaction.currency] || 1);
      }
    }

    monthlyTransactions.set(monthKey, (monthlyTransactions.get(monthKey) || 0) + convertedAmount);
  }

  // Create timeline starting from 6 months ago
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
  const netWorthHistory: NetWorthDataPoint[] = [];

  // Generate monthly data points
  let runningNetWorth = currentNetWorth;
  const currentDate = new Date(now);

  // Work backwards from current month
  while (currentDate >= sixMonthsAgo) {
    const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    const monthlyChange = monthlyTransactions.get(monthKey) || 0;

    netWorthHistory.unshift({
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toLocaleDateString(
        'en-US',
        {
          month: 'short',
          year: 'numeric',
        },
      ),
      netWorth: Math.max(0, runningNetWorth), // Ensure non-negative
    });

    // Subtract this month's transactions to get previous month's net worth
    runningNetWorth -= monthlyChange;

    // Move to previous month
    currentDate.setMonth(currentDate.getMonth() - 1);
  }

  return netWorthHistory;
}

export function useNetWorth() {
  return useQuery({
    queryKey: ['net-worth'],
    queryFn: fetchNetWorthData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
