import { FinanceAccount } from '@/features/finance/queries/accounts';
import { convertToBaseCurrencySafe } from '@/lib/currency';
import { useEffect, useState } from 'react';

interface UseAccountBalanceConversionReturn {
  totalBalanceEUR: number;
  isConverting: boolean;
}

export function useAccountBalanceConversion(
  accounts: FinanceAccount[],
): UseAccountBalanceConversionReturn {
  const [totalBalanceEUR, setTotalBalanceEUR] = useState(0);
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    const convertBalances = async () => {
      if (accounts.length === 0) {
        setTotalBalanceEUR(0);
        return;
      }

      setIsConverting(true);
      try {
        let totalEUR = 0;
        const activeAccounts = accounts.filter(account => account.isActive);
        for (const account of activeAccounts) {
          totalEUR += await convertToBaseCurrencySafe(account.balance, account.currency);
        }
        setTotalBalanceEUR(totalEUR);
      } catch (conversionError) {
        console.error('Error converting balances:', conversionError);
        const fallbackTotal = accounts
          .filter(account => account.isActive)
          .reduce((sum, account) => sum + account.balance, 0);
        setTotalBalanceEUR(fallbackTotal);
      } finally {
        setIsConverting(false);
      }
    };

    void convertBalances();
  }, [accounts]);

  return { totalBalanceEUR, isConverting };
}
