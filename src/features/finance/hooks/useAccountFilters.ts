import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AccountFilters {
  searchTerm: string;
  typeFilter: 'CASH' | 'BANK_CARD' | 'SAVINGS' | 'INVESTMENT' | undefined;
  currencyFilter: string | undefined;
  statusFilter: 'active' | 'inactive' | undefined;
}

interface AccountFiltersState {
  filters: AccountFilters;
  handleSearchChange: (value: string) => void;
  handleTypeFilterChange: (value: AccountFilters['typeFilter'] | undefined) => void;
  handleCurrencyFilterChange: (value: string | undefined) => void;
  handleStatusFilterChange: (value: AccountFilters['statusFilter'] | undefined) => void;
  resetFilters: () => void;
}

export const useAccountFilters = create<AccountFiltersState>()(
  persist(
    set => ({
      filters: {
        searchTerm: '',
        typeFilter: undefined,
        currencyFilter: undefined,
        statusFilter: undefined,
      },
      handleSearchChange: value =>
        set(state => ({ filters: { ...state.filters, searchTerm: value } })),
      handleTypeFilterChange: value =>
        set(state => ({ filters: { ...state.filters, typeFilter: value } })),
      handleCurrencyFilterChange: value =>
        set(state => ({ filters: { ...state.filters, currencyFilter: value } })),
      handleStatusFilterChange: value =>
        set(state => ({ filters: { ...state.filters, statusFilter: value } })),
      resetFilters: () =>
        set({
          filters: {
            searchTerm: '',
            typeFilter: undefined,
            currencyFilter: undefined,
            statusFilter: undefined,
          },
        }),
    }),
    {
      name: 'account-filters',
    },
  ),
);
