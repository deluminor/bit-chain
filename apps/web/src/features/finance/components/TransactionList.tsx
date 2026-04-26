'use client';

import { AnimatedDiv } from '@/components/ui/animations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TransactionDialogs } from '@/features/finance/components/transaction-list/TransactionDialogs';
import { TransactionListHeader } from '@/features/finance/components/transaction-list/TransactionListHeader';
import { TransactionSummaryCards } from '@/features/finance/components/transaction-list/TransactionSummaryCards';
import { TransactionTableSection } from '@/features/finance/components/transaction-list/TransactionTableSection';
import { useTransactionFilters } from '@/features/finance/hooks/useTransactionFilters';
import { useAccounts } from '@/features/finance/queries/accounts';
import { useCategories } from '@/features/finance/queries/categories';
import {
  Transaction,
  useDeleteTransaction,
  useTransactions,
} from '@/features/finance/queries/transactions';
import { useMonobankAutoSync } from '@/features/integrations/hooks/useMonobankAutoSync';
import { useToast } from '@/hooks/use-toast';
import { useDataTable } from '@/hooks/useDataTable';
import { useStore } from '@/store';
import { AlertTriangle } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

interface ApiErrorResponse {
  error?: string;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && 'response' in error) {
    const response = error.response;
    if (typeof response === 'object' && response !== null && 'data' in response) {
      const data = response.data;
      if (typeof data === 'object' && data !== null && 'error' in data) {
        return String((data as ApiErrorResponse).error ?? fallback);
      }
    }
  }

  return fallback;
}

export function TransactionList() {
  const { toast } = useToast();
  const { selectedDateRange } = useStore();
  const { data: accountsData } = useAccounts();
  const { data: categoriesData } = useCategories({ hierarchical: true });
  const deleteTransaction = useDeleteTransaction();

  useMonobankAutoSync('transactions_page');

  const { currentPage, pageSize, onPageChange, onPageSizeChange, totalPages } = useDataTable({
    initialPageSize: 50,
  });

  const {
    filters,
    handleSearchChange,
    handleTypeFilterChange,
    handleAccountFilterChange,
    handleCategoryFilterChange,
  } = useTransactionFilters();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    dateFrom: selectedDateRange?.from?.toISOString(),
    dateTo: selectedDateRange?.to?.toISOString(),
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

  const hasActiveFilters = Boolean(
    filters.typeFilter || filters.accountFilter || filters.categoryFilter || filters.searchTerm,
  );

  const accounts = accountsData?.accounts || [];
  const categories = categoriesData?.categories || [];

  const handleDeleteTransaction = async () => {
    if (!selectedTransaction) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteTransaction.mutateAsync(selectedTransaction.id);
      toast({ title: 'Success', description: 'Transaction deleted successfully' });
      setShowDeleteDialog(false);
      setSelectedTransaction(null);
      void refetch();
    } catch (mutationError) {
      toast({
        title: 'Error',
        description: getErrorMessage(mutationError, 'Failed to delete transaction'),
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    void refetch();
    setShowCreateDialog(false);
    setShowEditDialog(false);
    setSelectedTransaction(null);
  };

  const clearFilters = () => {
    handleSearchChange('');
    handleTypeFilterChange(undefined);
    handleAccountFilterChange(undefined);
    handleCategoryFilterChange(undefined);
    onPageChange(1);
  };

  const handleOpenImport = useCallback(() => {
    setShowImportDialog(true);
  }, []);

  const handleOpenCreate = useCallback(() => {
    setShowCreateDialog(true);
  }, []);

  const handleEditTransaction = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowEditDialog(true);
  }, []);

  const handleDeleteIntent = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDeleteDialog(true);
  }, []);

  if (error) {
    return (
      <AnimatedDiv variant="slideUp" className="container">
        <Card>
          <div className="py-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <p className="text-lg font-medium mb-2">Failed to load transactions</p>
            <p className="text-muted-foreground mb-4">
              There was an error loading your transactions.
            </p>
            <Button
              onClick={() => {
                void refetch();
              }}
            >
              Try Again
            </Button>
          </div>
        </Card>
      </AnimatedDiv>
    );
  }

  return (
    <AnimatedDiv variant="slideUp" className="flex flex-col gap-3 md:gap-4">
      <TransactionListHeader onOpenImport={handleOpenImport} onOpenCreate={handleOpenCreate} />

      <TransactionSummaryCards summary={summary} />

      <TransactionTableSection
        transactions={transactions}
        isLoading={isLoading}
        isFetching={isFetching}
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={totalPages}
        summary={summary}
        filters={filters}
        accounts={accounts}
        categories={categories}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={handleSearchChange}
        onTypeFilterChange={handleTypeFilterChange}
        onAccountFilterChange={handleAccountFilterChange}
        onCategoryFilterChange={handleCategoryFilterChange}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        onClearFilters={clearFilters}
        onRefresh={refetch}
        onCreateTransaction={handleOpenCreate}
        onEditTransaction={handleEditTransaction}
        onDeleteTransaction={handleDeleteIntent}
      />

      <TransactionDialogs
        showCreateDialog={showCreateDialog}
        showEditDialog={showEditDialog}
        showDeleteDialog={showDeleteDialog}
        showImportDialog={showImportDialog}
        selectedTransaction={selectedTransaction}
        isDeleting={isDeleting}
        onCreateDialogChange={setShowCreateDialog}
        onEditDialogChange={setShowEditDialog}
        onDeleteDialogChange={setShowDeleteDialog}
        onImportDialogChange={setShowImportDialog}
        onFormSuccess={handleFormSuccess}
        onCancelEdit={() => {
          setShowEditDialog(false);
          setSelectedTransaction(null);
        }}
        onCancelDelete={() => {
          setShowDeleteDialog(false);
          setSelectedTransaction(null);
        }}
        onConfirmDelete={() => {
          void handleDeleteTransaction();
        }}
      />
    </AnimatedDiv>
  );
}
