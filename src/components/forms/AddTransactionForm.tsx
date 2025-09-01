'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CurrencyInput } from '@/components/ui/currency-input';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { Plus, Minus, ArrowRightLeft, Calendar, Tag, X } from 'lucide-react';
import {
  CreateTransactionData,
  UpdateTransactionData,
  useCreateTransaction,
  useUpdateTransaction,
  useTransactionCategories,
  Transaction,
} from '@/features/finance/queries/transactions';
import { useAccounts } from '@/features/finance/queries/accounts';
import { formatCurrency, useCurrencyConverter, BASE_CURRENCY } from '@/lib/currency';
import { DatePicker } from '@/components/ui/date-picker';

const transactionFormSchema = z
  .object({
    accountId: z.string().min(1, 'Account is required'),
    categoryId: z.string().min(1, 'Category is required'),
    type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
    amount: z.number().positive('Amount must be positive').min(0.01, 'Minimum amount is 0.01'),
    currency: z.string().min(3).max(3).default('EUR'),
    description: z.string().max(200).optional(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    transferToId: z.string().optional(),
    transferAmount: z.number().optional().nullable(),
    transferCurrency: z.string().min(3).max(3).optional(),
    isRecurring: z.boolean().default(false),
    recurringPattern: z
      .enum(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'])
      .optional()
      .nullable(),
  })
  .refine(
    data => {
      if (data.type === 'TRANSFER') {
        return data.transferToId && data.transferToId.length > 0;
      }
      return true;
    },
    {
      message: 'Destination account is required for transfers',
      path: ['transferToId'],
    },
  )
  .refine(
    data => {
      if (data.type === 'TRANSFER') {
        return data.transferAmount != null && data.transferAmount > 0;
      }
      // For non-transfer transactions, transferAmount can be undefined or any value
      return true;
    },
    {
      message: 'Transfer amount must be positive',
      path: ['transferAmount'],
    },
  )
  .refine(
    data => {
      if (data.isRecurring) {
        return data.recurringPattern != null;
      }
      return true;
    },
    {
      message: 'Recurring pattern is required when recurring is enabled',
      path: ['recurringPattern'],
    },
  );

type TransactionFormData = z.infer<typeof transactionFormSchema>;

interface TransactionFormProps {
  transaction?: Transaction;
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultType?: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  defaultAccountId?: string;
}

const transactionTypes = [
  {
    value: 'INCOME',
    label: 'Income',
    icon: Plus,
    color: '#10B981',
    description: 'Money coming in',
  },
  {
    value: 'EXPENSE',
    label: 'Expense',
    icon: Minus,
    color: '#EF4444',
    description: 'Money going out',
  },
  {
    value: 'TRANSFER',
    label: 'Transfer',
    icon: ArrowRightLeft,
    color: '#3B82F6',
    description: 'Move between accounts',
  },
] as const;

const recurringPatterns = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'QUARTERLY', label: 'Quarterly' },
  { value: 'YEARLY', label: 'Yearly' },
] as const;

