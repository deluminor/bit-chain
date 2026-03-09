import { FilterField, createSearchFilter, createSelectFilter } from '@/components/ui/data-table';
import { AccountFilters } from '@/features/finance/hooks/useAccountFilters';

interface SelectOption {
  value: string;
  label: string;
}

interface CreateAccountFilterFieldsParams {
  filters: AccountFilters;
  uniqueCurrencies: SelectOption[];
  onSearchChange: (value: string) => void;
  onTypeFilterChange: (value?: AccountFilters['typeFilter']) => void;
  onCurrencyFilterChange: (value?: string) => void;
  onStatusFilterChange: (value?: 'active' | 'inactive') => void;
}

export function createAccountFilterFields({
  filters,
  uniqueCurrencies,
  onSearchChange,
  onTypeFilterChange,
  onCurrencyFilterChange,
  onStatusFilterChange,
}: CreateAccountFilterFieldsParams): FilterField[] {
  return [
    createSearchFilter('search', filters.searchTerm, onSearchChange, 'Search accounts...'),
    createSelectFilter(
      'type',
      filters.typeFilter,
      value =>
        onTypeFilterChange(value === 'all' ? undefined : (value as AccountFilters['typeFilter'])),
      [
        { value: 'CASH', label: 'Cash' },
        { value: 'BANK_CARD', label: 'Bank Card' },
        { value: 'SAVINGS', label: 'Savings' },
        { value: 'INVESTMENT', label: 'Investment' },
      ],
      'types',
    ),
    createSelectFilter(
      'currency',
      filters.currencyFilter,
      value => onCurrencyFilterChange(value === 'all' ? undefined : value),
      uniqueCurrencies,
      'currencies',
    ),
    createSelectFilter(
      'status',
      filters.statusFilter,
      value => onStatusFilterChange(value === 'all' ? undefined : (value as 'active' | 'inactive')),
      [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
      'status',
    ),
  ];
}
