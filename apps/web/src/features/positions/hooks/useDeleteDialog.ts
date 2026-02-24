import { useState } from 'react';
import { Trade } from '../types/position';

export const useDeleteDialog = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState<Trade | null>(null);

  const onDelete = (trade: Trade) => () => {
    setPositionToDelete(trade);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    setPositionToDelete(null);
  };

  return {
    deleteDialogOpen,
    positionToDelete,
    setDeleteDialogOpen,
    setPositionToDelete,
    onDelete,
    handleDeleteConfirm,
  };
};
