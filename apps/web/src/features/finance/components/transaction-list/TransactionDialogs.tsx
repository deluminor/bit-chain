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
  const handleCreateCancel = () => {
    onCreateDialogChange(false);
  };

  return (
    <>
      <Dialog open={showCreateDialog} onOpenChange={onCreateDialogChange}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto sm:max-w-2xl">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle>Add new transaction</DialogTitle>
            <DialogDescription>Record your income, expense, or transfer.</DialogDescription>
          </DialogHeader>
          <div className="pt-1">
            <AddTransactionForm onSuccess={onFormSuccess} onCancel={handleCreateCancel} />
          </div>
        </DialogContent>
      </Dialog>

      <TransactionImportDialog
        open={showImportDialog}
        onOpenChange={onImportDialogChange}
        onSuccess={onFormSuccess}
      />

      <Dialog open={showEditDialog} onOpenChange={onEditDialogChange}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto sm:max-w-2xl">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle>Edit transaction</DialogTitle>
            <DialogDescription>Update the details below.</DialogDescription>
          </DialogHeader>
          <div className="pt-1">
            <AddTransactionForm
              transaction={selectedTransaction || undefined}
              onSuccess={onFormSuccess}
              onCancel={onCancelEdit}
            />
          </div>
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
