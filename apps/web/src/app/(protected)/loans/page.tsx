'use client';

import { AnimatedDiv } from '@/components/ui/animations';
import { LoansDialogs } from '@/features/finance/components/loans-page/LoansDialogs';
import { LoansPageHeader } from '@/features/finance/components/loans-page/LoansPageHeader';
import { LoansSummaryCards } from '@/features/finance/components/loans-page/LoansSummaryCards';
import { LoansTable } from '@/features/finance/components/loans-page/LoansTable';
import {
  getNearestDueDate,
  sortLoansByDueDate,
} from '@/features/finance/components/loans-page/loans-page.utils';
import { Loan, useDeleteLoan, useLoans, useUpdateLoan } from '@/features/finance/queries/loans';
import { useToast } from '@/hooks/use-toast';
import { formatDisplayAmount } from '@/lib/currency';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function LoansPage() {
  const { toast } = useToast();
  const [showPaid, setShowPaid] = useState(false);
  const { data, isLoading, error, refetch } = useLoans(showPaid);
  const deleteLoan = useDeleteLoan();
  const updateLoan = useUpdateLoan();

  const [showForm, setShowForm] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Loan | null>(null);
  const [repayLoan, setRepayLoan] = useState<Loan | null>(null);

  useEffect(() => {
    if (!error) return;

    toast({
      title: 'Error',
      description: 'Failed to load loans',
      variant: 'destructive',
    });
  }, [error, toast]);

  const loans = useMemo(() => data?.loans ?? [], [data?.loans]);

  const summary =
    data?.summary ||
    ({
      total: 0,
      active: 0,
      loanCount: 0,
      debtCount: 0,
      totalOutstandingBase: 0,
    } as const);

  const sortedLoans = useMemo(() => sortLoansByDueDate(loans), [loans]);
  const nearestDueDate = useMemo(() => getNearestDueDate(loans), [loans]);

  const handleFormSuccess = useCallback(() => {
    void refetch();
    setEditingLoan(null);
  }, [refetch]);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setEditingLoan(null);
  }, []);

  const handleOpenCreateLoan = useCallback(() => {
    setShowForm(true);
  }, []);

  const handleRepayLoanSelect = useCallback((loan: Loan) => {
    setRepayLoan(loan);
  }, []);

  const handleEditLoan = useCallback((loan: Loan) => {
    setEditingLoan(loan);
    setShowForm(true);
  }, []);

  const handleDeleteLoanIntent = useCallback((loan: Loan) => {
    setPendingDelete(loan);
  }, []);

  const handleClearPendingDelete = useCallback(() => {
    setPendingDelete(null);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!pendingDelete) {
      return;
    }

    try {
      await deleteLoan.mutateAsync(pendingDelete.id);

      toast({
        title: 'Success',
        description: 'Loan deleted successfully',
      });

      setPendingDelete(null);
      void refetch();
    } catch (deleteError: unknown) {
      toast({
        title: 'Error',
        description: deleteError instanceof Error ? deleteError.message : 'Failed to delete loan',
        variant: 'destructive',
      });
    }
  }, [pendingDelete, deleteLoan, toast, refetch]);

  const handleConfirmDelete = useCallback(() => {
    handleDelete();
  }, [handleDelete]);

  const handleRepayDialogChange = useCallback((open: boolean) => {
    if (!open) {
      setRepayLoan(null);
    }
  }, []);

  const handleRepay = async (amount: number) => {
    if (!repayLoan) return;

    try {
      await updateLoan.mutateAsync({
        id: repayLoan.id,
        paidAmount: repayLoan.paidAmount + amount,
      });

      toast({
        title: 'Success',
        description: `Repayed ${formatDisplayAmount(amount, repayLoan.currency, 'detailed')}`,
      });

      refetch();
    } catch (repayError) {
      toast({
        title: 'Error',
        description: 'Failed to process repayment',
        variant: 'destructive',
      });

      throw repayError;
    }
  };

  return (
    <AnimatedDiv variant="slideUp" className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <LoansPageHeader
          showPaid={showPaid}
          onToggleShowPaid={setShowPaid}
          onCreateLoan={handleOpenCreateLoan}
        />
      </div>

      <div className="px-4 lg:px-6">
        <LoansSummaryCards summary={summary} nearestDueDate={nearestDueDate} />
      </div>

      <div className="px-4 lg:px-6">
        <LoansTable
          isLoading={isLoading}
          loans={sortedLoans}
          onRepayLoan={handleRepayLoanSelect}
          onEditLoan={handleEditLoan}
          onDeleteLoan={handleDeleteLoanIntent}
          onCreateLoan={handleOpenCreateLoan}
        />
      </div>

      <LoansDialogs
        showForm={showForm}
        editingLoan={editingLoan}
        pendingDelete={pendingDelete}
        repayLoan={repayLoan}
        isDeleting={deleteLoan.isPending}
        onShowFormChange={setShowForm}
        onCloseForm={handleCloseForm}
        onFormSuccess={handleFormSuccess}
        onClearPendingDelete={handleClearPendingDelete}
        onConfirmDelete={handleConfirmDelete}
        onRepayDialogChange={handleRepayDialogChange}
        onRepayConfirm={handleRepay}
      />
    </AnimatedDiv>
  );
}
