'use client';

import { AccountForm } from '@/components/forms/AccountForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FinanceAccount } from '@/features/finance/queries/accounts';
import { AlertTriangle } from 'lucide-react';

interface AccountDialogsProps {
  showCreateDialog: boolean;
  showEditDialog: boolean;
  showDeleteDialog: boolean;
  selectedAccount: FinanceAccount | null;
  isDeleting: boolean;
  onCreateDialogChange: (open: boolean) => void;
  onEditDialogChange: (open: boolean) => void;
  onDeleteDialogChange: (open: boolean) => void;
  onFormSuccess: () => void;
  onCancelEdit: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}

export function AccountDialogs({
  showCreateDialog,
  showEditDialog,
  showDeleteDialog,
  selectedAccount,
  isDeleting,
  onCreateDialogChange,
  onEditDialogChange,
  onDeleteDialogChange,
  onFormSuccess,
  onCancelEdit,
  onCancelDelete,
  onConfirmDelete,
}: AccountDialogsProps) {
  const handleCreateCancel = () => {
    onCreateDialogChange(false);
  };

  return (
    <>
      <Dialog open={showCreateDialog} onOpenChange={onCreateDialogChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Account</DialogTitle>
            <DialogDescription>
              Add a new financial account to track your balance and transactions.
            </DialogDescription>
          </DialogHeader>
          <AccountForm onSuccess={onFormSuccess} onCancel={handleCreateCancel} />
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={onEditDialogChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>Update your account details and settings.</DialogDescription>
          </DialogHeader>
          <AccountForm
            account={selectedAccount || undefined}
            onSuccess={onFormSuccess}
            onCancel={onCancelEdit}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={onDeleteDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription className="space-y-2">
              <p>
                Are you sure you want to permanently delete "{selectedAccount?.name}"? This action
                cannot be undone.
              </p>
              {selectedAccount?._count?.transactions !== 0 && (
                <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Warning: This account has {selectedAccount?._count?.transactions}{' '}
                      transaction(s) associated with it. Deleting this account will also remove all
                      transaction history. Consider deactivating instead to preserve data.
                    </span>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancelDelete} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirmDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
