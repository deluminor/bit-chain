import type { FinanceAccount } from '@/features/finance/queries/accounts';
import type { Transaction } from '@/features/finance/queries/transactions';
import { convertToBaseCurrencySafe } from '@/lib/currency';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import type { BalanceDataPoint } from './account-balance-trends.types';

interface UseAccountBalanceTrendDataParams {
  accounts: FinanceAccount[];
  accountsToShow: FinanceAccount[];
  transactions: Transaction[];
  canFetchTransactions: boolean;
}

export function useAccountBalanceTrendData({
  accounts,
  accountsToShow,
  transactions,
  canFetchTransactions,
}: UseAccountBalanceTrendDataParams) {
  const [chartData, setChartData] = useState<BalanceDataPoint[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    const generateChartData = async () => {
      if (!accounts.length || !canFetchTransactions || !transactions.length) {
        setChartData([]);
        return;
      }

      setIsConverting(true);
      try {
        const dataMap = new Map<string, BalanceDataPoint>();
        const accountBalances = new Map<string, number>();

        for (const account of accounts) {
          const balanceInEur = await convertToBaseCurrencySafe(account.balance, account.currency);
          accountBalances.set(account.id, balanceInEur);
        }

        const sortedTransactions = [...transactions].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

        for (const transaction of sortedTransactions) {
          const date = format(new Date(transaction.date), 'yyyy-MM-dd');

          if (!dataMap.has(date)) {
            const point: BalanceDataPoint = { date };
            accountsToShow.forEach(account => {
              point[account.id] = accountBalances.get(account.id) || 0;
            });
            dataMap.set(date, point);
          }

          const dayData = dataMap.get(date);
          if (!dayData) {
            continue;
          }

          const transactionAmountEur = await convertToBaseCurrencySafe(
            transaction.amount,
            transaction.currency,
          );

          if (transaction.type === 'INCOME') {
            const currentBalance = accountBalances.get(transaction.account.id) || 0;
            accountBalances.set(transaction.account.id, currentBalance - transactionAmountEur);
          } else if (transaction.type === 'EXPENSE') {
            const currentBalance = accountBalances.get(transaction.account.id) || 0;
            accountBalances.set(transaction.account.id, currentBalance + transactionAmountEur);
          } else if (transaction.type === 'TRANSFER') {
            const fromBalance = accountBalances.get(transaction.account.id) || 0;
            accountBalances.set(transaction.account.id, fromBalance + transactionAmountEur);

            if (transaction.transferTo) {
              const toBalance = accountBalances.get(transaction.transferTo.id) || 0;
              accountBalances.set(transaction.transferTo.id, toBalance - transactionAmountEur);
            }
          }

          accountsToShow.forEach(account => {
            dayData[account.id] = accountBalances.get(account.id) || 0;
          });
        }

        const data = Array.from(dataMap.values()).sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

        setChartData(data);
      } catch (error) {
        console.error('Failed to generate chart data:', error);
        setChartData([]);
      } finally {
        setIsConverting(false);
      }
    };

    void generateChartData();
  }, [accounts, transactions, accountsToShow, canFetchTransactions]);

  return { chartData, isConverting };
}
