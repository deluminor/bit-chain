import { useStore } from '@/store';
import { usePagination } from '../hooks/usePagination';
import { useTransactionFilters } from '../hooks/useTransactionFilters';
import { useTransactions } from '../queries/transactions';
import { TransactionFilters } from './TransactionFilters';
import { TransactionTable } from './TransactionTable';

export function TransactionContainer() {
  const { selectedDateRange } = useStore();

  const {
    filters,
    handleSearchChange,
    handleTypeFilterChange,
    handleAccountFilterChange,
    handleCategoryFilterChange,
    handleLimitFilterChange,
    handleMinAmountChange,
    handleMaxAmountChange,
  } = useTransactionFilters();

  const { currentPage, pageSize, handlePageChange, handlePageSizeChange } = usePagination();

  const {
    data: transactionsData,
    isLoading,
    isFetching,
    refetch,
  } = useTransactions({
    search: filters.searchTerm,
    type: filters.typeFilter,
    accountId: filters.accountFilter,
    categoryId: filters.categoryFilter,
    dateFrom: selectedDateRange?.from?.toISOString().split('T')[0],
    dateTo: selectedDateRange?.to?.toISOString().split('T')[0],
    minAmount: filters.minAmount,
    maxAmount: filters.maxAmount,
    page: currentPage,
    limit: pageSize,
  });

  const transactions = transactionsData?.transactions || [];
  const pagination = transactionsData?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
      </div>

      <TransactionFilters
        searchTerm={filters.searchTerm}
        typeFilter={filters.typeFilter}
        accountFilter={filters.accountFilter}
        categoryFilter={filters.categoryFilter}
        limitFilter={filters.limitFilter}
        minAmount={filters.minAmount}
        maxAmount={filters.maxAmount}
        onSearchChange={handleSearchChange}
        onTypeFilterChange={handleTypeFilterChange}
        onAccountFilterChange={handleAccountFilterChange}
        onCategoryFilterChange={handleCategoryFilterChange}
        onLimitFilterChange={handleLimitFilterChange}
        onMinAmountChange={handleMinAmountChange}
        onMaxAmountChange={handleMaxAmountChange}
        onRefetch={refetch}
        isFetching={isFetching}
      />

      <TransactionTable
        transactions={transactions}
        isLoading={isLoading}
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={pagination?.pages || 1}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
