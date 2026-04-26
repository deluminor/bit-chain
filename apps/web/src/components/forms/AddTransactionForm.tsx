'use client';

import {
  transactionFormSchema,
  transactionTypes,
  type TransactionFormData,
  type TransactionFormInput,
} from '@/components/forms/add-transaction-form.config';
import { TransactionFormDetailsSection } from '@/components/forms/add-transaction-form/TransactionFormDetailsSection';
import { TransactionFormMetaSection } from '@/components/forms/add-transaction-form/TransactionFormMetaSection';
import { submitTransactionForm } from '@/components/forms/add-transaction-form/submit-transaction';
import type { FinanceAccount } from '@/features/finance/queries/accounts';
import { useAccounts } from '@/features/finance/queries/accounts';
import { useLoans } from '@/features/finance/queries/loans';
import {
  Transaction,
  useCreateTransaction,
  useTransactionCategories,
  useUpdateTransaction,
} from '@/features/finance/queries/transactions';
import { useToast } from '@/hooks/use-toast';
import { BASE_CURRENCY, useCurrencyConverter } from '@/lib/currency';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

interface TransactionFormProps {
  transaction?: Transaction;
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultType?: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  defaultAccountId?: string;
}

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

  const isEditing = Boolean(transaction);

  const form = useForm<TransactionFormInput, unknown, TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
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
      loanId: transaction?.loanId ?? null,
    },
    mode: 'all',
  });

  const watchedType = form.watch('type') ?? defaultType;
  const watchedTags = form.watch('tags') ?? [];
  const watchedAmount = form.watch('amount');
  const watchedCurrency = form.watch('currency') ?? BASE_CURRENCY;
  const watchedAccountId = form.watch('accountId');
  const watchedTransferToId = form.watch('transferToId');
  const watchedTransferAmount = form.watch('transferAmount');
  const watchedTransferCurrency = form.watch('transferCurrency');

  const selectedTransactionType = transactionTypes.find(type => type.value === watchedType);

  const { data: accountsData } = useAccounts();
  const { data: loansData } = useLoans(false);
  const { data: categoriesData } = useTransactionCategories(watchedType);

  const accounts = useMemo(
    () => (accountsData?.accounts || []) as FinanceAccount[],
    [accountsData?.accounts],
  );
  const loans = loansData?.loans ?? [];
  const categories = useMemo(() => categoriesData?.categories ?? [], [categoriesData?.categories]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name !== 'date' || !value.date) {
        return;
      }
      const next = value.date instanceof Date ? value.date : new Date(value.date);
      setSelectedDate(prev => (prev && next.getTime() === prev.getTime() ? prev : next));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    if (watchedAccountId && accounts.length > 0) {
      const selectedAccount = accounts.find(acc => acc.id === watchedAccountId);
      if (selectedAccount && selectedAccount.currency !== watchedCurrency) {
        form.setValue('currency', selectedAccount.currency);
      }
    }
  }, [watchedAccountId, accounts, form, watchedCurrency]);

  useEffect(() => {
    if (watchedTransferToId && accounts.length > 0) {
      const selectedAccount = accounts.find(acc => acc.id === watchedTransferToId);
      if (selectedAccount && selectedAccount.currency !== watchedTransferCurrency) {
        form.setValue('transferCurrency', selectedAccount.currency);
      }
    }
  }, [watchedTransferToId, accounts, form, watchedTransferCurrency]);

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

  const onSubmit: SubmitHandler<TransactionFormData> = async data => {
    await submitTransactionForm({
      data,
      form,
      isEditing,
      transaction,
      categories,
      createTransaction: payload => createTransaction.mutateAsync(payload),
      updateTransaction: payload => updateTransaction.mutateAsync(payload),
      toast,
      onSuccess,
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <TransactionFormDetailsSection
        form={form}
        watchedType={watchedType}
        watchedAmount={watchedAmount}
        watchedCurrency={watchedCurrency}
        watchedTransferAmount={watchedTransferAmount}
        watchedTransferCurrency={watchedTransferCurrency}
        accounts={accounts}
        transferAccounts={transferAccounts}
        categories={categories}
        transactionTypes={transactionTypes}
        loans={loans}
        currentLoanId={transaction?.loanId}
      />

      <TransactionFormMetaSection
        form={form}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        newTag={newTag}
        onNewTagChange={setNewTag}
        onAddTag={addTag}
        watchedTags={watchedTags}
        onRemoveTag={removeTag}
        isPending={createTransaction.isPending || updateTransaction.isPending}
        isEditing={isEditing}
        submitColor={selectedTransactionType?.color}
        onCancel={onCancel}
      />
    </form>
  );
}
