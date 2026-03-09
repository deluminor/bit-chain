import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatSummaryAmount } from '@/lib/currency';
import { Wallet } from 'lucide-react';
import type { AccountBalance } from './balance-overview.types';

const DEFAULT_ACCOUNT_COLOR = '#3B82F6';

interface BalanceOverviewDetailsProps {
  balances: AccountBalance[];
  showBalance: boolean;
  showDetails: boolean;
  refreshInterval: number;
  getBalanceColor: (amount: number) => string;
}

export function BalanceOverviewDetails({
  balances,
  showBalance,
  showDetails,
  refreshInterval,
  getBalanceColor,
}: BalanceOverviewDetailsProps) {
  const activeBalances = balances.filter(balance => balance.isActive);
  const inactiveBalances = balances.filter(balance => !balance.isActive);

  return (
    <>
      {showDetails && activeBalances.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-medium text-muted-foreground">Account Breakdown</div>
          <div className="space-y-2">
            {activeBalances.map(balance => (
              <div
                key={balance.accountId}
                className="flex items-center justify-between rounded-lg bg-muted/30 p-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: balance.accountColor || DEFAULT_ACCOUNT_COLOR }}
                  />
                  <div>
                    <div className="text-sm font-medium">{balance.accountName}</div>
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

      {showDetails && inactiveBalances.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-medium text-muted-foreground">
            Deactivated Accounts ({inactiveBalances.length})
          </div>
          <div className="space-y-2">
            {inactiveBalances.map(balance => (
              <div
                key={balance.accountId}
                className="flex items-center justify-between rounded-lg bg-muted/20 p-2 opacity-60"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: balance.accountColor || DEFAULT_ACCOUNT_COLOR }}
                  />
                  <span className="text-sm">{balance.accountName}</span>
                  <Badge
                    variant="secondary"
                    className="bg-red-100 text-xs text-red-800 dark:bg-red-900/20 dark:text-red-400"
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

      {showDetails && (
        <div className="border-t pt-3">
          <div className="text-center text-xs text-muted-foreground">
            Exchange rates from ExchangeRate-API • Auto-refresh every {refreshInterval} minutes
            <br />
            All amounts converted to EUR for consolidated view
          </div>
        </div>
      )}

      {activeBalances.length === 0 && (
        <div className="py-8 text-center">
          <Wallet className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
          <div className="text-muted-foreground">No active accounts found</div>
          <div className="text-sm text-muted-foreground">
            Add an account to start tracking your balance
          </div>
        </div>
      )}
    </>
  );
}
