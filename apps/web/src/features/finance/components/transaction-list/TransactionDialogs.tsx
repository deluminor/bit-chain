'use client';

import { AddTransactionForm } from '@/components/forms/AddTransactionForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TransactionImportDialog } from '@/features/finance/components/TransactionImportDialog';
import { Transaction } from '@/features/finance/queries/transactions';

interface TransactionDialogsProps {
  showCreateDialog: boolean;
  showEditDialog: boolean;
  showDeleteDialog: boolean;
  showImportDialog: boolean;
  selectedTransaction: Transaction | null;
  isDeleting: boolean;
  onCreateDialogChange: (open: boolean) => void;
  onEditDialogChange: (open: boolean) => void;
  onDeleteDialogChange: (open: boolean) => void;
  onImportDialogChange: (open: boolean) => void;
  onFormSuccess: () => void;
  onCancelEdit: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}

export function TransactionDialogs({
  showCreateDialog,
  showEditDialog,
  showDeleteDialog,
  showImportDialog,
  selectedTransaction,
  isDeleting,
  onCreateDialogChange,
  onEditDialogChange,
  onDeleteDialogChange,
  onImportDialogChange,
  onFormSuccess,
  onCancelEdit,
  onCancelDelete,
  onConfirmDelete,
}: TransactionDialogsProps) {
  return (
    <>
      <Dialog open={showCreateDialog} onOpenChange={onCreateDialogChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <AddTransactionForm
            onSuccess={onFormSuccess}
            onCancel={() => onCreateDialogChange(false)}
          />
        </DialogContent>
      </Dialog>

      <TransactionImportDialog
        open={showImportDialog}
        onOpenChange={onImportDialogChange}
        onSuccess={onFormSuccess}
      />

      <Dialog open={showEditDialog} onOpenChange={onEditDialogChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>Update transaction details.</DialogDescription>
          </DialogHeader>
          <AddTransactionForm
            transaction={selectedTransaction || undefined}
            onSuccess={onFormSuccess}
            onCancel={onCancelEdit}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={onDeleteDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Transaction</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancelDelete} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirmDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete Transaction'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
