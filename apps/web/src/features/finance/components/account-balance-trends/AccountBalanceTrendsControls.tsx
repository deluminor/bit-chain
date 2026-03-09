import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { FinanceAccount } from '@/features/finance/queries/accounts';
import { formatCurrency } from '@/lib/currency';
import { Wallet } from 'lucide-react';

interface AccountBalanceTrendsControlsProps {
  accounts: FinanceAccount[];
  accountsToShow: FinanceAccount[];
  selectedAccounts: string[];
  onToggle: (accountId: string) => void;
}

export function AccountBalanceTrendsControls({
  accounts,
  accountsToShow,
  selectedAccounts,
  onToggle,
}: AccountBalanceTrendsControlsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          Accounts ({accountsToShow.length})
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="p-2">
          <div className="mb-2 text-sm font-medium">Select Accounts</div>
          {accounts.map(account => (
            <DropdownMenuCheckboxItem
              key={account.id}
              checked={
                selectedAccounts.includes(account.id) ||
                (selectedAccounts.length === 0 &&
                  accountsToShow.some(item => item.id === account.id))
              }
              onCheckedChange={() => onToggle(account.id)}
              className="flex items-center gap-2"
            >
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: account.color }} />
              <span className="flex-1">{account.name}</span>
              <Badge variant="secondary" className="text-xs">
                {formatCurrency(account.balance, account.currency, {
                  useLargeNumberFormat: false,
                })}
              </Badge>
            </DropdownMenuCheckboxItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
