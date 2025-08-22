'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Minus,
  ArrowRightLeft,
  MoreHorizontal,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Receipt,
  DollarSign,
  Calendar,
  Tag,
} from 'lucide-react';
import { AddTransactionForm } from '@/components/forms/AddTransactionForm';
import {
  useTransactions,
  useDeleteTransaction,
  Transaction,
  TransactionFilters,
} from '@/features/finance/queries/transactions';
import { useAccounts } from '@/features/finance/queries/accounts';
import {
  formatCurrency,
  formatSummaryAmount,
  currencyService,
  BASE_CURRENCY,
} from '@/lib/currency';
import { AnimatedDiv } from '@/components/ui/animations';
import {
  DataTable,
  TableFilters,
  DataTableColumn,
  FilterField,
  createSearchFilter,
  createSelectFilter,
} from '@/components/ui/data-table';
import { useDataTable } from '@/hooks/useDataTable';

const transactionTypeIcons = {
  INCOME: Plus,
  EXPENSE: Minus,
  TRANSFER: ArrowRightLeft,
};

const getTransactionTypeColor = (type: string) => {
  switch (type) {
    case 'INCOME':
      return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    case 'EXPENSE':
      return 'text-red-600 bg-red-100 dark:bg-red-900/20';
    case 'TRANSFER':
      return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
    default:
      return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
  }
};

