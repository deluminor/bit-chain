'use client';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  TransactionFiltersState,
  createTransactionColumns,
  createTransactionFilterFields,
} from '@/features/finance/components/transaction-list/transaction-table.config';
import { Transaction } from '@/features/finance/queries/transactions';
import { Edit, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { useMemo } from 'react';

interface TransactionSummary {
  totalTransactions: number;
}

interface SelectOption {
  id: string;
  name: string;
}

interface TransactionTableSectionProps {
  transactions: Transaction[];
  isLoading: boolean;
  isFetching: boolean;
  currentPage: number;
  pageSize: number;
  totalPages: (totalItems: number) => number;
  summary: TransactionSummary;
  filters: TransactionFiltersState;
  accounts: SelectOption[];
  categories: SelectOption[];
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onTypeFilterChange: (value?: 'INCOME' | 'EXPENSE' | 'TRANSFER') => void;
  onAccountFilterChange: (value?: string) => void;
  onCategoryFilterChange: (value?: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: string) => void;
  onClearFilters: () => void;
  onRefresh: () => void;
  onCreateTransaction: () => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (transaction: Transaction) => void;
}

export function TransactionTableSection({
  transactions,
  isLoading,
  isFetching,
  currentPage,
  pageSize,
  totalPages,
  summary,
  filters,
  accounts,
  categories,
  hasActiveFilters,
  onSearchChange,
  onTypeFilterChange,
  onAccountFilterChange,
  onCategoryFilterChange,
  onPageChange,
  onPageSizeChange,
  onClearFilters,
  onRefresh,
  onCreateTransaction,
  onEditTransaction,
  onDeleteTransaction,
}: TransactionTableSectionProps) {
  const columns = useMemo(
    () => createTransactionColumns(filters.accountFilter),
    [filters.accountFilter],
  );

  const filterFields = useMemo(
    () =>
      createTransactionFilterFields({
        filters,
        accounts,
        categories,
        onSearchChange,
        onTypeFilterChange,
        onAccountFilterChange,
        onCategoryFilterChange,
      }),
    [
      accounts,
      categories,
      filters,
      onAccountFilterChange,
      onCategoryFilterChange,
      onSearchChange,
      onTypeFilterChange,
    ],
  );

  return (
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
      onClearFilters={onClearFilters}
      hasActiveFilters={hasActiveFilters}
      onRefresh={onRefresh}
      actions={transaction => (
        <div className="flex w-full justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEditTransaction(transaction)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDeleteTransaction(transaction)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
          <Button onClick={onCreateTransaction}>
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        )
      }
    />
  );
}
