import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserRound } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import { loanTypeOptions, type LoanFormData } from '../loan-form.config';

interface LoanPrimarySectionProps {
  form: UseFormReturn<LoanFormData>;
  isEditing: boolean;
}

export function LoanPrimarySection({ form, isEditing }: LoanPrimarySectionProps) {
  return (
    <>
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
            Lender / Borrower
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
    </>
  );
}
