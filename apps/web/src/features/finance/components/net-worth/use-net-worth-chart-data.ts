import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { convertToBaseCurrencySafe } from '@/lib/currency';
import type { FinanceAccount } from '@/features/finance/queries/accounts';
import type { Transaction } from '@/features/finance/queries/transactions';
import type { NetWorthDataPoint } from './net-worth.types';

interface UseNetWorthChartDataParams {
  accounts: FinanceAccount[];
  transactions: Transaction[];
  canFetchTransactions: boolean;
}

export function useNetWorthChartData({
  accounts,
  transactions,
  canFetchTransactions,
}: UseNetWorthChartDataParams) {
  const [chartData, setChartData] = useState<NetWorthDataPoint[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    const generateChartData = async () => {
      if (!accounts.length || !canFetchTransactions || !transactions.length) {
        setIsConverting(true);
        let currentNetWorthEur = 0;

        try {
          for (const account of accounts) {
            currentNetWorthEur += await convertToBaseCurrencySafe(
              account.balance,
              account.currency,
            );
          }

          setChartData([
            {
              date: format(new Date(), 'yyyy-MM-dd'),
              netWorth: currentNetWorthEur,
              totalAssets: currentNetWorthEur,
              change: 0,
            },
          ]);
        } catch (error) {
          console.error('Failed to convert currencies:', error);
          setChartData([]);
        } finally {
          setIsConverting(false);
        }
        return;
      }

      setIsConverting(true);
      try {
        const dataMap = new Map<string, NetWorthDataPoint>();
        const currentBalances = new Map<string, number>();

        for (const account of accounts) {
          const balanceInEur = await convertToBaseCurrencySafe(account.balance, account.currency);
          currentBalances.set(account.id, balanceInEur);
        }

        const sortedTransactions = [...transactions].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

        let previousNetWorth = 0;

        for (let index = 0; index < sortedTransactions.length; index++) {
          const transaction = sortedTransactions[index];
          if (!transaction) {
            continue;
          }

          const date = format(new Date(transaction.date), 'yyyy-MM-dd');
          const currentNetWorth = Array.from(currentBalances.values()).reduce(
            (sum, balance) => sum + balance,
            0,
          );

          if (!dataMap.has(date)) {
            const change = index === 0 ? 0 : currentNetWorth - previousNetWorth;
            dataMap.set(date, {
              date,
              netWorth: currentNetWorth,
              totalAssets: Math.max(currentNetWorth, 0),
              change,
            });
          }

          const transactionAmountEur = await convertToBaseCurrencySafe(
            transaction.amount,
            transaction.currency,
          );

          if (transaction.type === 'INCOME') {
            const currentBalance = currentBalances.get(transaction.account.id) || 0;
            currentBalances.set(transaction.account.id, currentBalance - transactionAmountEur);
          } else if (transaction.type === 'EXPENSE') {
            const currentBalance = currentBalances.get(transaction.account.id) || 0;
            currentBalances.set(transaction.account.id, currentBalance + transactionAmountEur);
          } else if (transaction.type === 'TRANSFER') {
            const fromBalance = currentBalances.get(transaction.account.id) || 0;
            currentBalances.set(transaction.account.id, fromBalance + transactionAmountEur);

            if (transaction.transferTo) {
              const toBalance = currentBalances.get(transaction.transferTo.id) || 0;
              currentBalances.set(transaction.transferTo.id, toBalance - transactionAmountEur);
            }
          }

          previousNetWorth = currentNetWorth;
        }

        const sortedData = Array.from(dataMap.values()).sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

        const finalData = sortedData.map((item, index) => ({
          ...item,
          change: index === 0 ? 0 : item.netWorth - (sortedData[index - 1]?.netWorth || 0),
        }));

        setChartData(finalData);
      } catch (error) {
        console.error('Failed to generate net worth chart data:', error);
        setChartData([]);
      } finally {
        setIsConverting(false);
      }
    };

    void generateChartData();
  }, [accounts, transactions, canFetchTransactions]);

  return { chartData, isConverting };
}
