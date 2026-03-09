import { BASE_CURRENCY } from '@/lib/currency';
import { ArrowRightLeft, Minus, Plus } from 'lucide-react';
import { z } from 'zod';

/**
 * Shared schema for add/edit transaction form.
 */
export const transactionFormSchema = z
  .object({
    accountId: z.string().min(1, 'Account is required'),
    categoryId: z.string().min(1, 'Category is required'),
    type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
    amount: z.number().positive('Amount must be positive').min(0.01, 'Minimum amount is 0.01'),
    currency: z.string().min(3).max(3).default(BASE_CURRENCY),
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

/**
 * Form value type for add/edit transaction form.
 */
export type TransactionFormInput = z.input<typeof transactionFormSchema>;
export type TransactionFormData = z.output<typeof transactionFormSchema>;

/**
 * Visual variants for transaction type selector.
 */
export const transactionTypes = [
  {
    value: 'INCOME',
    label: 'Income',
    icon: Plus,
    color: 'var(--income)',
    description: 'Money coming in',
  },
  {
    value: 'EXPENSE',
    label: 'Expense',
    icon: Minus,
    color: 'var(--expense)',
    description: 'Money going out',
  },
  {
    value: 'TRANSFER',
    label: 'Transfer',
    icon: ArrowRightLeft,
    color: 'var(--transfer)',
    description: 'Move between accounts',
  },
] as const;

/**
 * Recurrence options for recurring transactions.
 */
export const recurringPatterns = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'QUARTERLY', label: 'Quarterly' },
  { value: 'YEARLY', label: 'Yearly' },
] as const;
