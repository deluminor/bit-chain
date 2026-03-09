'use client';

import { LoanForm } from '@/components/forms/LoanForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RepayLoanDialog } from '@/features/finance/components/RepayLoanDialog';
import { Loan } from '@/features/finance/queries/loans';

interface LoansDialogsProps {
  showForm: boolean;
  editingLoan: Loan | null;
  pendingDelete: Loan | null;
  repayLoan: Loan | null;
  isDeleting: boolean;
  onShowFormChange: (open: boolean) => void;
  onCloseForm: () => void;
  onFormSuccess: () => void;
  onClearPendingDelete: () => void;
  onConfirmDelete: () => void;
  onRepayDialogChange: (open: boolean) => void;
  onRepayConfirm: (amount: number) => Promise<void>;
}

export function LoansDialogs({
  showForm,
  editingLoan,
  pendingDelete,
  repayLoan,
  isDeleting,
  onShowFormChange,
  onCloseForm,
  onFormSuccess,
  onClearPendingDelete,
  onConfirmDelete,
  onRepayDialogChange,
  onRepayConfirm,
}: LoansDialogsProps) {
  return (
    <>
      <Dialog open={showForm} onOpenChange={onShowFormChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingLoan ? 'Edit Loan' : 'Create New Loan'}</DialogTitle>
          </DialogHeader>
          <LoanForm
            onClose={onCloseForm}
            onSuccess={onFormSuccess}
            loan={editingLoan || undefined}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!pendingDelete} onOpenChange={onClearPendingDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Loan</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete {pendingDelete?.name}? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClearPendingDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirmDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {repayLoan && (
        <RepayLoanDialog
          open={!!repayLoan}
          onOpenChange={onRepayDialogChange}
          loan={repayLoan}
          onConfirm={onRepayConfirm}
        />
      )}
    </>
  );
}
