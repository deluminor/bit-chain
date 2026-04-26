import { z } from 'zod';

export const createTransactionSchema = z.object({
  accountId: z.string().cuid('Invalid account ID'),
  categoryId: z.string().cuid('Invalid category ID').optional(),
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().min(3).max(3).optional(),
  description: z.string().max(200).optional(),
  date: z
    .string()
    .datetime()
    .transform(str => new Date(str))
    .optional(),
  tags: z.array(z.string()).default([]),
  transferToId: z.string().cuid().optional(),
  transferAmount: z.number().positive().optional(),
  transferCurrency: z.string().min(3).max(3).optional(),
  loanId: z.string().cuid().optional().nullable(),
});

export const updateTransactionSchema = createTransactionSchema.partial().extend({
  id: z.string().cuid(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
