import { CurrencyInput } from '@/components/ui/currency-input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/currency';
import type { UseFormReturn } from 'react-hook-form';
import type { GoalFormData } from '../goal-form.config';

interface GoalAmountSectionProps {
  form: UseFormReturn<GoalFormData>;
  selectedColor: string;
}

export function GoalAmountSection({ form, selectedColor }: GoalAmountSectionProps) {
  const watchedCurrency = form.watch('currency');
  const watchedTargetAmount = form.watch('targetAmount');
  const watchedCurrentAmount = form.watch('currentAmount');

  const progress = (
    watchedTargetAmount > 0 ? Math.min((watchedCurrentAmount / watchedTargetAmount) * 100, 100) : 0
  ).toFixed(0);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="targetAmount">Target Amount *</Label>
          <CurrencyInput
            placeholder="15000.00"
            value={form.getValues('targetAmount')}
            onAmountChange={(value: number) => form.setValue('targetAmount', value)}
            className={form.formState.errors.targetAmount ? 'border-destructive' : ''}
            currency={watchedCurrency}
            showCurrencySelect={false}
          />
          {form.formState.errors.targetAmount && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <span className="text-xs">⚠</span>
              {form.formState.errors.targetAmount.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentAmount">Current Amount</Label>
          <CurrencyInput
            placeholder="0.00"
            value={form.getValues('currentAmount')}
            onAmountChange={(value: number) => form.setValue('currentAmount', value)}
            className={form.formState.errors.currentAmount ? 'border-destructive' : ''}
            currency={watchedCurrency}
            showCurrencySelect={false}
          />
          {form.formState.errors.currentAmount && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <span className="text-xs">⚠</span>
              {form.formState.errors.currentAmount.message}
            </p>
          )}
        </div>
      </div>

      {watchedTargetAmount > 0 && (
        <div className="p-4 bg-muted/30 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                backgroundColor: selectedColor,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              Remaining:{' '}
              {formatCurrency(watchedTargetAmount - watchedCurrentAmount, watchedCurrency)}
            </span>
            <span>Target: {formatCurrency(watchedTargetAmount, watchedCurrency)}</span>
          </div>
        </div>
      )}
    </>
  );
}
