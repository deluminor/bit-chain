import { z } from 'zod';

/**
 * Transaction creation payload shared by web and mobile routes.
 */
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
  isRecurring: z.boolean().default(false),
  recurringPattern: z
    .enum(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'])
    .optional()
    .nullable(),
});

/**
 * Transaction update payload shared by web and mobile routes.
 */
export const updateTransactionSchema = createTransactionSchema.partial().extend({
  id: z.string().cuid(),
});

/**
 * Parsed and validated create transaction payload.
 */
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

/**
 * Parsed and validated update transaction payload.
 */
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
