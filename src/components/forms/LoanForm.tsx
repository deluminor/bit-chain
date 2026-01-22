'use client';

import { useState } from 'react';
import { useForm, SubmitHandler, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CurrencyInput } from '@/components/ui/currency-input';
import { DatePicker } from '@/components/ui/date-picker';
import { Calendar, CreditCard, UserRound, BadgePercent } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  CreateLoanData,
  UpdateLoanData,
  useCreateLoan,
  useUpdateLoan,
  Loan,
} from '@/features/finance/queries/loans';
import { formatCurrency, BASE_CURRENCY } from '@/lib/currency';

const loanFormSchema = z.object({
  name: z.string().min(1, 'Loan name is required').max(120, 'Loan name is too long'),
  type: z.enum(['LOAN', 'DEBT']),
  originalAmount: z.number().positive('Original amount must be positive'),
  currentBalance: z.number().min(0, 'Current balance cannot be negative'),
  currency: z.string().min(3).max(3).optional().default(BASE_CURRENCY),
  startDate: z.date().optional(),
  dueDate: z.date().optional(),
  interestRate: z.number().min(0, 'Interest rate cannot be negative').max(100).optional(),
  lender: z.string().max(120).optional(),
  notes: z.string().max(1000).optional(),
});

type LoanFormData = z.infer<typeof loanFormSchema>;

interface LoanFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  loan?: Loan;
}

const loanTypeOptions = [
  { value: 'LOAN', label: 'Loan (I owe)' },
  { value: 'DEBT', label: 'Debt (owed to me)' },
];

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
      originalAmount: loan?.originalAmount || 0,
      currentBalance: loan?.currentBalance ?? loan?.originalAmount ?? 0,
      currency: loan?.currency || BASE_CURRENCY,
      startDate: loan?.startDate ? new Date(loan.startDate) : undefined,
      dueDate: loan?.dueDate ? new Date(loan.dueDate) : undefined,
      interestRate: loan?.interestRate ?? undefined,
      lender: loan?.lender || '',
      notes: loan?.notes || '',
    },
  });

  const watchedCurrency = form.watch('currency');
  const watchedOriginalAmount = form.watch('originalAmount');
  const watchedCurrentBalance = form.watch('currentBalance');
  const outstanding = Math.max(watchedCurrentBalance, 0);

  const onSubmit: SubmitHandler<LoanFormData> = async data => {
    try {
      const payload = {
        ...data,
        currentBalance: data.currentBalance ?? data.originalAmount,
        startDate: data.startDate ? data.startDate.toISOString() : undefined,
        dueDate: data.dueDate ? data.dueDate.toISOString() : undefined,
        interestRate: data.interestRate ?? undefined,
      };

      if (isEditing && loan) {
        await updateLoan.mutateAsync({
          id: loan.id,
          ...payload,
        } as UpdateLoanData);
        toast({
          title: 'Success',
          description: 'Loan updated successfully',
        });
      } else {
        await createLoan.mutateAsync(payload as CreateLoanData);
        toast({
          title: 'Success',
          description: 'Loan created successfully',
        });
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Loan Name *</Label>
          <Input
            id="name"
            placeholder="Neoversity Loan"
            className={form.formState.errors.name ? 'border-destructive' : ''}
            {...form.register('name')}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <span className="text-xs">⚠</span>
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={form.watch('type')}
            onValueChange={value => form.setValue('type', value as 'LOAN' | 'DEBT')}
            disabled={isEditing}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {loanTypeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isEditing && (
            <p className="text-xs text-muted-foreground">Type cannot be changed after creation.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Currency</Label>
          <Select
            value={form.watch('currency')}
            onValueChange={value => form.setValue('currency', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UAH">UAH - Ukrainian Hryvnia</SelectItem>
              <SelectItem value="USD">USD - US Dollar</SelectItem>
              <SelectItem value="EUR">EUR - Euro</SelectItem>
              <SelectItem value="GBP">GBP - British Pound</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <UserRound className="h-4 w-4" />
            Lender
          </Label>
          <Input
            placeholder="Bank or person"
            className={form.formState.errors.lender ? 'border-destructive' : ''}
            {...form.register('lender')}
          />
          {form.formState.errors.lender && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <span className="text-xs">⚠</span>
              {form.formState.errors.lender.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="originalAmount">Original Amount *</Label>
          <CurrencyInput
            placeholder="10000.00"
            value={form.getValues('originalAmount')}
            onAmountChange={(value: number) => form.setValue('originalAmount', value)}
            className={form.formState.errors.originalAmount ? 'border-destructive' : ''}
            currency={watchedCurrency}
            showCurrencySelect={false}
          />
          {form.formState.errors.originalAmount && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <span className="text-xs">⚠</span>
              {form.formState.errors.originalAmount.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentBalance">Current Balance</Label>
          <CurrencyInput
            placeholder="10000.00"
            value={form.getValues('currentBalance')}
            onAmountChange={(value: number) => form.setValue('currentBalance', value)}
            className={form.formState.errors.currentBalance ? 'border-destructive' : ''}
            currency={watchedCurrency}
            showCurrencySelect={false}
          />
          {form.formState.errors.currentBalance && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <span className="text-xs">⚠</span>
              {form.formState.errors.currentBalance.message}
            </p>
          )}
        </div>
      </div>

      <div className="p-4 rounded-lg border bg-muted/40">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Outstanding</span>
          <span className="font-semibold">
            {formatCurrency(outstanding, watchedCurrency || BASE_CURRENCY)}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
          <span>
            Original: {formatCurrency(watchedOriginalAmount, watchedCurrency || BASE_CURRENCY)}
          </span>
          <span>
            Balance: {formatCurrency(watchedCurrentBalance, watchedCurrency || BASE_CURRENCY)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Start Date
          </Label>
          <DatePicker
            date={startDate}
            onDateChange={date => {
              setStartDate(date);
              form.setValue('startDate', date);
            }}
            placeholder="Select start date"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Due Date
          </Label>
          <DatePicker
            date={dueDate}
            onDateChange={date => {
              setDueDate(date);
              form.setValue('dueDate', date);
            }}
            placeholder="Select due date"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <BadgePercent className="h-4 w-4" />
            Interest Rate (%)
          </Label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.0"
            className={form.formState.errors.interestRate ? 'border-destructive' : ''}
            {...form.register('interestRate', { valueAsNumber: true })}
          />
          {form.formState.errors.interestRate && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <span className="text-xs">⚠</span>
              {form.formState.errors.interestRate.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Notes
          </Label>
          <Textarea
            rows={2}
            placeholder="Extra details"
            className={form.formState.errors.notes ? 'border-destructive' : ''}
            {...form.register('notes')}
          />
          {form.formState.errors.notes && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <span className="text-xs">⚠</span>
              {form.formState.errors.notes.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={createLoan.isPending || updateLoan.isPending}
          className="flex-1"
        >
          {createLoan.isPending || updateLoan.isPending
            ? `${isEditing ? 'Updating' : 'Creating'} Loan...`
            : isEditing
              ? 'Update Loan'
              : 'Create Loan'}
        </Button>
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}
