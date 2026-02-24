import { z } from 'zod';

// ---------------------------------------------------------------------------
// Mobile Transactions
// Used by: GET /api/mobile/transactions
// ---------------------------------------------------------------------------

export const TransactionTypeSchema = z.enum(['INCOME', 'EXPENSE', 'TRANSFER']);
export type TransactionType = z.infer<typeof TransactionTypeSchema>;

/** Single transaction item in the list */
export const TransactionListItemSchema = z.object({
  id: z.string(),
  amount: z.number(),
  type: TransactionTypeSchema,
  description: z.string().nullable(),
  date: z.string().datetime(),
  currency: z.string(),
  accountId: z.string(),
  accountName: z.string(),
  categoryId: z.string().nullable(),
  categoryName: z.string().nullable(),
  /** Hex color of the category, e.g. "#22c55e" */
  categoryColor: z.string().nullable(),
});

export type TransactionListItem = z.infer<typeof TransactionListItemSchema>;

/** Period statistics per currency included in transactions response */
export const TransactionsPeriodStatsSchema = z.array(
  z.object({
    income: z.number(),
    expenses: z.number(),
    netFlow: z.number(),
    /** ISO currency code used for aggregation */
    currency: z.string(),
  }),
);

export type TransactionsPeriodStats = z.infer<typeof TransactionsPeriodStatsSchema>;

/** GET /api/mobile/transactions — response data */
export const TransactionsListResponseSchema = z.object({
  transactions: z.array(TransactionListItemSchema),
  stats: TransactionsPeriodStatsSchema,
  transactionCount: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  hasMore: z.boolean(),
});

export type TransactionsListResponse = z.infer<typeof TransactionsListResponseSchema>;

/** Query params for GET /api/mobile/transactions */
export const TransactionsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(50).optional().default(20),
  type: TransactionTypeSchema.optional(),
  accountId: z.string().optional(),
  categoryId: z.string().optional(),
  search: z.string().trim().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});

export type TransactionsQuery = z.infer<typeof TransactionsQuerySchema>;
