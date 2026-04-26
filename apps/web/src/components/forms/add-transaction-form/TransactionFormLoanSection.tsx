'use client';

import {
  TransactionFormData,
  TransactionFormInput,
} from '@/components/forms/add-transaction-form.config';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Loan } from '@/features/finance/queries/loans';
import { formatCurrency } from '@/lib/currency';
import { Landmark } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';

interface TransactionFormLoanSectionProps {
  form: UseFormReturn<TransactionFormInput, unknown, TransactionFormData>;
  loanOptions: Loan[];
}

export function TransactionFormLoanSection({ form, loanOptions }: TransactionFormLoanSectionProps) {
  return (
    <div className="space-y-2 rounded-lg border border-border/80 bg-muted/20 p-4">
      <Label htmlFor="loanId" className="flex items-center gap-2 text-foreground">
        <Landmark className="h-4 w-4 text-muted-foreground" aria-hidden />
        Loan / debt *
      </Label>
      <p className="text-xs text-muted-foreground">
        This payment will increase the repaid amount for the selected record.
      </p>
      {loanOptions.length === 0 ? (
        <p className="text-sm text-amber-700 dark:text-amber-500">
          No open loans to repay. Add one under Loans, or clear the category.
        </p>
      ) : null}
      <Select
        value={form.watch('loanId') ?? ''}
        onValueChange={value => {
          form.setValue('loanId', value || null);
          form.clearErrors('loanId');
        }}
      >
        <SelectTrigger
          id="loanId"
          className={form.formState.errors.loanId ? 'border-destructive' : 'bg-background'}
        >
          <SelectValue placeholder="Select loan or debt" />
        </SelectTrigger>
        <SelectContent>
          {loanOptions.map(loan => {
            const remaining = Math.max(loan.totalAmount - loan.paidAmount, 0);
            return (
              <SelectItem key={loan.id} value={loan.id}>
                <span className="font-medium">{loan.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {formatCurrency(remaining, loan.currency)} left
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {form.formState.errors.loanId ? (
        <p className="text-sm text-destructive">{form.formState.errors.loanId.message}</p>
      ) : null}
    </div>
  );
}
