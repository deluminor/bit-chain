'use client';

import {
  accountFormSchema,
  accountTypes,
  type AccountFormData,
} from '@/components/forms/account-form.config';
import { AccountAppearanceSection } from '@/components/forms/account-form/AccountAppearanceSection';
import { AccountBasicSection } from '@/components/forms/account-form/AccountBasicSection';
import { AccountFormActions } from '@/components/forms/account-form/AccountFormActions';
import { AccountPreview } from '@/components/forms/account-form/AccountPreview';
import {
  useCreateAccount,
  useUpdateAccount,
  type CreateAccountData,
  type FinanceAccount,
  type UpdateAccountData,
} from '@/features/finance/queries/accounts';
import { useToast } from '@/hooks/use-toast';
import { BASE_CURRENCY } from '@/lib/currency';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';

interface AccountFormProps {
  account?: FinanceAccount;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AccountForm({ account, onSuccess, onCancel }: AccountFormProps) {
  const { toast } = useToast();
  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const [selectedColor, setSelectedColor] = useState(account?.color || '#3B82F6');

  const isEditing = !!account;

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountFormSchema) as unknown as Resolver<AccountFormData>,
    defaultValues: {
      name: account?.name || '',
      type: account?.type || 'BANK_CARD',
      currency: account?.currency || BASE_CURRENCY,
      balance: account?.balance ?? 0,
      color: account?.color || '#3B82F6',
      icon: account?.icon || 'CreditCard',
      description: account?.description || '',
      isActive: account?.isActive ?? true,
    },
  });

  const watchedType = form.watch('type');
  const watchedBalance = form.watch('balance');
  const watchedCurrency = form.watch('currency');

  const selectedAccountType = accountTypes.find(type => type.value === watchedType);

  const onSubmit = async (data: AccountFormData) => {
    try {
      const payload = {
        ...data,
        color: selectedColor,
        icon: selectedAccountType?.iconName || 'CreditCard',
      };

      if (isEditing && account) {
        await updateAccount.mutateAsync({ id: account.id, ...payload } as UpdateAccountData);
        toast({ title: 'Success', description: 'Account updated successfully' });
      } else {
        await createAccount.mutateAsync(payload as CreateAccountData);
        toast({ title: 'Success', description: 'Account created successfully' });
      }

      onSuccess?.();
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description:
          (error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
          'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <AccountBasicSection
        form={form}
        watchedBalance={watchedBalance}
        watchedCurrency={watchedCurrency}
      />

      <AccountAppearanceSection
        form={form}
        selectedColor={selectedColor}
        onColorSelect={color => {
          setSelectedColor(color);
          form.setValue('color', color);
        }}
      />

      <AccountPreview
        name={form.watch('name')}
        type={watchedType ?? 'BANK_CARD'}
        currency={watchedCurrency}
        balance={watchedBalance}
        selectedColor={selectedColor}
      />

      <AccountFormActions
        isPending={createAccount.isPending || updateAccount.isPending}
        isEditing={isEditing}
        onCancel={onCancel}
      />
    </form>
  );
}
