'use client';

import { Button } from '@/components/ui/button';
import { PlusIcon, TagIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useDeleteDialog } from '../hooks/useDeleteDialog';
import { usePagination } from '../hooks/usePagination';
import { useTradeData } from '../hooks/useTradeData';
import { useTradeFilters } from '../hooks/useTradeFilters';
import { Trade } from '../types/position';
import { CategoryModal } from './CategoryModal';
import { DeletePositionDialog } from './DeletePositionDialog';
import { PositionFilters } from './PositionFilters';
import { PositionModal } from './PositionModal';
import { PositionStats } from './PositionStats';
import { PositionTable } from './PositionTable';

export default function PositionsContainer() {
  const searchParams = useSearchParams();

  const {
    sideFilter,
    categoryFilter,
    resultFilter,
    handleSideFilterChange,
    handleCategoryFilterChange,
    handleResultFilterChange,
  } = useTradeFilters();

  const {
    filteredTrades,
    handleCreatePosition: handleCreateTrade,
    handleEditPosition: handleEditTrade,
    handleDeletePosition: handleDeleteTrade,
    refetch,
    isLoading,
    isFetching,
  } = useTradeData({
    sideFilter,
    categoryFilter,
    resultFilter,
  });

  const {
    deleteDialogOpen,
    positionToDelete,
    setDeleteDialogOpen,
    setPositionToDelete,
    onDelete,
    handleDeleteConfirm,
  } = useDeleteDialog();

  const {
    currentPage,
    pageSize,
    totalPages,
    paginatedTrades,
    handlePageChange,
    handlePageSizeChange,
  } = usePagination(filteredTrades, searchParams);

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeletePosition = async (id: string) => {
    setIsDeleting(true);
    try {
      await handleDeleteTrade(id);
      handleDeleteConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  const onCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setPositionToDelete(null);
  };

  const handleEditPosition = async (position: Partial<Trade>) => {
    await handleEditTrade(position);
  };

  const handleCreatePosition = async (position: Trade) => {
    await handleCreateTrade(position);
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6 px-4 lg:px-6">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center flex-col sm:flex-row gap-2 sm:gap-0">
          <p className="text-muted-foreground mb-2 sm:mb-0">
            Manage and analyze your trading history
          </p>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <CategoryModal>
              <Button variant="outline">
                <TagIcon className="h-4 w-4" />
                Manage Categories
              </Button>
            </CategoryModal>
            <PositionModal onSave={handleCreatePosition}>
              <Button>
                <PlusIcon className="h-4 w-4" />
                Add Position
              </Button>
            </PositionModal>
          </div>
        </div>
      </div>

      <PositionStats trades={filteredTrades} />

      <div className="shadow">
        <div className="p-4 bg-card border-b flex flex-col md:flex-row gap-4 justify-between items-start md:items-center rounded-t-lg">
          <PositionFilters
            sideFilter={sideFilter}
            categoryFilter={categoryFilter}
            resultFilter={resultFilter}
            onSideFilterChange={handleSideFilterChange}
            onCategoryFilterChange={handleCategoryFilterChange}
            onResultFilterChange={handleResultFilterChange}
            onRefetch={refetch}
            isFetching={isFetching}
          />
        </div>

        <div className="bg-card rounded-b-lg overflow-hidden">
          <PositionTable
            trades={paginatedTrades}
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onEdit={handleEditPosition}
            onDelete={onDelete}
            isLoading={isLoading}
            isFetching={isFetching}
          />
        </div>
      </div>

      {positionToDelete && (
        <DeletePositionDialog
          isOpen={deleteDialogOpen}
          onClose={onCloseDeleteDialog}
          onConfirm={() => handleDeletePosition(positionToDelete.id)}
          positionSymbol={positionToDelete.symbol}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
