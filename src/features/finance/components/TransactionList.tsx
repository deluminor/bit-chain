'use client';

import { AddTransactionForm } from '@/components/forms/AddTransactionForm';
import { AnimatedDiv } from '@/components/ui/animations';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DataTable,
  DataTableColumn,
  FilterField,
  createDateRangeFilter,
  createSearchFilter,
  createSelectFilter,
} from '@/components/ui/data-table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TransactionImportDialog } from '@/features/finance/components/TransactionImportDialog';
import { useTransactionFilters } from '@/features/finance/hooks/useTransactionFilters';
import { useAccounts } from '@/features/finance/queries/accounts';
import {
  Transaction,
  useDeleteTransaction,
  useTransactions,
} from '@/features/finance/queries/transactions';
import { useMonobankAutoSync } from '@/features/integrations/hooks/useMonobankAutoSync';
import { useToast } from '@/hooks/use-toast';
import { useDataTable } from '@/hooks/useDataTable';
import { formatCurrency, formatSummaryAmount } from '@/lib/currency';
import {
  AlertTriangle,
  ArrowRightLeft,
  Calendar,
  DollarSign,
  Edit,
  Minus,
  MoreHorizontal,
  Plus,
  Receipt,
  Tag,
  Trash2,
  TrendingDown,
  TrendingUp,
  Upload,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const transactionTypeIcons = {
  INCOME: Plus,
  EXPENSE: Minus,
  TRANSFER: ArrowRightLeft,
};

const getTransactionTypeColor = (type: string) => {
  switch (type) {
    case 'INCOME':
      return 'text-income bg-income/10';
    case 'EXPENSE':
      return 'text-expense bg-expense/10';
    case 'TRANSFER':
      return 'text-transfer bg-transfer/10';
    default:
      return 'text-muted-foreground bg-muted';
  }
};

const getAmountColor = (type: string) => {
  switch (type) {
    case 'INCOME':
      return 'text-income';
    case 'EXPENSE':
      return 'text-expense';
    case 'TRANSFER':
      return 'text-transfer';
    default:
      return 'text-muted-foreground';
  }
};

export function TransactionList() {
  const { toast } = useToast();
  const { data: accountsData } = useAccounts();
  const deleteTransaction = useDeleteTransaction();
  useMonobankAutoSync('transactions_page');

  // Data table hooks
  const { currentPage, pageSize, onPageChange, onPageSizeChange, totalPages } = useDataTable({
    initialPageSize: 50,
  });

  // Filter states
  const {
    filters,
    handleSearchChange,
    handleTypeFilterChange,
    handleAccountFilterChange,
    handleDateRangeChange,
  } = useTransactionFilters();

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get transactions with current filters
  const {
    data: transactionsData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useTransactions({
    type: filters.typeFilter,
    accountId: filters.accountFilter,
    categoryId: filters.categoryFilter,
    search: filters.searchTerm || undefined,
    dateFrom: filters.dateRange?.from?.toISOString(),
    dateTo: filters.dateRange?.to?.toISOString(),
    limit: pageSize,
    page: currentPage,
  });

  const transactions = useMemo(
    () => transactionsData?.transactions || [],
    [transactionsData?.transactions],
  );
  const summary = useMemo(
    () =>
      transactionsData?.summary || {
        income: 0,
        expenses: 0,
        transfers: 0,
        totalTransactions: 0,
        incomeCount: 0,
        expenseCount: 0,
        transferCount: 0,
        maxIncome: 0,
        maxExpense: 0,
      },
    [transactionsData?.summary],
  );

  const accounts = accountsData?.accounts || [];

  const incomeEUR = summary.income;
  const expensesEUR = summary.expenses;
  const transfersEUR = summary.transfers;
  const netIncomeEUR = summary.income - summary.expenses;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  const handleDeleteTransaction = async () => {
    if (!selectedTransaction) return;

    setIsDeleting(true);
    try {
      await deleteTransaction.mutateAsync(selectedTransaction.id);
      toast({
        title: 'Success',
        description: 'Transaction deleted successfully',
      });
      setShowDeleteDialog(false);
      setSelectedTransaction(null);
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error &&
          'response' in error &&
          error.response &&
          typeof error.response === 'object' &&
          'data' in error.response &&
          error.response.data &&
          typeof error.response.data === 'object' &&
          'error' in error.response.data
            ? String(error.response.data.error)
            : 'Failed to delete transaction',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    refetch();
    setShowCreateDialog(false);
    setShowEditDialog(false);
    setSelectedTransaction(null);
  };

  const clearFilters = () => {
    handleSearchChange('');
    handleTypeFilterChange(undefined);
    handleAccountFilterChange(undefined);
    handleDateRangeChange(undefined);
    onPageChange(1);
  };

  const hasActiveFilters = Boolean(
    filters.typeFilter ||
      filters.accountFilter ||
      filters.categoryFilter ||
      filters.searchTerm ||
      filters.dateRange,
  );

  // Define table columns
  const columns: DataTableColumn<Transaction>[] = [
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
              style={{ backgroundColor: transaction.category.color }}
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
        const amountColor = getAmountColor(transaction.type);

        // For transfers, handle display based on filter context
        if (transaction.type === 'TRANSFER') {
          // Case 1: Viewing a specific account
          if (filters.accountFilter) {
            const isReceived = transaction.transferToId === filters.accountFilter;

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

          // Case 2: Viewing all transactions (Global view)
          // Show as "Amount -> Amount" if currencies differ, or just "Amount" if same
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
                    { useLargeNumberFormat: false },
                  )}
                </div>
              )}
            </div>
          );
        }

        return (
          <div className={`font-semibold ${amountColor}`}>
            {transaction.type === 'EXPENSE' && '-'}
            {transaction.type === 'INCOME' && '+'}
            {formatCurrency(
              Math.abs(transaction.amount),
              transaction.currency || transaction.account.currency,
              { useLargeNumberFormat: false },
            )}
          </div>
        );
      },
    },
  ];

  // Define filter fields
  const filterFields: FilterField[] = [
    createDateRangeFilter('date', filters.dateRange, handleDateRangeChange, 'Select date range'),
    createSearchFilter('search', filters.searchTerm, handleSearchChange, 'Search transactions...'),
    createSelectFilter(
      'type',
      filters.typeFilter,
      value =>
        handleTypeFilterChange(
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
      value => handleAccountFilterChange(value === 'all' ? undefined : value),
      accounts.map((account: { id: string; name: string }) => ({
        value: account.id,
        label: account.name,
      })),
      'accounts',
    ),
  ];

  if (error) {
    return (
      <AnimatedDiv variant="slideUp" className="container ">
        <Card>
          <div className="py-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <p className="text-lg font-medium mb-2">Failed to load transactions</p>
            <p className="text-muted-foreground mb-4">
              There was an error loading your transactions.
            </p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </Card>
      </AnimatedDiv>
    );
  }

  return (
    <AnimatedDiv variant="slideUp" className="flex flex-col gap-3 md:gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-3 rounded-xl bg-primary shadow-sm">
            <Receipt className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Transactions</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Track your income, expenses, and transfers
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={() => setShowImportDialog(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-5 lg:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="p-1.5 sm:p-2 bg-purple-500/10 rounded-lg">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
            </div>
            <h3 className="font-medium sm:font-semibold text-sm sm:text-base">Net Income</h3>
          </div>
          <div
            className={`text-lg sm:text-xl lg:text-2xl font-bold mb-1 ${
              netIncomeEUR >= 0 ? 'text-income' : 'text-expense'
            }`}
          >
            {formatSummaryAmount(netIncomeEUR)}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">This period</p>
        </Card>

        <Card className="p-4 sm:p-5 lg:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="p-1.5 sm:p-2 bg-income/10 rounded-lg">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-income" />
            </div>
            <h3 className="font-medium sm:font-semibold text-sm sm:text-base">Income</h3>
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 text-income">
            {formatSummaryAmount(incomeEUR)}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {summary.incomeCount} transactions
          </p>
        </Card>

        <Card className="p-4 sm:p-5 lg:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="p-1.5 sm:p-2 bg-expense/10 rounded-lg">
              <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-expense" />
            </div>
            <h3 className="font-medium sm:font-semibold text-sm sm:text-base">Expenses</h3>
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 text-expense">
            {formatSummaryAmount(expensesEUR)}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {summary.expenseCount} transactions
          </p>
        </Card>

        <Card className="p-4 sm:p-5 lg:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="p-1.5 sm:p-2 bg-transfer/10 rounded-lg">
              <ArrowRightLeft className="h-4 w-4 sm:h-5 sm:w-5 text-transfer" />
            </div>
            <h3 className="font-medium sm:font-semibold text-sm sm:text-base">Transfers</h3>
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 text-transfer">
            {formatSummaryAmount(transfersEUR)}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {summary.transferCount} transactions
          </p>
        </Card>
      </div>

      {/* Transactions Table */}
      <DataTable
        data={transactions}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        currentPage={currentPage}
        totalPages={totalPages(summary.totalTransactions)}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        filterFields={filterFields}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        onRefresh={refetch}
        actions={transaction => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedTransaction(transaction);
                  setShowEditDialog(true);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedTransaction(transaction);
                  setShowDeleteDialog(true);
                }}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        emptyMessage={
          hasActiveFilters ? 'No transactions match your filters' : 'No transactions found'
        }
        emptyDescription={
          hasActiveFilters
            ? 'Try adjusting your filters or search terms'
            : 'Create your first transaction to get started'
        }
        emptyActions={
          !hasActiveFilters && (
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          )
        }
      />

      {/* Create Transaction Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <AddTransactionForm
            onSuccess={handleFormSuccess}
            onCancel={() => setShowCreateDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <TransactionImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onSuccess={handleFormSuccess}
      />

      {/* Edit Transaction Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>Update transaction details.</DialogDescription>
          </DialogHeader>
          <AddTransactionForm
            transaction={selectedTransaction || undefined}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowEditDialog(false);
              setSelectedTransaction(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Transaction Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Transaction</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setSelectedTransaction(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTransaction} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete Transaction'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AnimatedDiv>
  );
}
