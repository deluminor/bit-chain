import { BASE_CURRENCY } from '@/lib/currency';
import { ArrowRightLeft, Minus, Plus } from 'lucide-react';
import { z } from 'zod';

const loanIdField = z
  .union([z.string().cuid(), z.literal(''), z.null()])
  .optional()
  .transform(val => (val === '' || val === undefined ? null : val));

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
    loanId: loanIdField,
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
  );

export type TransactionFormInput = z.input<typeof transactionFormSchema>;
export type TransactionFormData = z.output<typeof transactionFormSchema>;

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
