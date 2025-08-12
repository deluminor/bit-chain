'use client';

import { useState, useEffect } from 'react';
import { useAccounts } from '@/features/finance/queries/accounts';
import { currencyService, formatSummaryAmount, BASE_CURRENCY } from '@/lib/currency';
import { RefreshCw } from 'lucide-react';

interface TotalBalanceDisplayProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLoading?: boolean;
  fallbackText?: string;
}

export function TotalBalanceDisplay({
  className = '',
  size = 'md',
  showLoading = true,
  fallbackText = '€0',
}: TotalBalanceDisplayProps) {
  const { data: accountsData, isLoading: accountsLoading } = useAccounts();
  const [totalBalanceEUR, setTotalBalanceEUR] = useState(0);
  const [isConverting, setIsConverting] = useState(false);

  // Convert all account balances to EUR
  useEffect(() => {
    const accounts = accountsData?.accounts || [];

    const convertBalances = async () => {
      if (!accounts.length) {
        setTotalBalanceEUR(0);
        return;
      }

      setIsConverting(true);
      try {
        let totalInEUR = 0;

        for (const account of accounts) {
          if (!account.isActive) continue;

          let convertedAmount = account.balance;

          if (account.currency !== BASE_CURRENCY) {
            try {
              convertedAmount = await currencyService.convertToBaseCurrency(
                account.balance,
                account.currency,
              );
            } catch {
              // Use fallback conversion rates
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
              convertedAmount = account.balance * (fallbackRates[account.currency] || 1);
            }
          }

          totalInEUR += convertedAmount;
        }

        setTotalBalanceEUR(totalInEUR);
      } catch (error) {
        console.error('Failed to convert balances:', error);
        setTotalBalanceEUR(0);
      } finally {
        setIsConverting(false);
      }
    };

    convertBalances();
  }, [accountsData]);

  // Size classes
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl font-bold',
  };

  // Loading or converting state
  if (accountsLoading || (isConverting && showLoading)) {
    return (
      <div className={`${sizeClasses[size]} ${className} flex items-center gap-2`}>
        <RefreshCw className="h-4 w-4 animate-spin" />
        Converting...
      </div>
    );
  }

  // Format the balance
  const formattedBalance =
    totalBalanceEUR > 0 ? formatSummaryAmount(totalBalanceEUR) : fallbackText;

  return <span className={`${sizeClasses[size]} ${className}`}>{formattedBalance}</span>;
}
