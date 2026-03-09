'use client';

import { useQuery } from '@tanstack/react-query';
import { format, eachMonthOfInterval } from 'date-fns';
import { convertToBaseCurrencySafe } from '@/lib/currency';

interface Transaction {
  accountId: string;
  date: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  amount: number;
  currency?: string;
  transferToId?: string;
  transferAmount?: number;
  transferCurrency?: string;
}

interface AccountBalanceTrend {
  date: string;
  [accountName: string]: string | number;
}

interface AccountBalanceResponseItem {
  id: string;
  name: string;
  currency: string;
  balance: number;
  isActive: boolean;
}

interface AccountsResponse {
  accounts: AccountBalanceResponseItem[];
}

async function fetchAccountBalanceTrends(): Promise<AccountBalanceTrend[]> {
  const accountsResponse = await fetch('/api/finance/accounts?includeInactive=true');
  if (!accountsResponse.ok) {
    throw new Error('Failed to fetch accounts');
  }

  const accountsData = (await accountsResponse.json()) as AccountsResponse;
  const { accounts } = accountsData;

  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 11);
  const months = eachMonthOfInterval({ start: startDate, end: endDate });
  const monthKeys = months.map(month => format(month, 'yyyy-MM'));

  const transactionsResponse = await fetch(
    `/api/finance/transactions?dateFrom=${startDate.toISOString()}&dateTo=${endDate.toISOString()}&limit=10000`,
  );

  if (!transactionsResponse.ok) {
    throw new Error('Failed to fetch transactions');
  }

  const transactionsData = await transactionsResponse.json();
  const { transactions } = transactionsData as { transactions: Transaction[] };

  const activeAccounts = accounts.filter(account => account.isActive);
  const accountBalances = new Map<string, number>();

  for (const account of activeAccounts) {
    accountBalances.set(
      account.id,
      await convertToBaseCurrencySafe(account.balance, account.currency),
    );
  }

  const monthlyDeltas = new Map<string, Map<string, number>>();

  for (const transaction of transactions) {
    const monthKey = format(new Date(transaction.date), 'yyyy-MM');

    if (!monthKeys.includes(monthKey)) {
      continue;
    }

    const amountInEur = await convertToBaseCurrencySafe(transaction.amount, transaction.currency);
    const outgoingDelta = transaction.type === 'INCOME' ? amountInEur : -amountInEur;

    if (transaction.type !== 'TRANSFER') {
      const accountMonthDeltas = monthlyDeltas.get(transaction.accountId) || new Map();
      accountMonthDeltas.set(monthKey, (accountMonthDeltas.get(monthKey) || 0) + outgoingDelta);
      monthlyDeltas.set(transaction.accountId, accountMonthDeltas);
    } else {
      const fromMonthDeltas = monthlyDeltas.get(transaction.accountId) || new Map();
      fromMonthDeltas.set(monthKey, (fromMonthDeltas.get(monthKey) || 0) - amountInEur);
      monthlyDeltas.set(transaction.accountId, fromMonthDeltas);

      if (transaction.transferToId) {
        const incomingAmount = transaction.transferAmount ?? transaction.amount;
        const incomingCurrency = transaction.transferCurrency ?? transaction.currency;
        const incomingInEur = await convertToBaseCurrencySafe(
          incomingAmount,
          incomingCurrency || 'EUR',
        );
        const toMonthDeltas = monthlyDeltas.get(transaction.transferToId) || new Map();
        toMonthDeltas.set(monthKey, (toMonthDeltas.get(monthKey) || 0) + incomingInEur);
        monthlyDeltas.set(transaction.transferToId, toMonthDeltas);
      }
    }
  }

  const results: AccountBalanceTrend[] = months.map(month => ({
    date: format(month, 'MMM yyyy'),
  }));

  for (const account of activeAccounts) {
    let runningBalance = accountBalances.get(account.id) || 0;

    for (let index = monthKeys.length - 1; index >= 0; index -= 1) {
      const monthKey = monthKeys[index];
      const safeMonthKey = monthKey || '';
      const monthDelta = monthlyDeltas.get(account.id)?.get(safeMonthKey) || 0;
      const monthIndex = index;

      if (results[monthIndex]) {
        results[monthIndex][account.name] = Math.max(0, runningBalance);
      }

      runningBalance -= monthDelta;
    }
  }

  return results;
}

export function useAccountBalanceTrends() {
  return useQuery({
    queryKey: ['account-balance-trends'],
    queryFn: fetchAccountBalanceTrends,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
