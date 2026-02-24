'use client';

import { useState, useEffect } from 'react';
import { useAccounts } from '@/features/finance/queries/accounts';
import { convertToBaseCurrencySafe, formatSummaryAmount } from '@/lib/currency';
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
  const accounts = accountsData?.accounts || [];
  const [totalBalanceEUR, setTotalBalanceEUR] = useState(0);
  const [isConverting, setIsConverting] = useState(false);

  // Convert all account balances to EUR
  useEffect(() => {
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

          totalInEUR += await convertToBaseCurrencySafe(account.balance, account.currency);
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
  }, [accounts]);

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
  const formattedBalance = accounts.length ? formatSummaryAmount(totalBalanceEUR) : fallbackText;

  return <span className={`${sizeClasses[size]} ${className}`}>{formattedBalance}</span>;
}
