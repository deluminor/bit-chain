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
  createCategoryColumns,
  createCategoryFilterFields,
} from '@/features/finance/components/categories-page/categories-table.config';
import { CategoryFilters, TransactionCategory } from '@/features/finance/queries/categories';
import { Edit, Eye, EyeOff, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { useMemo } from 'react';

interface CategoriesTableProps {
  categories: TransactionCategory[];
  filters: CategoryFilters;
  isLoading: boolean;
  isFetching: boolean;
  currentPage: number;
  pageSize: number;
  getTotalPages: (totalItems: number) => number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (value: string) => void;
  onFiltersChange: (filters: CategoryFilters) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  onRefresh: () => void;
  onCreateCategory: () => void;
  onEditCategory: (category: TransactionCategory) => void;
  onToggleActive: (category: TransactionCategory) => void;
  onDeleteCategory: (category: TransactionCategory) => void;
}

export function CategoriesTable({
  categories,
  filters,
  isLoading,
  isFetching,
  currentPage,
  pageSize,
  getTotalPages,
  onPageChange,
  onPageSizeChange,
  onFiltersChange,
  onClearFilters,
  hasActiveFilters,
  onRefresh,
  onCreateCategory,
  onEditCategory,
  onToggleActive,
  onDeleteCategory,
}: CategoriesTableProps) {
  const columns = useMemo(() => createCategoryColumns(), []);

  const filterFields = useMemo(
    () => createCategoryFilterFields(filters, onFiltersChange),
    [filters, onFiltersChange],
  );

  return (
    <DataTable
      data={categories}
      columns={columns}
      isLoading={isLoading}
      isFetching={isFetching}
      currentPage={currentPage}
      totalPages={getTotalPages(categories.length)}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      pageSizeOptions={[10, 25, 50, 100]}
      filterFields={filterFields}
      onClearFilters={onClearFilters}
      hasActiveFilters={hasActiveFilters}
      onRefresh={onRefresh}
      actions={category => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEditCategory(category)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleActive(category)}>
              {category.isActive ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Deactivate
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Activate
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDeleteCategory(category)}
              className="text-destructive"
              disabled={category.isDefault}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      emptyMessage={hasActiveFilters ? 'No categories match your filters' : 'No categories found'}
      emptyDescription={
        hasActiveFilters
          ? 'Try adjusting your filters'
          : 'Create your first category to get started'
      }
      emptyActions={
        !hasActiveFilters && (
          <Button onClick={onCreateCategory}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        )
      }
      showPagination={categories.length > 10}
    />
  );
}
