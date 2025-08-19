'use client';

import { useState } from 'react';
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
import { CurrencyInput } from '@/components/ui/currency-input';
import { useToast } from '@/hooks/use-toast';
import { Wallet, CreditCard, PiggyBank, TrendingUp, Palette } from 'lucide-react';
import {
  CreateAccountData,
  UpdateAccountData,
  useCreateAccount,
  useUpdateAccount,
  FinanceAccount,
} from '@/features/finance/queries/accounts';
import { SUPPORTED_CURRENCIES, BASE_CURRENCY } from '@/lib/currency';

const accountFormSchema = z.object({
  name: z.string().min(1, 'Account name is required').max(50, 'Account name too long'),
  type: z.enum(['CASH', 'BANK_CARD', 'SAVINGS', 'INVESTMENT']),
  currency: z.string().min(3, 'Currency code required').max(3, 'Invalid currency code'),
  balance: z.number(),
  color: z.string().optional(),
  icon: z.string().optional(),
  description: z.string().max(200, 'Description too long').optional(),
  isActive: z.boolean().default(true),
});

interface AccountFormProps {
  account?: FinanceAccount;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const accountTypes = [
  { value: 'CASH', label: 'Cash', icon: Wallet, description: 'Physical cash wallet' },
  {
    value: 'BANK_CARD',
    label: 'Bank Card',
    icon: CreditCard,
    description: 'Bank account or debit/credit card',
  },
  {
    value: 'SAVINGS',
    label: 'Savings',
    icon: PiggyBank,
    description: 'Savings account or deposit',
  },
  {
    value: 'INVESTMENT',
    label: 'Investment',
    icon: TrendingUp,
    description: 'Investment portfolio or trading account',
  },
] as const;

const predefinedColors = [
  '#10B981',
  '#3B82F6',
  '#8B5CF6',
  '#F59E0B',
  '#EF4444',
  '#06B6D4',
  '#84CC16',
  '#F97316',
  '#EC4899',
  '#6B7280',
];

export function AccountForm({ account, onSuccess, onCancel }: AccountFormProps) {
  const { toast } = useToast();
  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const [selectedColor, setSelectedColor] = useState(account?.color || '#3B82F6');

  const isEditing = !!account;

  const form = useForm({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: account?.name || '',
      type: account?.type || 'BANK_CARD',
      currency: account?.currency || BASE_CURRENCY,
      balance: account?.balance ?? 0,
      color: account?.color || '#3B82F6',
      icon: account?.icon || 'card',
      description: account?.description || '',
      isActive: account?.isActive ?? true,
    },
  });

  const watchedType = form.watch('type');
  const watchedBalance = form.watch('balance');
  const watchedCurrency = form.watch('currency');

  const selectedAccountType = accountTypes.find(type => type.value === watchedType);

  const onSubmit = async (data: z.infer<typeof accountFormSchema>) => {
    try {
      const formData = {
        ...data,
        color: selectedColor,
        icon: selectedAccountType?.icon.name || 'Wallet',
      };

      if (isEditing && account) {
        await updateAccount.mutateAsync({
          id: account.id,
          ...formData,
        } as UpdateAccountData);
        toast({
          title: 'Success',
          description: 'Account updated successfully',
        });
      } else {
        await createAccount.mutateAsync(formData as CreateAccountData);
        toast({
          title: 'Success',
          description: 'Account created successfully',
        });
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
      {/* Account Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Account Name</Label>
        <Input id="name" placeholder="e.g. Main Checking Account" {...form.register('name')} />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>

      {/* Account Type */}
      <div className="space-y-3">
        <Label>Account Type</Label>
        <Select value={form.watch('type')} onValueChange={value => form.setValue('type', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {accountTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center gap-2">
                  <type.icon className="h-4 w-4" />
                  <div>
                    <div>{type.label}</div>
                    <div className="text-xs text-muted-foreground">{type.description}</div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.type && (
          <p className="text-sm text-destructive">{form.formState.errors.type.message}</p>
        )}
      </div>

      {/* Currency */}
      <div className="space-y-3">
        <Label>Currency</Label>
        <Select
          value={form.watch('currency')}
          onValueChange={value => form.setValue('currency', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(SUPPORTED_CURRENCIES).map(currency => (
              <SelectItem key={currency.code} value={currency.code}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{currency.symbol}</span>
                  <div>
                    <div>
                      {currency.code} - {currency.name}
                    </div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.currency && (
          <p className="text-sm text-destructive">{form.formState.errors.currency.message}</p>
        )}
      </div>

      {/* Initial Balance */}
      <div className="space-y-2">
        <Label htmlFor="balance">Initial Balance</Label>
        <CurrencyInput
          placeholder="0.00"
          value={watchedBalance}
          currency={watchedCurrency}
          showCurrencySelect={false}
          allowNegative={true}
          allowZero={true}
          onAmountChange={(value: number) => {
            form.setValue('balance', value);
          }}
          className="w-full"
        />
        {form.formState.errors.balance && (
          <p className="text-sm text-destructive">{form.formState.errors.balance.message}</p>
        )}
      </div>

      {/* Account Color */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <Label>Account Color</Label>
        </div>
        <div className="flex flex-wrap gap-2">
          {predefinedColors.map(color => (
            <button
              key={color}
              type="button"
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                selectedColor === color
                  ? 'border-foreground scale-110'
                  : 'border-muted hover:border-foreground/50'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => {
                setSelectedColor(color);
                form.setValue('color', color);
              }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Add any additional details about this account..."
          {...form.register('description')}
          rows={3}
        />
        {form.formState.errors.description && (
          <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
        )}
      </div>

      {/* Preview */}
      {(form.watch('name') || selectedAccountType) && (
        <div className="space-y-2">
          <Label>Preview</Label>
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: selectedColor }}
                >
                  {selectedAccountType && <selectedAccountType.icon className="h-5 w-5" />}
                </div>
                <div>
                  <div className="font-medium">{form.watch('name') || 'Account Name'}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedAccountType?.label} • {form.watch('currency')}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  {SUPPORTED_CURRENCIES[watchedCurrency]?.symbol || '€'}
                  {(watchedBalance ?? 0).toFixed(2)}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {selectedAccountType?.label}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={createAccount.isPending || updateAccount.isPending}
          className="flex-1"
        >
          {createAccount.isPending || updateAccount.isPending
            ? 'Saving...'
            : isEditing
              ? 'Update Account'
              : 'Create Account'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