export function AddTransactionForm({
  transaction,
  onSuccess,
  onCancel,
  defaultType = 'EXPENSE',
  defaultAccountId,
}: TransactionFormProps) {
  const { toast } = useToast();
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();

  // Log mutation errors
  React.useEffect(() => {
    if (createTransaction.error) {
      console.error('Create transaction error:', createTransaction.error);
    }
    if (updateTransaction.error) {
      console.error('Update transaction error:', updateTransaction.error);
    }
  }, [createTransaction.error, updateTransaction.error]);

  const { convertToBase: _convertToBase } = useCurrencyConverter();
  const [newTag, setNewTag] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    transaction?.date ? new Date(transaction.date) : new Date(),
  );

  const isEditing = !!transaction;

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema) as any,
    defaultValues: {
      accountId: transaction?.account.id || defaultAccountId || '',
      categoryId: transaction?.category.id || '',
      type: transaction?.type || defaultType,
      amount: transaction?.amount || 0,
      currency: transaction?.currency || BASE_CURRENCY,
      description: transaction?.description || '',
      date: transaction?.date ? new Date(transaction.date) : new Date(),
      tags: transaction?.tags || [],
      transferToId: transaction?.transferTo?.id || '',
      transferAmount: transaction?.transferAmount || null,
      transferCurrency: transaction?.transferCurrency || BASE_CURRENCY,
      isRecurring: transaction?.isRecurring || false,
      recurringPattern: transaction?.recurringPattern || null,
    },
    mode: 'all',
  });

  const watchedType = form.watch('type');
  const watchedTags = form.watch('tags');
  const watchedIsRecurring = form.watch('isRecurring');
  const watchedAmount = form.watch('amount');
  const watchedCurrency = form.watch('currency');
  const watchedAccountId = form.watch('accountId');
  const watchedTransferToId = form.watch('transferToId');
  const watchedTransferAmount = form.watch('transferAmount');
  const watchedTransferCurrency = form.watch('transferCurrency');

  // Sync date state with form changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'date' && value.date && value.date !== selectedDate) {
        setSelectedDate(value.date instanceof Date ? value.date : new Date(value.date));
      }
    });
    return () => subscription.unsubscribe();
  }, [form, selectedDate]);

  const selectedTransactionType = transactionTypes.find(type => type.value === watchedType);

  // Get accounts and categories
  const { data: accountsData } = useAccounts();
  const { data: categoriesData } = useTransactionCategories(watchedType);

  const accounts = accountsData?.accounts || [];
  const categories = categoriesData?.categories || [];

  // Auto-update currency when account changes
  useEffect(() => {
    if (watchedAccountId && accounts.length > 0) {
      const selectedAccount = accounts.find(acc => acc.id === watchedAccountId);
      if (selectedAccount && selectedAccount.currency !== watchedCurrency) {
        form.setValue('currency', selectedAccount.currency);
      }
    }
  }, [watchedAccountId, accounts, form, watchedCurrency]);

  // Auto-update transfer currency when transfer destination account changes
  useEffect(() => {
    if (watchedTransferToId && accounts.length > 0) {
      const selectedAccount = accounts.find(acc => acc.id === watchedTransferToId);
      if (selectedAccount && selectedAccount.currency !== watchedTransferCurrency) {
        form.setValue('transferCurrency', selectedAccount.currency);
      }
    }
  }, [watchedTransferToId, accounts, form, watchedTransferCurrency]);

  // Filter accounts for transfer destination (exclude source account)
  const transferAccounts = accounts.filter(acc => acc.id !== form.watch('accountId'));

  const addTag = () => {
    if (newTag.trim() && !watchedTags.includes(newTag.trim())) {
      form.setValue('tags', [...watchedTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    form.setValue(
      'tags',
      watchedTags.filter(tag => tag !== tagToRemove),
    );
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      form.setValue('date', date);
      form.clearErrors('date');
    }
  };

  const onSubmit = async (data: TransactionFormData) => {
    try {
      // Additional validation
      if (!data.amount || data.amount <= 0) {
        form.setError('amount', { message: 'Amount is required and must be positive' });
        return;
      }

      if (data.type === 'TRANSFER') {
        if (!data.transferToId) {
          form.setError('transferToId', {
            message: 'Destination account is required for transfers',
          });
          return;
        }
        if (!data.transferAmount || data.transferAmount <= 0) {
          form.setError('transferAmount', {
            message: 'Transfer amount is required and must be positive',
          });
          return;
        }
      }

      const formData = {
        ...data,
        amount: parseFloat(data.amount.toFixed(2)), // Ensure proper decimal formatting
        date:
          data.date instanceof Date ? data.date.toISOString() : new Date(data.date).toISOString(),
        ...(data.type !== 'TRANSFER' && {
          transferToId: undefined,
          transferAmount: undefined,
          transferCurrency: undefined,
        }),
        ...(data.type === 'TRANSFER' &&
          data.transferAmount && {
            transferAmount: parseFloat(data.transferAmount.toFixed(2)),
          }),
      };

      if (isEditing && transaction) {
        await updateTransaction.mutateAsync({
          id: transaction.id,
          ...formData,
        } as UpdateTransactionData);
        toast({
          title: 'Success',
          description: 'Transaction updated successfully',
        });
      } else {
        await createTransaction.mutateAsync(formData as CreateTransactionData);
        toast({
          title: 'Success',
          description: 'Transaction created successfully',
        });
      }

      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          {selectedTransactionType && (
            <selectedTransactionType.icon
              className="h-5 w-5"
              style={{ color: selectedTransactionType.color }}
            />
          )}
          {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isEditing ? 'Update transaction details' : 'Record your income, expense, or transfer'}
        </p>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
        {/* Transaction Type */}
        <div className="space-y-3">
          <Label>Transaction Type</Label>
          <div className="grid grid-cols-3 gap-3">
            {transactionTypes.map(type => (
              <button
                key={type.value}
                type="button"
                onClick={() => {
                  form.setValue('type', type.value);
                  form.setValue('categoryId', ''); // Reset category when type changes
                  if (type.value !== 'TRANSFER') {
                    form.setValue('transferToId', '');
                  }
                }}
                className={`p-3 rounded-lg border-2 transition-all ${
                  watchedType === type.value
                    ? 'border-current bg-current/10'
                    : 'border-muted bg-muted/50 hover:bg-muted'
                }`}
                style={{
                  ...(watchedType === type.value && {
                    borderColor: type.color,
                    color: type.color,
                  }),
                }}
              >
                <type.icon className="h-5 w-5 mx-auto mb-1" />
                <div className="text-sm font-medium">{type.label}</div>
                <div className="text-xs opacity-70">{type.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Selection */}
          <div className="space-y-2">
            <Label htmlFor="accountId">
              {watchedType === 'TRANSFER' ? 'From Account *' : 'Account *'}
            </Label>
            <Select
              value={form.watch('accountId')}
              onValueChange={value => form.setValue('accountId', value)}
            >
              <SelectTrigger
                className={form.formState.errors.accountId ? 'border-destructive' : ''}
              >
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account: any) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: account.color }}
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
            {form.formState.errors.accountId && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <span className="text-xs">⚠</span>
                {form.formState.errors.accountId.message}
              </p>
            )}
          </div>

          {/* Transfer To Account (only for transfers) */}
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
                  {transferAccounts.map((account: any) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: account.color }}
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
          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category *</Label>
            <Select
              value={form.watch('categoryId')}
              onValueChange={value => form.setValue('categoryId', value)}
            >
              <SelectTrigger
                className={form.formState.errors.categoryId ? 'border-destructive' : ''}
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category: any) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
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

          {/* Amount */}
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

        {/* Transfer Amount (only for transfers) */}
        {watchedType === 'TRANSFER' && (
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
                Preview:{' '}
                {formatCurrency(watchedTransferAmount, watchedTransferCurrency || BASE_CURRENCY)}
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
        )}

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="What was this transaction for?"
            rows={2}
            {...form.register('description')}
          />
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Date *
          </Label>
          <DatePicker
            date={selectedDate}
            onDateChange={handleDateChange}
            placeholder="Select transaction date"
            className={form.formState.errors.date ? 'border-destructive' : ''}
          />
          {form.formState.errors.date && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <span className="text-xs">⚠</span>
              {form.formState.errors.date.message}
            </p>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Tags
          </Label>

          {/* Tag Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Add a tag"
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <Button type="button" onClick={addTag} size="sm">
              Add
            </Button>
          </div>

          {/* Tag Display */}
          {watchedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {watchedTags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Recurring Transaction */}
        <div className="space-y-3">
          <Separator />
          <div className="flex items-center justify-between">
            <Label htmlFor="isRecurring">Recurring Transaction</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => form.setValue('isRecurring', !watchedIsRecurring)}
            >
              {watchedIsRecurring ? 'Enabled' : 'Disabled'}
            </Button>
          </div>

          {watchedIsRecurring && (
            <div className="space-y-2">
              <Label>Recurring Pattern</Label>
              <Select
                value={form.watch('recurringPattern')}
                onValueChange={(value: any) => form.setValue('recurringPattern', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pattern" />
                </SelectTrigger>
                <SelectContent>
                  {recurringPatterns.map(pattern => (
                    <SelectItem key={pattern.value} value={pattern.value}>
                      {pattern.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={createTransaction.isPending || updateTransaction.isPending}
            className="flex-1"
            style={{ backgroundColor: selectedTransactionType?.color }}
          >
            {createTransaction.isPending || updateTransaction.isPending
              ? 'Saving...'
              : isEditing
                ? 'Update Transaction'
                : 'Add Transaction'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
