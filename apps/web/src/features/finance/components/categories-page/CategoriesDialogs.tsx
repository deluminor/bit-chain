'use client';

import { CategoryForm } from '@/components/forms/CategoryForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TransactionCategory } from '@/features/finance/queries/categories';

interface CategoriesDialogsProps {
  showCreateDialog: boolean;
  showEditDialog: boolean;
  showDeleteDialog: boolean;
  selectedCategory: TransactionCategory | null;
  isDeleting: boolean;
  onCreateDialogChange: (open: boolean) => void;
  onEditDialogChange: (open: boolean) => void;
  onDeleteDialogChange: (open: boolean) => void;
  onFormSuccess: () => void;
  onCancelEdit: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}

export function CategoriesDialogs({
  showCreateDialog,
  showEditDialog,
  showDeleteDialog,
  selectedCategory,
  isDeleting,
  onCreateDialogChange,
  onEditDialogChange,
  onDeleteDialogChange,
  onFormSuccess,
  onCancelEdit,
  onCancelDelete,
  onConfirmDelete,
}: CategoriesDialogsProps) {
  const handleCreateCancel = () => {
    onCreateDialogChange(false);
  };

  return (
    <>
      <Dialog open={showCreateDialog} onOpenChange={onCreateDialogChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
          </DialogHeader>
          <CategoryForm onSuccess={onFormSuccess} onCancel={handleCreateCancel} />
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={onEditDialogChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <CategoryForm
            category={selectedCategory || undefined}
            onSuccess={onFormSuccess}
            onCancel={onCancelEdit}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={onDeleteDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedCategory?.name}"? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancelDelete} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirmDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete Category'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
