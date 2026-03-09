'use client';

import {
  TransactionFormData,
  TransactionFormInput,
} from '@/components/forms/add-transaction-form.config';
import {
  colorSwatchStyle,
  selectedTransactionTypeStyle,
} from '@/components/forms/add-transaction-form.styles';
import { TransactionTransferSection } from '@/components/forms/add-transaction-form/TransactionTransferSection';
import { Badge } from '@/components/ui/badge';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FinanceAccount } from '@/features/finance/queries/accounts';
import type { TransactionCategory } from '@/features/finance/queries/transactions';
import { formatCurrency } from '@/lib/currency';
import type { LucideIcon } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';

type TransactionTypeValue = 'INCOME' | 'EXPENSE' | 'TRANSFER';

interface TransactionTypeOption {
  value: TransactionTypeValue;
  label: string;
  icon: LucideIcon;
  color: string;
  description: string;
}

interface TransactionFormDetailsSectionProps {
  form: UseFormReturn<TransactionFormInput, unknown, TransactionFormData>;
  watchedType: TransactionTypeValue;
  watchedAmount: number;
  watchedCurrency: string;
  watchedTransferAmount: number | null | undefined;
  watchedTransferCurrency: string | undefined;
  accounts: FinanceAccount[];
  transferAccounts: FinanceAccount[];
  categories: TransactionCategory[];
  transactionTypes: TransactionTypeOption[];
}

export function TransactionFormDetailsSection({
  form,
  watchedType,
  watchedAmount,
  watchedCurrency,
  watchedTransferAmount,
  watchedTransferCurrency,
  accounts,
  transferAccounts,
  categories,
  transactionTypes,
}: TransactionFormDetailsSectionProps) {
  return (
    <>
      <div className="space-y-3">
        <Label>Transaction Type</Label>
        <div className="grid grid-cols-3 gap-3">
          {transactionTypes.map(type => (
            <button
              key={type.value}
              type="button"
              onClick={() => {
                form.setValue('type', type.value);
                form.setValue('categoryId', '');
                if (type.value !== 'TRANSFER') {
                  form.setValue('transferToId', '');
                }
              }}
              className={`p-3 rounded-lg border-2 transition-all ${
                watchedType === type.value
                  ? 'border-current bg-current/10'
                  : 'border-muted bg-muted/50 hover:bg-muted'
              }`}
              style={selectedTransactionTypeStyle(watchedType === type.value, type.color)}
            >
              <type.icon className="h-5 w-5 mx-auto mb-1" />
              <div className="text-sm font-medium">{type.label}</div>
              <div className="text-xs opacity-70">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="accountId">
            {watchedType === 'TRANSFER' ? 'From Account *' : 'Account *'}
          </Label>
          <Select
            value={form.watch('accountId')}
            onValueChange={value => form.setValue('accountId', value)}
          >
            <SelectTrigger className={form.formState.errors.accountId ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map(account => (
                <SelectItem key={account.id} value={account.id}>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={colorSwatchStyle(account.color)} />
                    <span>{account.name}</span>
                    <Badge variant="outline" className="ml-auto">
                      {account.currency}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.accountId && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <span className="text-xs">⚠</span>
              {form.formState.errors.accountId.message}
            </p>
          )}
        </div>

        {watchedType === 'TRANSFER' && (
          <div className="space-y-2">
            <Label htmlFor="transferToId">To Account *</Label>
            <Select
              value={form.watch('transferToId')}
              onValueChange={value => form.setValue('transferToId', value)}
            >
              <SelectTrigger
                className={form.formState.errors.transferToId ? 'border-destructive' : ''}
              >
                <SelectValue placeholder="Select destination account" />
              </SelectTrigger>
              <SelectContent>
                {transferAccounts.map(account => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={colorSwatchStyle(account.color)}
                      />
                      <span>{account.name}</span>
                      <Badge variant="outline" className="ml-auto">
                        {account.currency}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.transferToId && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <span className="text-xs">⚠</span>
                {form.formState.errors.transferToId.message}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category *</Label>
          <Select
            value={form.watch('categoryId')}
            onValueChange={value => form.setValue('categoryId', value)}
          >
            <SelectTrigger className={form.formState.errors.categoryId ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={colorSwatchStyle(category.color)}
                    />
                    <span>{category.name}</span>
                    {category.parent && (
                      <Badge variant="outline" className="text-xs">
                        {category.parent.name}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.categoryId && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <span className="text-xs">⚠</span>
              {form.formState.errors.categoryId.message}
            </p>
          )}
          {categories.length === 0 && (
            <p className="text-xs text-muted-foreground">
              No categories found for {watchedType.toLowerCase()} transactions
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount *</Label>
          <CurrencyInput
            placeholder="0.00"
            value={watchedAmount}
            currency={watchedCurrency}
            onChange={(value, currency) => {
              form.setValue('amount', value);
              form.setValue('currency', currency);
              form.clearErrors('amount');
            }}
            showCurrencySelect={true}
            className={form.formState.errors.amount ? 'border-destructive' : ''}
            required
          />
          {form.formState.errors.amount && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <span className="text-xs">⚠</span>
              {form.formState.errors.amount.message}
            </p>
          )}
          {watchedAmount > 0 && !form.formState.errors.amount && (
            <p className="text-xs text-muted-foreground">
              Preview: {formatCurrency(watchedAmount || 0, watchedCurrency)}
            </p>
          )}
        </div>
      </div>

      {watchedType === 'TRANSFER' && (
        <TransactionTransferSection
          form={form}
          watchedAmount={watchedAmount}
          watchedCurrency={watchedCurrency}
          watchedTransferAmount={watchedTransferAmount}
          watchedTransferCurrency={watchedTransferCurrency}
        />
      )}
    </>
  );
}
