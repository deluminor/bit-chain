'use client';

import { BalanceOverviewDetails } from '@/components/layout/balance-overview/BalanceOverviewDetails';
import { BalanceOverviewLoadingCard } from '@/components/layout/balance-overview/BalanceOverviewLoadingCard';
import type {
  AccountBalance,
  BalanceOverviewProps,
} from '@/components/layout/balance-overview/balance-overview.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAccounts } from '@/features/finance/queries/accounts';
import { useToast } from '@/hooks/use-toast';
import { convertToBaseCurrencySafe, formatSummaryAmount } from '@/lib/currency';
import { Euro, Eye, EyeOff, Info, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export function BalanceOverview({
  className,
  showDetails = true,
  refreshInterval = 5,
}: BalanceOverviewProps) {
  const { toast } = useToast();
  const { data: accountsData, isLoading: accountsLoading, refetch } = useAccounts();

  const [balances, setBalances] = useState<AccountBalance[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [isConverting, setIsConverting] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [showBalance, setShowBalance] = useState(true);
  const [conversionError, setConversionError] = useState<string | null>(null);

  const convertBalances = useCallback(async () => {
    if (!accountsData?.accounts) {
      return;
    }

    setIsConverting(true);
    setConversionError(null);

    try {
      const convertedBalances: AccountBalance[] = [];
      let total = 0;

      for (const account of accountsData.accounts) {
        const convertedAmount = await convertToBaseCurrencySafe(account.balance, account.currency);

        convertedBalances.push({
          accountId: account.id,
          accountName: account.name,
          originalAmount: account.balance,
          originalCurrency: account.currency,
          convertedAmount,
          accountColor: account.color,
          isActive: account.isActive,
        });

        if (account.isActive) {
          total += convertedAmount;
        }
      }

      setBalances(convertedBalances);
      setTotalBalance(total);
      setLastUpdated(new Date());
    } catch (error: unknown) {
      console.error('Failed to convert balances:', error);
      setConversionError('Failed to update exchange rates. Using fallback rates.');
      toast({
        title: 'Exchange Rate Warning',
        description: 'Using fallback exchange rates. Some conversions may be approximate.',
        variant: 'default',
      });
    } finally {
      setIsConverting(false);
    }
  }, [accountsData?.accounts, toast]);

  useEffect(() => {
    if (accountsData?.accounts) {
      void convertBalances();
    }
  }, [accountsData?.accounts, convertBalances]);

  useEffect(() => {
    if (refreshInterval <= 0) {
      return;
    }

    const interval = setInterval(
      () => {
        if (!isConverting) {
          void convertBalances();
        }
      },
      refreshInterval * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [refreshInterval, isConverting, convertBalances]);

  const activeBalances = balances.filter(balance => balance.isActive);

  const formatBalanceDisplay = (amount: number) => {
    if (!showBalance) {
      return '••••••';
    }

    return formatSummaryAmount(amount);
  };

  const getBalanceColor = (amount: number) => {
    if (amount > 0) {
      return 'text-income';
    }

    if (amount < 0) {
      return 'text-expense';
    }

    return 'text-muted-foreground';
  };

  const handleRefresh = () => {
    void refetch();
    void convertBalances();
  };

  if (accountsLoading) {
    return <BalanceOverviewLoadingCard className={className} />;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Euro className="h-5 w-5 text-transfer" />
            Total Balance (EUR)
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowBalance(previous => !previous)}>
              {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isConverting}>
              <RefreshCw className={`h-4 w-4 ${isConverting ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardTitle>

        <CardDescription className="flex items-center justify-between">
          <span>Consolidated balance across all accounts</span>
          {lastUpdated && (
            <span className="text-xs">Updated: {lastUpdated.toLocaleTimeString()}</span>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-center">
          <div className={`text-3xl font-bold ${getBalanceColor(totalBalance)}`}>
            {formatBalanceDisplay(totalBalance)}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {activeBalances.length} active account{activeBalances.length !== 1 ? 's' : ''}
            {isConverting && (
              <span className="ml-2 text-transfer">
                <RefreshCw className="mr-1 inline h-3 w-3 animate-spin" />
                Updating rates...
              </span>
            )}
          </div>
          {conversionError && (
            <div className="mt-1 flex items-center justify-center gap-1 text-xs text-amber-600">
              <Info className="h-3 w-3" />
              {conversionError}
            </div>
          )}
        </div>

        <BalanceOverviewDetails
          balances={balances}
          showBalance={showBalance}
          showDetails={showDetails}
          refreshInterval={refreshInterval}
          getBalanceColor={getBalanceColor}
        />
      </CardContent>
    </Card>
  );
}