const getAmountColor = (type: string) => {
  switch (type) {
    case 'INCOME':
      return 'text-green-600 dark:text-green-400';
    case 'EXPENSE':
      return 'text-red-600 dark:text-red-400';
    case 'TRANSFER':
      return 'text-blue-600 dark:text-blue-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

export function TransactionList() {
  const { toast } = useToast();
  const { data: accountsData } = useAccounts();
  const deleteTransaction = useDeleteTransaction();

  // Data table hooks
  const { currentPage, pageSize, onPageChange, onPageSizeChange, totalPages } = useDataTable({
    initialPageSize: 50,
  });

  // Filter states
  const [filters, setFilters] = useState<Partial<TransactionFilters>>({
    type: undefined,
    accountId: undefined,
    categoryId: undefined,
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Currency conversion states
  const [incomeEUR, setIncomeEUR] = useState(0);
  const [expensesEUR, setExpensesEUR] = useState(0);
  const [transfersEUR, setTransfersEUR] = useState(0);
  const [netIncomeEUR, setNetIncomeEUR] = useState(0);
  const [isConverting, setIsConverting] = useState(false);

  // Get transactions with current filters
  const {
    data: transactionsData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useTransactions({
    ...filters,
    search: searchTerm || undefined,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
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
      },
    [transactionsData?.summary],
  );

  const accounts = accountsData?.accounts || [];

  // Convert transaction amounts to EUR
  useEffect(() => {
    const convertAmounts = async () => {
      if (!summary) return;

      setIsConverting(true);
      try {
        const fallbackRates: Record<string, number> = {
          USD: 0.9,
          UAH: 0.025,
          GBP: 1.15,
          PLN: 0.23,
          CZK: 0.04,
          CHF: 1.05,
          CAD: 0.68,
          JPY: 0.0062,
        };

        let convertedIncome = 0;
        let convertedExpenses = 0;
        let convertedTransfers = 0;

        for (const transaction of transactions) {
          const currency = transaction.currency || transaction.account.currency;
          let amountInEUR = transaction.amount;

          if (currency !== BASE_CURRENCY) {
            try {
              amountInEUR = await currencyService.convertToBaseCurrency(
                transaction.amount,
                currency,
              );
            } catch {
              amountInEUR = transaction.amount * (fallbackRates[currency] || 1);
            }
          }

          if (transaction.type === 'INCOME') {
            convertedIncome += amountInEUR;
          } else if (transaction.type === 'EXPENSE') {
            convertedExpenses += amountInEUR;
          } else if (transaction.type === 'TRANSFER') {
            convertedTransfers += amountInEUR;
          }
        }

        setIncomeEUR(convertedIncome);
        setExpensesEUR(convertedExpenses);
        setTransfersEUR(convertedTransfers);
        setNetIncomeEUR(convertedIncome - convertedExpenses);
      } catch (error) {
        console.error('Failed to convert transaction amounts:', error);
        setIncomeEUR(summary.income);
        setExpensesEUR(summary.expenses);
        setTransfersEUR(summary.transfers);
        setNetIncomeEUR(summary.income - summary.expenses);
      } finally {
        setIsConverting(false);
      }
    };

    convertAmounts();
  }, [summary, transactions]);

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
    setFilters({
      type: undefined,
      accountId: undefined,
      categoryId: undefined,
    });
    setSearchTerm('');
    onPageChange(1);
  };

  const hasActiveFilters = filters.type || filters.accountId || filters.categoryId || searchTerm;

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
        return (
          <div className={`font-semibold ${amountColor}`}>
            {transaction.type === 'EXPENSE' && '-'}
            {transaction.type === 'INCOME' && '+'}
            {formatCurrency(
              transaction.amount,
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
    createSearchFilter('search', searchTerm, setSearchTerm, 'Search transactions...'),
    createSelectFilter(
      'type',
      filters.type,
      value =>
        setFilters(prev => ({
          ...prev,
          type: value === 'all' ? undefined : (value as 'INCOME' | 'EXPENSE' | 'TRANSFER'),
        })),
      [
        { value: 'INCOME', label: 'Income' },
        { value: 'EXPENSE', label: 'Expense' },
        { value: 'TRANSFER', label: 'Transfer' },
      ],
      'types',
    ),
    createSelectFilter(
      'account',
      filters.accountId,
      value => setFilters(prev => ({ ...prev, accountId: value === 'all' ? undefined : value })),
      accounts.map(account => ({ value: account.id, label: account.name })),
      'accounts',
    ),
  ];

  if (error) {
    return (
      <AnimatedDiv variant="slideUp" className="container mx-auto py-6">
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
        <Button onClick={() => setShowCreateDialog(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
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
              netIncomeEUR >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isConverting ? 'Converting...' : formatSummaryAmount(netIncomeEUR)}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">This period</p>
        </Card>

        <Card className="p-4 sm:p-5 lg:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="p-1.5 sm:p-2 bg-green-500/10 rounded-lg">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
            </div>
            <h3 className="font-medium sm:font-semibold text-sm sm:text-base">Income</h3>
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 text-green-600">
            {isConverting ? 'Converting...' : formatSummaryAmount(incomeEUR)}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {summary.incomeCount} transactions
          </p>
        </Card>

        <Card className="p-4 sm:p-5 lg:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="p-1.5 sm:p-2 bg-red-500/10 rounded-lg">
              <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
            </div>
            <h3 className="font-medium sm:font-semibold text-sm sm:text-base">Expenses</h3>
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 text-red-600">
            {isConverting ? 'Converting...' : formatSummaryAmount(expensesEUR)}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {summary.expenseCount} transactions
          </p>
        </Card>

        <Card className="p-4 sm:p-5 lg:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-lg">
              <ArrowRightLeft className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
            </div>
            <h3 className="font-medium sm:font-semibold text-sm sm:text-base">Transfers</h3>
          </div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 text-blue-600">
            {isConverting ? 'Converting...' : formatSummaryAmount(transfersEUR)}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {summary.transferCount} transactions
          </p>
        </Card>
      </div>

      {/* Filters */}
      <TableFilters
        fields={filterFields}
        onClearFilters={clearFilters}
        onRefresh={refetch}
        isFetching={isFetching}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Transactions Table */}
      <div className="overflow-x-auto">
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
          title={
            <>
              <Receipt className="h-5 w-5" />
              Recent Transactions
            </>
          }
          description={`Your transaction history ${hasActiveFilters ? '(filtered)' : ''}`}
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
      </div>

      {/* Create Transaction Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <AddTransactionForm
            onSuccess={handleFormSuccess}
            onCancel={() => setShowCreateDialog(false)}
          />
        </DialogContent>
      </Dialog>

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
