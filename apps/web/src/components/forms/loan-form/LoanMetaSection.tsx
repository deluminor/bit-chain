import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BadgePercent, CreditCard } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import type { LoanFormData } from '../loan-form.config';

interface LoanMetaSectionProps {
  form: UseFormReturn<LoanFormData>;
}

export function LoanMetaSection({ form }: LoanMetaSectionProps) {
  return (
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
  );
}
