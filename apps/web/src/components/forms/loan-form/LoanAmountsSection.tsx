import { CurrencyInput } from '@/components/ui/currency-input';
import { Label } from '@/components/ui/label';
import { BASE_CURRENCY, formatCurrency } from '@/lib/currency';
import type { UseFormReturn } from 'react-hook-form';
import type { LoanFormData } from '../loan-form.config';

interface LoanAmountsSectionProps {
  form: UseFormReturn<LoanFormData>;
  watchedCurrency: string;
  watchedTotalAmount: number;
  watchedPaidAmount: number;
}

export function LoanAmountsSection({
  form,
  watchedCurrency,
  watchedTotalAmount,
  watchedPaidAmount,
}: LoanAmountsSectionProps) {
  const remaining = Math.max(watchedTotalAmount - watchedPaidAmount, 0);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="totalAmount">Total Amount *</Label>
          <CurrencyInput
            placeholder="10000.00"
            value={form.getValues('totalAmount')}
            onAmountChange={(value: number) => form.setValue('totalAmount', value)}
            className={form.formState.errors.totalAmount ? 'border-destructive' : ''}
            currency={watchedCurrency}
            showCurrencySelect={false}
          />
          {form.formState.errors.totalAmount && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <span className="text-xs">⚠</span>
              {form.formState.errors.totalAmount.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground">Original loan/debt amount</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paidAmount">Paid Amount</Label>
          <CurrencyInput
            placeholder="0.00"
            value={form.getValues('paidAmount')}
            onAmountChange={(value: number) => form.setValue('paidAmount', value)}
            className={form.formState.errors.paidAmount ? 'border-destructive' : ''}
            currency={watchedCurrency}
            showCurrencySelect={false}
          />
          {form.formState.errors.paidAmount && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <span className="text-xs">⚠</span>
              {form.formState.errors.paidAmount.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground">Amount paid/received so far</p>
        </div>
      </div>

      <div className="p-4 rounded-lg border bg-muted/40">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Remaining</span>
          <span className="font-semibold text-lg">
            {formatCurrency(remaining, watchedCurrency || BASE_CURRENCY)}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
          <span>Total: {formatCurrency(watchedTotalAmount, watchedCurrency || BASE_CURRENCY)}</span>
          <span>Paid: {formatCurrency(watchedPaidAmount, watchedCurrency || BASE_CURRENCY)}</span>
        </div>
        {watchedTotalAmount > 0 && (
          <div className="mt-2">
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min((watchedPaidAmount / watchedTotalAmount) * 100, 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-center mt-1 text-muted-foreground">
              {((watchedPaidAmount / watchedTotalAmount) * 100).toFixed(1)}% paid
            </p>
          </div>
        )}
      </div>
    </>
  );
}
