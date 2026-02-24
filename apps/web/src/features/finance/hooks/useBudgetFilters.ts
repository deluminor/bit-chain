import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BudgetFilters {
  searchTerm: string;
  statusFilter: 'active' | 'inactive' | undefined;
}

interface BudgetFiltersState {
  filters: BudgetFilters;
  handleSearchChange: (value: string) => void;
  handleStatusFilterChange: (value: BudgetFilters['statusFilter'] | undefined) => void;
  resetFilters: () => void;
}

export const useBudgetFilters = create<BudgetFiltersState>()(
  persist(
    set => ({
      filters: {
        searchTerm: '',
        statusFilter: undefined,
      },
      handleSearchChange: value =>
        set(state => ({ filters: { ...state.filters, searchTerm: value } })),
      handleStatusFilterChange: value =>
        set(state => ({ filters: { ...state.filters, statusFilter: value } })),
      resetFilters: () =>
        set({
          filters: {
            searchTerm: '',
            statusFilter: undefined,
          },
        }),
    }),
    {
      name: 'budget-filters',
    },
  ),
);
