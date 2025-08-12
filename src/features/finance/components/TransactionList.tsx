'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { TableLoadingBar } from '@/components/ui/table-loading-bar';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Minus,
  ArrowRightLeft,
  MoreHorizontal,
  Edit,
  Trash2,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  RefreshCw,
  Receipt,
  DollarSign,
  Calendar,
  Tag,
  X,
} from 'lucide-react';
import { AddTransactionForm } from '@/components/forms/AddTransactionForm';
import {
  useTransactions,
  useDeleteTransaction,
  Transaction,
  TransactionFilters,
} from '@/features/finance/queries/transactions';
import { useAccounts } from '@/features/finance/queries/accounts';
import { formatCurrency, formatSummaryAmount } from '@/lib/currency';
import { AnimatedDiv } from '@/components/ui/animations';

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

  // Filter states
  const [filters, setFilters] = useState<Partial<TransactionFilters>>({
    type: undefined,
    accountId: undefined,
    categoryId: undefined,
  });
  const [limit, setLimit] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get transactions with current filters
  const {
    data: transactionsData,
    isLoading,
    error,
    refetch,
  } = useTransactions({
    ...filters,
    search: searchTerm || undefined,
    limit,
  });

  const transactions = transactionsData?.transactions || [];
  const summary = transactionsData?.summary || {
    income: 0,
    expenses: 0,
    transfers: 0,
    totalTransactions: 0,
    incomeCount: 0,
    expenseCount: 0,
    transferCount: 0,
  };

  const accounts = accountsData?.accounts || [];

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
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to delete transaction',
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
    setLimit(50);
    setSearchTerm('');
  };

  const hasActiveFilters = filters.type || filters.accountId || filters.categoryId || searchTerm;

  if (error) {
    return (
      <AnimatedDiv variant="slideUp" className="container mx-auto py-6">
        <Card>
          <CardContent className="py-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <p className="text-lg font-medium mb-2">Failed to load transactions</p>
            <p className="text-muted-foreground mb-4">
              There was an error loading your transactions.
            </p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </CardContent>
        </Card>
      </AnimatedDiv>
    );
  }

  return (
    <AnimatedDiv variant="slideUp" className="flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary shadow-sm">
            <Receipt className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Transactions</h1>
            <p className="text-muted-foreground">Track your income, expenses, and transfers</p>
          </div>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <h3 className="font-semibold">Income</h3>
          </div>
          <div className="text-2xl font-bold mb-1 text-green-600">
            {formatSummaryAmount(summary.income)}
          </div>
          <p className="text-sm text-muted-foreground">{summary.incomeCount} transactions</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <TrendingDown className="h-5 w-5 text-red-500" />
            </div>
            <h3 className="font-semibold">Expenses</h3>
          </div>
          <div className="text-2xl font-bold mb-1 text-red-600">
            {formatSummaryAmount(summary.expenses)}
          </div>
          <p className="text-sm text-muted-foreground">{summary.expenseCount} transactions</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <ArrowRightLeft className="h-5 w-5 text-blue-500" />
            </div>
            <h3 className="font-semibold">Transfers</h3>
          </div>
          <div className="text-2xl font-bold mb-1 text-blue-600">
            {formatSummaryAmount(summary.transfers)}
          </div>
          <p className="text-sm text-muted-foreground">{summary.transferCount} transactions</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <DollarSign className="h-5 w-5 text-purple-500" />
            </div>
            <h3 className="font-semibold">Net Income</h3>
          </div>
          <div
            className={`text-2xl font-bold mb-1 ${summary.income - summary.expenses >= 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            {formatSummaryAmount(summary.income - summary.expenses)}
          </div>
          <p className="text-sm text-muted-foreground">This period</p>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
              <CardDescription>Filter and search your transactions</CardDescription>
            </div>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Type Filter */}
            <Select
              value={filters.type || 'all'}
              onValueChange={value =>
                setFilters(prev => ({
                  ...prev,
                  type: value === 'all' ? undefined : (value as any),
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="INCOME">Income</SelectItem>
                <SelectItem value="EXPENSE">Expense</SelectItem>
                <SelectItem value="TRANSFER">Transfer</SelectItem>
              </SelectContent>
            </Select>

            {/* Account Filter */}
            <Select
              value={filters.accountId || 'all'}
              onValueChange={value =>
                setFilters(prev => ({ ...prev, accountId: value === 'all' ? undefined : value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All accounts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All accounts</SelectItem>
                {accounts.map((account: any) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Limit */}
            <Select value={limit.toString()} onValueChange={value => setLimit(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25 transactions</SelectItem>
                <SelectItem value="50">50 transactions</SelectItem>
                <SelectItem value="100">100 transactions</SelectItem>
                <SelectItem value="200">200 transactions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Recent Transactions
              </CardTitle>
              <CardDescription>
                Your transaction history {hasActiveFilters && '(filtered)'}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative">
            <TableLoadingBar isLoading={isLoading} className="absolute top-0 left-0 right-0 z-10" />

            {transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="sticky top-0 z-10">
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading
                      ? // Skeleton loader rows
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={`skeleton-${index}`}>
                            <TableCell>
                              <Skeleton className="h-4 w-16" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-20 rounded-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-40" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-28" />
                            </TableCell>
                            <TableCell className="text-right">
                              <Skeleton className="h-4 w-20 ml-auto" />
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Skeleton className="h-8 w-8" />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      : transactions.map(transaction => {
                          const TypeIcon = transactionTypeIcons[transaction.type];
                          const typeColor = getTransactionTypeColor(transaction.type);
                          const amountColor = getAmountColor(transaction.type);

                          return (
                            <TableRow key={transaction.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-sm">{formatDate(transaction.date)}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div
                                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${typeColor}`}
                                >
                                  <TypeIcon className="h-3 w-3" />
                                  {transaction.type.toLowerCase()}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="max-w-[200px]">
                                  <div className="font-medium truncate">
                                    {transaction.description || 'No description'}
                                  </div>
                                  {transaction.tags && transaction.tags.length > 0 && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <Tag className="h-3 w-3 text-muted-foreground" />
                                      <span className="text-xs text-muted-foreground">
                                        {transaction.tags.slice(0, 2).join(', ')}
                                        {transaction.tags.length > 2 &&
                                          ` +${transaction.tags.length - 2}`}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                {transaction.category && (
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-3 h-3 rounded-full flex-shrink-0"
                                      style={{ backgroundColor: transaction.category.color }}
                                    />
                                    <span className="text-sm truncate max-w-[100px]">
                                      {transaction.category.name}
                                    </span>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div className="font-medium">{transaction.account.name}</div>
                                  <Badge variant="outline" className="text-xs mt-1">
                                    {transaction.currency || transaction.account.currency}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className={`font-semibold ${amountColor}`}>
                                  {transaction.type === 'EXPENSE' && '-'}
                                  {transaction.type === 'INCOME' && '+'}
                                  {formatCurrency(
                                    transaction.amount,
                                    transaction.currency || transaction.account.currency,
                                    {
                                      useLargeNumberFormat: false,
                                    },
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
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
                              </TableCell>
                            </TableRow>
                          );
                        })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">
                  {hasActiveFilters
                    ? 'No transactions match your filters'
                    : 'No transactions found'}
                </p>
                <p className="text-muted-foreground mb-4">
                  {hasActiveFilters
                    ? 'Try adjusting your filters or search terms'
                    : 'Create your first transaction to get started'}
                </p>
                {!hasActiveFilters && (
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Transaction
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Transaction Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
            <DialogDescription>
              Record a new income, expense, or transfer transaction.
            </DialogDescription>
          </DialogHeader>
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
