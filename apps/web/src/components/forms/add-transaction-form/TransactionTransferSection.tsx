'use client';

import {
  TransactionFormData,
  TransactionFormInput,
} from '@/components/forms/add-transaction-form.config';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Label } from '@/components/ui/label';
import { BASE_CURRENCY, formatCurrency } from '@/lib/currency';
import type { UseFormReturn } from 'react-hook-form';

interface TransactionTransferSectionProps {
  form: UseFormReturn<TransactionFormInput, unknown, TransactionFormData>;
  watchedAmount: number;
  watchedCurrency: string;
  watchedTransferAmount: number | null | undefined;
  watchedTransferCurrency: string | undefined;
}

export function TransactionTransferSection({
  form,
  watchedAmount,
  watchedCurrency,
  watchedTransferAmount,
  watchedTransferCurrency,
}: TransactionTransferSectionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="transferAmount">Amount Received *</Label>
      <div className="text-xs text-muted-foreground mb-2">
        How much will be received in the destination account?
      </div>
      <CurrencyInput
        placeholder="0.00"
        value={watchedTransferAmount || 0}
        currency={watchedTransferCurrency || BASE_CURRENCY}
        onChange={(value, currency) => {
          form.setValue('transferAmount', value);
          form.setValue('transferCurrency', currency);
          form.clearErrors('transferAmount');
        }}
        showCurrencySelect={true}
        className={form.formState.errors.transferAmount ? 'border-destructive' : ''}
        required
      />
      {form.formState.errors.transferAmount && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <span className="text-xs">⚠</span>
          {form.formState.errors.transferAmount.message}
        </p>
      )}
      {watchedTransferAmount != null &&
      watchedTransferAmount > 0 &&
      !form.formState.errors.transferAmount ? (
        <p className="text-xs text-muted-foreground">
          Preview: {formatCurrency(watchedTransferAmount, watchedTransferCurrency || BASE_CURRENCY)}
        </p>
      ) : (
        ''
      )}
      {watchedAmount > 0 && watchedTransferAmount != null && watchedTransferAmount > 0 ? (
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="text-xs font-medium text-muted-foreground">Exchange Summary</div>
          <div className="text-sm">
            Send: {formatCurrency(watchedAmount, watchedCurrency)} → Receive:{' '}
            {formatCurrency(watchedTransferAmount, watchedTransferCurrency || BASE_CURRENCY)}
          </div>
          {watchedCurrency !== watchedTransferCurrency && (
            <div className="text-xs text-muted-foreground">
              Rate: 1 {watchedCurrency} ≈{' '}
              {((watchedTransferAmount || 0) / (watchedAmount || 1)).toFixed(4)}{' '}
              {watchedTransferCurrency}
            </div>
          )}
        </div>
      ) : (
        ''
      )}
    </div>
  );
}
