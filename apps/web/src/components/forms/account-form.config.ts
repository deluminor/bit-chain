import type { FinanceAccount } from '@/features/finance/queries/accounts';
import { CreditCard, PiggyBank, TrendingUp, Wallet } from 'lucide-react';
import { z } from 'zod';

export const accountFormSchema = z.object({
  name: z.string().min(1, 'Account name is required').max(50, 'Account name too long'),
  type: z.enum(['CASH', 'BANK_CARD', 'SAVINGS', 'INVESTMENT']),
  currency: z.string().min(3, 'Currency code required').max(3, 'Invalid currency code'),
  balance: z.number(),
  color: z.string().optional(),
  icon: z.string().optional(),
  description: z.string().max(200, 'Description too long').optional(),
  isActive: z.boolean().default(true),
});

export type AccountFormData = z.infer<typeof accountFormSchema>;
export type AccountType = FinanceAccount['type'];

export const accountTypes = [
  {
    value: 'CASH',
    label: 'Cash',
    icon: Wallet,
    iconName: 'Wallet',
    description: 'Physical cash wallet',
  },
  {
    value: 'BANK_CARD',
    label: 'Bank Card',
    icon: CreditCard,
    iconName: 'CreditCard',
    description: 'Bank account or debit/credit card',
  },
  {
    value: 'SAVINGS',
    label: 'Savings',
    icon: PiggyBank,
    iconName: 'PiggyBank',
    description: 'Savings account or deposit',
  },
  {
    value: 'INVESTMENT',
    label: 'Investment',
    icon: TrendingUp,
    iconName: 'TrendingUp',
    description: 'Investment portfolio or trading account',
  },
] as const;

export const predefinedAccountColors = [
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
] as const;
