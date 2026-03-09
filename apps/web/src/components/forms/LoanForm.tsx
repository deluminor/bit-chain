'use client';

import { type LoanFormData, loanFormSchema } from '@/components/forms/loan-form.config';
import { LoanAmountsSection } from '@/components/forms/loan-form/LoanAmountsSection';
import { LoanDatesSection } from '@/components/forms/loan-form/LoanDatesSection';
import { LoanFormActions } from '@/components/forms/loan-form/LoanFormActions';
import { LoanMetaSection } from '@/components/forms/loan-form/LoanMetaSection';
import { LoanPrimarySection } from '@/components/forms/loan-form/LoanPrimarySection';
import {
  type CreateLoanData,
  type Loan,
  type UpdateLoanData,
  useCreateLoan,
  useUpdateLoan,
} from '@/features/finance/queries/loans';
import { useToast } from '@/hooks/use-toast';
import { BASE_CURRENCY } from '@/lib/currency';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { type Resolver, type SubmitHandler, useForm } from 'react-hook-form';

interface LoanFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  loan?: Loan;
}

export function LoanForm({ onClose, onSuccess, loan }: LoanFormProps) {
  const { toast } = useToast();
  const createLoan = useCreateLoan();
  const updateLoan = useUpdateLoan();

  const [startDate, setStartDate] = useState<Date | undefined>(
    loan?.startDate ? new Date(loan.startDate) : undefined,
  );
  const [dueDate, setDueDate] = useState<Date | undefined>(
    loan?.dueDate ? new Date(loan.dueDate) : undefined,
  );

  const isEditing = !!loan;

  const form = useForm<LoanFormData>({
    resolver: zodResolver(loanFormSchema) as unknown as Resolver<LoanFormData>,
    defaultValues: {
      name: loan?.name || '',
      type: loan?.type || 'LOAN',
      totalAmount: loan?.totalAmount || 0,
      paidAmount: loan?.paidAmount ?? 0,
      currency: loan?.currency || BASE_CURRENCY,
      startDate: loan?.startDate ? new Date(loan.startDate) : undefined,
      dueDate: loan?.dueDate ? new Date(loan.dueDate) : undefined,
      interestRate: loan?.interestRate ?? undefined,
      lender: loan?.lender || '',
      notes: loan?.notes || '',
    },
  });

  const watchedCurrency = form.watch('currency') || BASE_CURRENCY;
  const watchedTotalAmount = form.watch('totalAmount');
  const watchedPaidAmount = form.watch('paidAmount');

  const onSubmit: SubmitHandler<LoanFormData> = async data => {
    try {
      if (data.paidAmount > data.totalAmount) {
        toast({
          title: 'Validation Error',
          description: 'Paid amount cannot exceed total amount',
          variant: 'destructive',
        });
        return;
      }

      const payload = {
        ...data,
        startDate: data.startDate ? data.startDate.toISOString() : undefined,
        dueDate: data.dueDate ? data.dueDate.toISOString() : undefined,
        interestRate: data.interestRate ?? undefined,
      };

      if (isEditing && loan) {
        await updateLoan.mutateAsync({ id: loan.id, ...payload } as UpdateLoanData);
        toast({ title: 'Success', description: 'Loan updated successfully' });
      } else {
        await createLoan.mutateAsync(payload as CreateLoanData);
        toast({ title: 'Success', description: 'Loan created successfully' });
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Failed to ${isEditing ? 'update' : 'create'} loan`;
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <LoanPrimarySection form={form} isEditing={isEditing} />

      <LoanAmountsSection
        form={form}
        watchedCurrency={watchedCurrency}
        watchedTotalAmount={watchedTotalAmount}
        watchedPaidAmount={watchedPaidAmount}
      />

      <LoanDatesSection
        form={form}
        startDate={startDate}
        dueDate={dueDate}
        onStartDateChange={setStartDate}
        onDueDateChange={setDueDate}
      />

      <LoanMetaSection form={form} />

      <LoanFormActions
        isPending={createLoan.isPending || updateLoan.isPending}
        isEditing={isEditing}
        onClose={onClose}
      />
    </form>
  );
}
