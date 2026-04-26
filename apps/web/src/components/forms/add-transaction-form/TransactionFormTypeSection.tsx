'use client';

import {
  TransactionFormData,
  TransactionFormInput,
} from '@/components/forms/add-transaction-form.config';
import { selectedTransactionTypeStyle } from '@/components/forms/add-transaction-form.styles';
import { Label } from '@/components/ui/label';
import type { LucideIcon } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';

type TransactionTypeValue = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export interface TransactionTypeOption {
  value: TransactionTypeValue;
  label: string;
  icon: LucideIcon;
  color: string;
  description: string;
}

interface TransactionFormTypeSectionProps {
  form: UseFormReturn<TransactionFormInput, unknown, TransactionFormData>;
  watchedType: TransactionTypeValue;
  transactionTypes: ReadonlyArray<TransactionTypeOption>;
}

export function TransactionFormTypeSection({
  form,
  watchedType,
  transactionTypes,
}: TransactionFormTypeSectionProps) {
  return (
    <div className="space-y-3">
      <Label>Transaction type</Label>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
        {transactionTypes.map(type => (
          <button
            key={type.value}
            type="button"
            onClick={() => {
              form.setValue('type', type.value);
              form.setValue('categoryId', '');
              form.setValue('loanId', null);

              if (type.value !== 'TRANSFER') {
                form.setValue('transferToId', '');
              }
            }}
            className={`rounded-xl border-2 p-3 text-left transition-all sm:p-4 ${
              watchedType === type.value
                ? 'border-current bg-current/[0.08] shadow-sm'
                : 'border-border bg-card hover:bg-muted/50'
            }`}
            style={selectedTransactionTypeStyle(watchedType === type.value, type.color)}
          >
            <type.icon className="mb-1.5 h-5 w-5" aria-hidden />
            <div className="text-sm font-medium">{type.label}</div>
            <div className="text-xs text-muted-foreground">{type.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
