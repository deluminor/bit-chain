'use client';

import {
  TransactionFormData,
  TransactionFormInput,
} from '@/components/forms/add-transaction-form.config';
import { colorSwatchStyle } from '@/components/forms/add-transaction-form.styles';
import { TransactionFormLoanSection } from '@/components/forms/add-transaction-form/TransactionFormLoanSection';
import {
  TransactionFormTypeSection,
  type TransactionTypeOption,
} from '@/components/forms/add-transaction-form/TransactionFormTypeSection';
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
import type { Loan } from '@/features/finance/queries/loans';
import type { TransactionCategory } from '@/features/finance/queries/transactions';
import { formatCurrency } from '@/lib/currency';
import { useMemo } from 'react';
import type { UseFormReturn } from 'react-hook-form';

type TransactionTypeValue = 'INCOME' | 'EXPENSE' | 'TRANSFER';

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
  transactionTypes: ReadonlyArray<TransactionTypeOption>;
  loans: Loan[];
  currentLoanId?: string | null;
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
  loans,
  currentLoanId,
}: TransactionFormDetailsSectionProps) {
  const categoryId = form.watch('categoryId');
  const selectedCategory = useMemo(
    () => categories.find(c => c.id === categoryId),
    [categories, categoryId],
  );
  const showLoanSelect = watchedType === 'EXPENSE' && selectedCategory?.isLoanRepayment === true;

  const loanOptions = useMemo(() => {
    if (!loans.length) return [];
    return loans.filter(loan => {
      const remaining = loan.totalAmount - loan.paidAmount;
      if (remaining <= 0 && loan.id !== currentLoanId) return false;
      return true;
    });
  }, [loans, currentLoanId]);

  return (
    <div className="space-y-6">
      <TransactionFormTypeSection
        form={form}
        watchedType={watchedType}
        transactionTypes={transactionTypes}
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        <div className="space-y-2">
          <Label htmlFor="accountId">
            {watchedType === 'TRANSFER' ? 'From account *' : 'Account *'}
          </Label>
          <Select
            value={form.watch('accountId')}
            onValueChange={value => form.setValue('accountId', value)}
          >
            <SelectTrigger
              id="accountId"
              className={form.formState.errors.accountId ? 'border-destructive' : ''}
            >
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map(account => (
                <SelectItem key={account.id} value={account.id}>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={colorSwatchStyle(account.color)} />
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
            <p className="text-sm text-destructive">{form.formState.errors.accountId.message}</p>
          )}
        </div>

        {watchedType === 'TRANSFER' ? (
          <div className="space-y-2">
            <Label htmlFor="transferToId">To account *</Label>
            <Select
              value={form.watch('transferToId')}
              onValueChange={value => form.setValue('transferToId', value)}
            >
              <SelectTrigger
                id="transferToId"
                className={form.formState.errors.transferToId ? 'border-destructive' : ''}
              >
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                {transferAccounts.map(account => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
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
            {form.formState.errors.transferToId ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.transferToId.message}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category *</Label>
          <Select
            value={form.watch('categoryId')}
            onValueChange={value => {
              form.setValue('categoryId', value);
              const next = categories.find(c => c.id === value);
              if (!next?.isLoanRepayment) {
                form.setValue('loanId', null);
                form.clearErrors('loanId');
              }
            }}
          >
            <SelectTrigger
              id="categoryId"
              className={form.formState.errors.categoryId ? 'border-destructive' : ''}
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={colorSwatchStyle(category.color)}
                    />
                    <span>{category.name}</span>
                    {category.parent ? (
                      <Badge variant="outline" className="text-xs">
                        {category.parent.name}
                      </Badge>
                    ) : null}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.categoryId && (
            <p className="text-sm text-destructive">{form.formState.errors.categoryId.message}</p>
          )}
          {categories.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No categories for {watchedType.toLowerCase()} yet.
            </p>
          ) : null}
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
            <p className="text-sm text-destructive">{form.formState.errors.amount.message}</p>
          )}
          {watchedAmount > 0 && !form.formState.errors.amount ? (
            <p className="text-xs text-muted-foreground">
              Preview: {formatCurrency(watchedAmount || 0, watchedCurrency)}
            </p>
          ) : null}
        </div>
      </div>

      {showLoanSelect ? <TransactionFormLoanSection form={form} loanOptions={loanOptions} /> : null}

      {watchedType === 'TRANSFER' ? (
        <TransactionTransferSection
          form={form}
          watchedAmount={watchedAmount}
          watchedCurrency={watchedCurrency}
          watchedTransferAmount={watchedTransferAmount}
          watchedTransferCurrency={watchedTransferCurrency}
        />
      ) : null}
    </div>
  );
}
