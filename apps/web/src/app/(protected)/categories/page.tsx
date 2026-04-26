'use client';

import { AnimatedDiv } from '@/components/ui/animations';
import { Button } from '@/components/ui/button';
import { CategoriesDialogs } from '@/features/finance/components/categories-page/CategoriesDialogs';
import { CategoriesPageHeader } from '@/features/finance/components/categories-page/CategoriesPageHeader';
import { CategoriesStatsCards } from '@/features/finance/components/categories-page/CategoriesStatsCards';
import { CategoriesTable } from '@/features/finance/components/categories-page/CategoriesTable';
import {
  CategoryFilters,
  TransactionCategory,
  useCategories,
  useDeleteCategory,
  useUpdateCategory,
} from '@/features/finance/queries/categories';
import { useDataTable } from '@/hooks/useDataTable';
import { AlertTriangle } from 'lucide-react';
import { useCallback, useState } from 'react';

export default function CategoriesPage() {
  const { currentPage, pageSize, onPageChange, onPageSizeChange, totalPages } = useDataTable({
    initialPageSize: 25,
  });

  const [filters, setFilters] = useState<CategoryFilters>({
    type: undefined,
    includeInactive: false,
    hierarchical: false,
  });

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: categoriesData, isLoading, error, refetch, isFetching } = useCategories(filters);
  const deleteCategory = useDeleteCategory();
  const updateCategory = useUpdateCategory();

  const categories = categoriesData?.categories || [];
  const counts = categoriesData?.counts || {
    income: 0,
    expense: 0,
    parents: 0,
    children: 0,
  };

  const handleDeleteCategory = useCallback(async () => {
    if (!selectedCategory) return;

    setIsDeleting(true);

    try {
      await deleteCategory.mutateAsync(selectedCategory.id);
      setShowDeleteDialog(false);
      setSelectedCategory(null);
    } catch {
      // Mutation handles notification
    } finally {
      setIsDeleting(false);
    }
  }, [selectedCategory, deleteCategory]);

  const handleToggleActive = useCallback(
    async (category: TransactionCategory) => {
      try {
        await updateCategory.mutateAsync({
          id: category.id,
          isActive: !category.isActive,
        });
      } catch {
        // Mutation handles notification
      }
    },
    [updateCategory],
  );

  const handleFormSuccess = useCallback(() => {
    setShowCreateDialog(false);
    setShowEditDialog(false);
    setSelectedCategory(null);
  }, []);

  const handleOpenCreate = useCallback(() => {
    setShowCreateDialog(true);
  }, []);

  const handleEditCategory = useCallback((category: TransactionCategory) => {
    setSelectedCategory(category);
    setShowEditDialog(true);
  }, []);

  const handleDeleteIntent = useCallback((category: TransactionCategory) => {
    setSelectedCategory(category);
    setShowDeleteDialog(true);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setShowEditDialog(false);
    setSelectedCategory(null);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteDialog(false);
    setSelectedCategory(null);
  }, []);

  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  const clearFilters = () => {
    setFilters({
      type: undefined,
      includeInactive: false,
      hierarchical: false,
    });
    onPageChange(1);
  };

  const hasActiveFilters = !!filters.type || !!filters.includeInactive;

  if (error) {
    return (
      <AnimatedDiv variant="slideUp" className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <p className="text-lg font-medium mb-2">Failed to load categories</p>
            <p className="text-muted-foreground mb-4">
              There was an error loading your categories.
            </p>
            <Button onClick={handleRefetch}>Try Again</Button>
          </div>
        </div>
      </AnimatedDiv>
    );
  }

  return (
    <AnimatedDiv variant="slideUp" className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="flex flex-col gap-3 md:gap-6">
          <CategoriesPageHeader onCreateCategory={handleOpenCreate} />

          <CategoriesStatsCards counts={counts} />

          <CategoriesTable
            categories={categories}
            filters={filters}
            isLoading={isLoading}
            isFetching={isFetching}
            currentPage={currentPage}
            pageSize={pageSize}
            getTotalPages={totalPages}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
            onRefresh={handleRefetch}
            onCreateCategory={handleOpenCreate}
            onEditCategory={handleEditCategory}
            onToggleActive={handleToggleActive}
            onDeleteCategory={handleDeleteIntent}
          />

          <CategoriesDialogs
            showCreateDialog={showCreateDialog}
            showEditDialog={showEditDialog}
            showDeleteDialog={showDeleteDialog}
            selectedCategory={selectedCategory}
            isDeleting={isDeleting}
            onCreateDialogChange={setShowCreateDialog}
            onEditDialogChange={setShowEditDialog}
            onDeleteDialogChange={setShowDeleteDialog}
            onFormSuccess={handleFormSuccess}
            onCancelEdit={handleCancelEdit}
            onCancelDelete={handleCancelDelete}
            onConfirmDelete={handleDeleteCategory}
          />
        </div>
      </div>
    </AnimatedDiv>
  );
}
