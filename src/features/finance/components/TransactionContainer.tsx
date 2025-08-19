import { TransactionTable } from './TransactionTable';
import { TransactionFilters } from './TransactionFilters';
import { useTransactionFilters } from '../hooks/useTransactionFilters';
import { usePagination } from '../hooks/usePagination';
import { useTransactions } from '../queries/transactions';

export function TransactionContainer() {
  const {
    filters,
    handleSearchChange,
    handleDateRangeChange,
    handleTypeFilterChange,
    handleAccountFilterChange,
    handleCategoryFilterChange,
    handleLimitFilterChange,
    handleMinAmountChange,
    handleMaxAmountChange,
  } = useTransactionFilters();

  // Pagination
  const { currentPage, pageSize, handlePageChange, handlePageSizeChange } = usePagination();

  // Fetch transactions with filters and pagination
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
    dateFrom: filters.dateRange?.from?.toISOString().split('T')[0],
    dateTo: filters.dateRange?.to?.toISOString().split('T')[0],
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
        dateRange={filters.dateRange}
        typeFilter={filters.typeFilter}
        accountFilter={filters.accountFilter}
        categoryFilter={filters.categoryFilter}
        limitFilter={filters.limitFilter}
        minAmount={filters.minAmount}
        maxAmount={filters.maxAmount}
        onSearchChange={handleSearchChange}
        onDateRangeChange={handleDateRangeChange}
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
        onEdit={() => {}}
        onDelete={() => {}}
      />
    </div>
  );
}
