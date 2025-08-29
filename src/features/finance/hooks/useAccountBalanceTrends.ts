'use client';

import { useQuery } from '@tanstack/react-query';
import { format, eachMonthOfInterval } from 'date-fns';
import { currencyService, BASE_CURRENCY } from '@/lib/currency';

interface Transaction {
  accountId: string;
  date: string;
  type: string;
  amount: number;
}

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

  // Get months from current year only
  const currentYear = new Date().getFullYear();
  const startDate = new Date(currentYear, 0, 1); // January 1st of current year
  const endDate = new Date(); // Today
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

  // Fallback conversion rates
  const fallbackRates: Record<string, number> = {
    USD: 0.9, // 1 USD ≈ 0.9 EUR
    UAH: 0.025, // 1 UAH ≈ 0.025 EUR
    GBP: 1.15, // 1 GBP ≈ 1.15 EUR
    PLN: 0.23, // 1 PLN ≈ 0.23 EUR
    CZK: 0.04, // 1 CZK ≈ 0.04 EUR
    CHF: 1.05, // 1 CHF ≈ 1.05 EUR
    CAD: 0.68, // 1 CAD ≈ 0.68 EUR
    JPY: 0.0062, // 1 JPY ≈ 0.0062 EUR
  };

  // Calculate balance trends with currency conversion
  const trendsPromises = months.map(async month => {
    const monthName = format(month, 'MMM');

    const result: AccountBalanceTrend = {
      date: monthName,
    };

    // For each account, calculate the balance at the end of this month
    for (const account of accounts) {
      // Get all transactions for this account up to the end of this month
      const monthEndDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

      // Calculate balance based on current balance minus future transactions
      let calculatedBalance = account.balance;
      const futureTransactions = transactions.filter(
        (t: Transaction) => t.accountId === account.id && new Date(t.date) > monthEndDate,
      );

      // Subtract future transactions to get historical balance
      futureTransactions.forEach((t: Transaction) => {
        if (t.type === 'INCOME') {
          calculatedBalance -= t.amount;
        } else if (t.type === 'EXPENSE') {
          calculatedBalance += t.amount;
        }
      });

      // Convert to EUR if not already in EUR
      let convertedBalance = calculatedBalance;
      if (account.currency !== BASE_CURRENCY) {
        try {
          convertedBalance = await currencyService.convertToBaseCurrency(
            calculatedBalance,
            account.currency,
          );
        } catch {
          convertedBalance = calculatedBalance * (fallbackRates[account.currency] || 1);
        }
      }

      // Ensure non-negative balance
      result[account.name] = Math.max(0, convertedBalance);
    }

    return result;
  });

  return Promise.all(trendsPromises);
}

export function useAccountBalanceTrends() {
  return useQuery({
    queryKey: ['account-balance-trends'],
    queryFn: fetchAccountBalanceTrends,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
