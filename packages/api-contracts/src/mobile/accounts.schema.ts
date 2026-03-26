import { z } from 'zod';

// ---------------------------------------------------------------------------
// Mobile Accounts
// Used by: GET /api/mobile/accounts
// ---------------------------------------------------------------------------

export const AccountTypeSchema = z.enum(['BANK_CARD', 'CASH', 'INVESTMENT', 'CRYPTO', 'SAVINGS']);

export type AccountType = z.infer<typeof AccountTypeSchema>;

/** Single account item in the accounts list */
export const AccountListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: AccountTypeSchema,
  balance: z.number(),
  currency: z.string(),
  description: z.string().nullable(),
  isActive: z.boolean(),
  transactionCount: z.number().int().nonnegative(),
  /** Hex color assigned to the account, e.g. "#3b82f6" */
  color: z.string().nullable(),
  /** Whether this account is synced via Monobank integration */
  isMonobank: z.boolean(),
});

export type AccountListItem = z.infer<typeof AccountListItemSchema>;

/** GET /api/mobile/accounts — response data */
export const AccountsListResponseSchema = z.object({
  accounts: z.array(AccountListItemSchema),
  /** Total balance across all accounts, converted to EUR */
  totalBalance: z.number(),
  totalAccounts: z.number().int().nonnegative(),
  activeAccounts: z.number().int().nonnegative(),
});

export type AccountsListResponse = z.infer<typeof AccountsListResponseSchema>;

/** GET /api/mobile/accounts/:id — response data */
export const AccountDetailSchema = AccountListItemSchema.extend({
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type AccountDetail = z.infer<typeof AccountDetailSchema>;

/** PATCH /api/mobile/accounts — input */
export const UpdateMobileAccountInputSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(50).optional(),
  balance: z.number().optional(),
  description: z.string().trim().max(200).nullable().optional(),
  color: z.string().trim().nullable().optional(),
});

export type UpdateMobileAccountInput = z.infer<typeof UpdateMobileAccountInputSchema>;

/** PATCH /api/mobile/accounts — response data */
export const UpdateMobileAccountResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: AccountTypeSchema,
  balance: z.number(),
  currency: z.string(),
  description: z.string().nullable(),
  isActive: z.boolean(),
  color: z.string().nullable(),
});

export type UpdateMobileAccountResponse = z.infer<typeof UpdateMobileAccountResponseSchema>;
