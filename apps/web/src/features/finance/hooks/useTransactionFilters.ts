import { useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export interface TransactionFilters {
  searchTerm: string;
  typeFilter?: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  accountFilter?: string;
  categoryFilter?: string;
  limitFilter: number;
  minAmount?: number;
  maxAmount?: number;
}

export function useTransactionFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize filters from URL params (date range is now global)
  const [filters, setFilters] = useState<TransactionFilters>(() => {
    const searchTerm = searchParams.get('search') || '';
    const typeFilter = searchParams.get('type') as 'INCOME' | 'EXPENSE' | 'TRANSFER' | undefined;
    const accountFilter = searchParams.get('account') || undefined;
    const categoryFilter = searchParams.get('category') || undefined;
    const limitFilter = parseInt(searchParams.get('limit') || '50', 10);
    const minAmount = searchParams.get('minAmount')
      ? parseFloat(searchParams.get('minAmount')!)
      : undefined;
    const maxAmount = searchParams.get('maxAmount')
      ? parseFloat(searchParams.get('maxAmount')!)
      : undefined;

    return {
      searchTerm,
      typeFilter,
      accountFilter,
      categoryFilter,
      limitFilter,
      minAmount,
      maxAmount,
    };
  });

  const updateUrlParams = useCallback(
    (newFilters: TransactionFilters) => {
      const params = new URLSearchParams();

      if (newFilters.searchTerm) {
        params.set('search', newFilters.searchTerm);
      }

      if (newFilters.typeFilter) {
        params.set('type', newFilters.typeFilter);
      }

      if (newFilters.accountFilter) {
        params.set('account', newFilters.accountFilter);
      }

      if (newFilters.categoryFilter) {
        params.set('category', newFilters.categoryFilter);
      }

      if (newFilters.limitFilter !== 50) {
        params.set('limit', newFilters.limitFilter.toString());
      }

      if (newFilters.minAmount !== undefined && newFilters.minAmount !== null) {
        params.set('minAmount', newFilters.minAmount.toString());
      }

      if (newFilters.maxAmount !== undefined && newFilters.maxAmount !== null) {
        params.set('maxAmount', newFilters.maxAmount.toString());
      }

      router.push(`?${params.toString()}`);
    },
    [router],
  );

  const updateFilters = useCallback(
    (newFilters: Partial<TransactionFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      updateUrlParams(updatedFilters);
    },
    [filters, updateUrlParams],
  );

  const handleSearchChange = useCallback(
    (searchTerm: string) => {
      updateFilters({ searchTerm });
    },
    [updateFilters],
  );

  const handleTypeFilterChange = useCallback(
    (typeFilter?: 'INCOME' | 'EXPENSE' | 'TRANSFER') => {
      updateFilters({ typeFilter });
    },
    [updateFilters],
  );

  const handleAccountFilterChange = useCallback(
    (accountFilter?: string) => {
      updateFilters({ accountFilter });
    },
    [updateFilters],
  );

  const handleCategoryFilterChange = useCallback(
    (categoryFilter?: string) => {
      updateFilters({ categoryFilter });
    },
    [updateFilters],
  );

  const handleLimitFilterChange = useCallback(
    (limitFilter: number) => {
      updateFilters({ limitFilter });
    },
    [updateFilters],
  );

  const handleMinAmountChange = useCallback(
    (minAmount?: number) => {
      updateFilters({ minAmount });
    },
    [updateFilters],
  );

  const handleMaxAmountChange = useCallback(
    (maxAmount?: number) => {
      updateFilters({ maxAmount });
    },
    [updateFilters],
  );

  return {
    filters,
    handleSearchChange,
    handleTypeFilterChange,
    handleAccountFilterChange,
    handleCategoryFilterChange,
    handleLimitFilterChange,
    handleMinAmountChange,
    handleMaxAmountChange,
  };
}
