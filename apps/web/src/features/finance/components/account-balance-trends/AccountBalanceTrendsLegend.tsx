import { Badge } from '@/components/ui/badge';
import type { FinanceAccount } from '@/features/finance/queries/accounts';
import { formatCurrency } from '@/lib/currency';

interface AccountBalanceTrendsLegendProps {
  accounts: FinanceAccount[];
}

export function AccountBalanceTrendsLegend({ accounts }: AccountBalanceTrendsLegendProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {accounts.map(account => (
        <div key={account.id} className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: account.color }} />
          <span className="text-sm font-medium">{account.name}</span>
          <Badge variant="secondary" className="text-xs">
            {formatCurrency(account.balance, account.currency, { useLargeNumberFormat: false })}
          </Badge>
        </div>
      ))}
    </div>
  );
}
