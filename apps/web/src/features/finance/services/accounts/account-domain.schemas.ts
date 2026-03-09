import { z } from 'zod';

export const accountTypeSchema = z.enum(['CASH', 'BANK_CARD', 'SAVINGS', 'INVESTMENT']);

export const webAccountsQuerySchema = z.object({
  includeInactive: z.boolean().default(false),
});

export const createWebAccountInputSchema = z.object({
  name: z.string().trim().min(1, 'Account name is required').max(50, 'Account name too long'),
  type: accountTypeSchema,
  currency: z.string().trim().length(3, 'Invalid currency code'),
  balance: z.number().default(0),
  color: z.string().trim().optional(),
  icon: z.string().trim().optional(),
  description: z.string().trim().optional(),
  isActive: z.boolean().default(true),
});

export const updateWebAccountInputSchema = createWebAccountInputSchema.partial().extend({
  id: z.string().trim().min(1, 'Account ID is required'),
});

export const deleteWebAccountInputSchema = z.object({
  id: z.string().trim().min(1, 'Account ID is required'),
  force: z.boolean().default(false),
});

export type WebAccountsQuery = z.infer<typeof webAccountsQuerySchema>;
export type CreateWebAccountInput = z.infer<typeof createWebAccountInputSchema>;
export type UpdateWebAccountInput = z.infer<typeof updateWebAccountInputSchema>;
export type DeleteWebAccountInput = z.infer<typeof deleteWebAccountInputSchema>;
