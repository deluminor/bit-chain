import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, RefreshCw, Search, X } from 'lucide-react';
import { useTransactionCategories } from '@/features/finance/queries/transactions';
import { useAccounts, FinanceAccount } from '@/features/finance/queries/accounts';
import { TransactionCategory } from '@/features/finance/queries/categories';

interface TransactionFiltersProps {
  searchTerm: string;
  typeFilter?: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  accountFilter?: string;
  categoryFilter?: string;
  limitFilter: number;
  minAmount?: number;
  maxAmount?: number;
  onSearchChange: (value: string) => void;
  onTypeFilterChange: (value?: 'INCOME' | 'EXPENSE' | 'TRANSFER') => void;
  onAccountFilterChange: (value?: string) => void;
  onCategoryFilterChange: (value?: string) => void;
  onLimitFilterChange: (value: number) => void;
  onMinAmountChange: (value?: number) => void;
  onMaxAmountChange: (value?: number) => void;
  onRefetch: () => void;
  isFetching?: boolean;
}

export function TransactionFilters({
  searchTerm,
  typeFilter,
  accountFilter,
  categoryFilter,
  limitFilter,
  minAmount,
  maxAmount,
  onSearchChange,
  onTypeFilterChange,
  onAccountFilterChange,
  onCategoryFilterChange,
  onLimitFilterChange,
  onMinAmountChange,
  onMaxAmountChange,
  onRefetch,
  isFetching = false,
}: TransactionFiltersProps) {
  const { data: categoriesData } = useTransactionCategories();
  const { data: accountsData } = useAccounts();

  const categories: TransactionCategory[] = categoriesData || [];
  const accounts: FinanceAccount[] = accountsData?.accounts || [];

  const clearFilters = () => {
    onSearchChange('');
    onTypeFilterChange(undefined);
    onAccountFilterChange(undefined);
    onCategoryFilterChange(undefined);
    onLimitFilterChange(50);
    onMinAmountChange(undefined);
    onMaxAmountChange(undefined);
  };

  const hasActiveFilters =
    searchTerm || typeFilter || accountFilter || categoryFilter || minAmount || maxAmount;

  return (
    <div className="flex flex-col gap-4">
      {/* Search and Refresh */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-10"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => onSearchChange('')}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefetch}
          disabled={isFetching}
          className="shrink-0"
        >
          {isFetching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-2">
        {/* Transaction Type */}
        <Select
          value={typeFilter || ''}
          onValueChange={value =>
            onTypeFilterChange(
              (value || undefined) as 'INCOME' | 'EXPENSE' | 'TRANSFER' | undefined,
            )
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="INCOME">Income</SelectItem>
            <SelectItem value="EXPENSE">Expense</SelectItem>
            <SelectItem value="TRANSFER">Transfer</SelectItem>
          </SelectContent>
        </Select>

        {/* Account Filter */}
        <Select
          value={accountFilter || ''}
          onValueChange={value => onAccountFilterChange(value || undefined)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Account" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Accounts</SelectItem>
            {accounts.map(account => (
              <SelectItem key={account.id} value={account.id}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select
          value={categoryFilter || ''}
          onValueChange={value => onCategoryFilterChange(value || undefined)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Amount Range Filters */}
        <div className="flex gap-1 items-center">
          <Input
            type="number"
            placeholder="Min amount"
            value={minAmount || ''}
            onChange={e => onMinAmountChange(e.target.value ? Number(e.target.value) : undefined)}
            className="w-[120px]"
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="Max amount"
            value={maxAmount || ''}
            onChange={e => onMaxAmountChange(e.target.value ? Number(e.target.value) : undefined)}
            className="w-[120px]"
          />
        </div>

        {/* Limit Filter */}
        <Select
          value={limitFilter.toString()}
          onValueChange={value => onLimitFilterChange(Number(value))}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
            <SelectItem value="200">200</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
