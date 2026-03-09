import { Badge } from '@/components/ui/badge';
import {
  DataTableColumn,
  FilterField,
  createSearchFilter,
  createSelectFilter,
} from '@/components/ui/data-table';
import {
  getAmountColor,
  getTransactionTypeColor,
  transactionTypeIcons,
} from '@/features/finance/components/transaction-list.config';
import { transactionCategorySwatchStyle } from '@/features/finance/components/transaction-list.styles';
import { Transaction } from '@/features/finance/queries/transactions';
import { formatCurrency } from '@/lib/currency';
import { Calendar, Tag } from 'lucide-react';

export interface TransactionFiltersState {
  typeFilter?: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  accountFilter?: string;
  categoryFilter?: string;
  searchTerm: string;
}

interface SelectOption {
  id: string;
  name: string;
}

interface CreateTransactionFilterFieldsParams {
  filters: TransactionFiltersState;
  accounts: SelectOption[];
  categories: SelectOption[];
  onSearchChange: (value: string) => void;
  onTypeFilterChange: (value?: 'INCOME' | 'EXPENSE' | 'TRANSFER') => void;
  onAccountFilterChange: (value?: string) => void;
  onCategoryFilterChange: (value?: string) => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });
}

export function createTransactionColumns(accountFilter?: string): DataTableColumn<Transaction>[] {
  return [
    {
      key: 'date',
      header: 'Date',
      cell: transaction => (
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{formatDate(transaction.date)}</span>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      cell: transaction => {
        const TypeIcon = transactionTypeIcons[transaction.type];
        const typeColor = getTransactionTypeColor(transaction.type);
        return (
          <div
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${typeColor}`}
          >
            <TypeIcon className="h-3 w-3" />
            {transaction.type.toLowerCase()}
          </div>
        );
      },
    },
    {
      key: 'description',
      header: 'Description',
      cell: transaction => (
        <div className="max-w-[200px]">
          <div className="font-medium truncate">{transaction.description || 'No description'}</div>
          {transaction.tags && transaction.tags.length > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <Tag className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {transaction.tags.slice(0, 2).join(', ')}
                {transaction.tags.length > 2 && ` +${transaction.tags.length - 2}`}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      cell: transaction =>
        transaction.category && (
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={transactionCategorySwatchStyle(transaction.category.color)}
            />
            <span className="text-sm truncate max-w-[100px]">{transaction.category.name}</span>
          </div>
        ),
    },
    {
      key: 'account',
      header: 'Account',
      cell: transaction => (
        <div className="text-sm">
          <div className="font-medium">{transaction.account.name}</div>
          <Badge variant="outline" className="text-xs mt-1">
            {transaction.currency || transaction.account.currency}
          </Badge>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      className: 'text-right',
      cell: transaction => {
        if (transaction.type === 'TRANSFER') {
          if (accountFilter) {
            const isReceived = transaction.transferToId === accountFilter;
            return (
              <div className={`font-semibold ${isReceived ? 'text-income' : 'text-transfer'}`}>
                {isReceived ? '+' : '-'}
                {formatCurrency(
                  isReceived
                    ? transaction.transferAmount || transaction.amount
                    : transaction.amount,
                  isReceived
                    ? transaction.transferCurrency ||
                        transaction.transferTo?.currency ||
                        transaction.currency
                    : transaction.currency || transaction.account.currency,
                  { useLargeNumberFormat: false },
                )}
              </div>
            );
          }

          const sourceCurrency = transaction.currency || transaction.account.currency;
          const targetCurrency =
            transaction.transferCurrency || transaction.transferTo?.currency || sourceCurrency;
          const isMultiCurrency = sourceCurrency !== targetCurrency;

          return (
            <div className="flex flex-col items-end">
              <div className="font-semibold text-transfer">
                {formatCurrency(transaction.amount, sourceCurrency, {
                  useLargeNumberFormat: false,
                })}
                {isMultiCurrency && <span className="text-muted-foreground ml-1">→</span>}
              </div>
              {isMultiCurrency && (
                <div className="text-xs text-income">
                  {formatCurrency(
                    transaction.transferAmount || transaction.amount,
                    targetCurrency,
                    {
                      useLargeNumberFormat: false,
                    },
                  )}
                </div>
              )}
            </div>
          );
        }

        const amountColor = getAmountColor(transaction.type);
        return (
          <div className={`font-semibold ${amountColor}`}>
            {transaction.type === 'EXPENSE' && '-'}
            {transaction.type === 'INCOME' && '+'}
            {formatCurrency(
              Math.abs(transaction.amount),
              transaction.currency || transaction.account.currency,
              {
                useLargeNumberFormat: false,
              },
            )}
          </div>
        );
      },
    },
  ];
}

export function createTransactionFilterFields({
  filters,
  accounts,
  categories,
  onSearchChange,
  onTypeFilterChange,
  onAccountFilterChange,
  onCategoryFilterChange,
}: CreateTransactionFilterFieldsParams): FilterField[] {
  return [
    createSearchFilter('search', filters.searchTerm, onSearchChange, 'Search transactions...'),
    createSelectFilter(
      'type',
      filters.typeFilter,
      value =>
        onTypeFilterChange(
          value === 'all' ? undefined : (value as 'INCOME' | 'EXPENSE' | 'TRANSFER'),
        ),
      [
        { value: 'INCOME', label: 'Income' },
        { value: 'EXPENSE', label: 'Expense' },
        { value: 'TRANSFER', label: 'Transfer' },
      ],
      'types',
    ),
    createSelectFilter(
      'account',
      filters.accountFilter,
      value => onAccountFilterChange(value === 'all' ? undefined : value),
      accounts.map(account => ({ value: account.id, label: account.name })),
      'accounts',
    ),
    createSelectFilter(
      'category',
      filters.categoryFilter,
      value => onCategoryFilterChange(value === 'all' ? undefined : value),
      categories.map(category => ({ value: category.id, label: category.name })),
      'categories',
    ),
  ];
}
