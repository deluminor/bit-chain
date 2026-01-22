'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Wallet, RefreshCw, Euro, Eye, EyeOff, Info } from 'lucide-react';
import { convertToBaseCurrencySafe, formatCurrency, formatSummaryAmount } from '@/lib/currency';
import { useAccounts } from '@/features/finance/queries/accounts';

interface AccountBalance {
  accountId: string;
  accountName: string;
  originalAmount: number;
  originalCurrency: string;
  convertedAmount: number; // in EUR
  accountColor?: string;
  isActive: boolean;
}

interface BalanceOverviewProps {
  className?: string;
  showDetails?: boolean;
  refreshInterval?: number; // in minutes
}

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

  // Convert all account balances to EUR
  const convertBalances = async () => {
    if (!accountsData?.accounts) return;

    setIsConverting(true);
    setConversionError(null);

    try {
      const convertedBalances: AccountBalance[] = [];
      let total = 0;

      for (const account of accountsData.accounts) {
        let convertedAmount = account.balance;

        convertedAmount = await convertToBaseCurrencySafe(account.balance, account.currency);

        convertedBalances.push({
          accountId: account.id,
          accountName: account.name,
          originalAmount: account.balance,
          originalCurrency: account.currency,
          convertedAmount,
          accountColor: account.color,
          isActive: account.isActive,
        });

        // Add to total only if account is active
        if (account.isActive) {
          total += convertedAmount;
        }
      }

      setBalances(convertedBalances);
      setTotalBalance(total);
      setLastUpdated(new Date());
    } catch (_error: unknown) {
      console.error('Failed to convert balances:', _error);
      setConversionError('Failed to update exchange rates. Using fallback rates.');
      toast({
        title: 'Exchange Rate Warning',
        description: 'Using fallback exchange rates. Some conversions may be approximate.',
        variant: 'default',
      });
    } finally {
      setIsConverting(false);
    }
  };

  // Initial load and periodic refresh
  useEffect(() => {
    if (accountsData?.accounts) {
      convertBalances();
    }
  }, [accountsData, convertBalances]);

  // Auto-refresh exchange rates
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(
        () => {
          if (!isConverting) {
            convertBalances();
          }
        },
        refreshInterval * 60 * 1000,
      );

      return () => clearInterval(interval);
    }
  }, [refreshInterval, isConverting, convertBalances]);

  const handleRefresh = () => {
    refetch();
    convertBalances();
  };

  const formatBalanceDisplay = (amount: number) => {
    if (!showBalance) return '••••••';
    return formatSummaryAmount(amount);
  };

  const getBalanceColor = (amount: number) => {
    if (amount > 0) return 'text-income';
    if (amount < 0) return 'text-expense';
    return 'text-muted-foreground';
  };

  const activeBalances = balances.filter(b => b.isActive);
  const inactiveBalances = balances.filter(b => !b.isActive);

  if (accountsLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-12 w-40 mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    );
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
            <Button variant="ghost" size="sm" onClick={() => setShowBalance(!showBalance)}>
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
        {/* Total Balance Display */}
        <div className="text-center">
          <div className={`text-3xl font-bold ${getBalanceColor(totalBalance)}`}>
            {formatBalanceDisplay(totalBalance)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {activeBalances.length} active account{activeBalances.length !== 1 ? 's' : ''}
            {isConverting && (
              <span className="ml-2 text-transfer">
                <RefreshCw className="h-3 w-3 animate-spin inline mr-1" />
                Updating rates...
              </span>
            )}
          </div>
          {conversionError && (
            <div className="flex items-center justify-center gap-1 text-xs text-amber-600 mt-1">
              <Info className="h-3 w-3" />
              {conversionError}
            </div>
          )}
        </div>

        {/* Account Breakdown */}
        {showDetails && activeBalances.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-muted-foreground">Account Breakdown</div>
            <div className="space-y-2">
              {activeBalances.map(balance => (
                <div
                  key={balance.accountId}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: balance.accountColor || '#3B82F6' }}
                    />
                    <div>
                      <div className="font-medium text-sm">{balance.accountName}</div>
                      <div className="text-xs text-muted-foreground">
                        Original: {formatCurrency(balance.originalAmount, balance.originalCurrency)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${getBalanceColor(balance.convertedAmount)}`}>
                      {showBalance ? formatSummaryAmount(balance.convertedAmount) : '••••'}
                    </div>
                    {balance.originalCurrency !== 'EUR' && (
                      <Badge variant="outline" className="text-xs">
                        {balance.originalCurrency} → EUR
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inactive Accounts */}
        {showDetails && inactiveBalances.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-muted-foreground">
              Deactivated Accounts ({inactiveBalances.length})
            </div>
            <div className="space-y-2">
              {inactiveBalances.map(balance => (
                <div
                  key={balance.accountId}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/20 opacity-60"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: balance.accountColor || '#3B82F6' }}
                    />
                    <span className="text-sm">{balance.accountName}</span>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                    >
                      Deactivated
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {showBalance
                      ? formatCurrency(balance.originalAmount, balance.originalCurrency)
                      : '••••'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exchange Rate Info */}
        {showDetails && (
          <div className="border-t pt-3">
            <div className="text-xs text-muted-foreground text-center">
              Exchange rates from ExchangeRate-API • Auto-refresh every {refreshInterval} minutes
              <br />
              All amounts converted to EUR for consolidated view
            </div>
          </div>
        )}

        {/* No Accounts */}
        {activeBalances.length === 0 && (
          <div className="text-center py-8">
            <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <div className="text-muted-foreground">No active accounts found</div>
            <div className="text-sm text-muted-foreground">
              Add an account to start tracking your balance
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
