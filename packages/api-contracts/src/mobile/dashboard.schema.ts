import { z } from 'zod';

// ---------------------------------------------------------------------------
// Mobile Dashboard Summary
// Used by: GET /api/mobile/dashboard/summary
// Single aggregated endpoint replaces ≥10 separate web requests.
// ---------------------------------------------------------------------------

/** Balance per currency across all active accounts */
export const CurrencyBalanceSchema = z.object({
  currency: z.string(),
  totalBalance: z.number(),
  accountCount: z.number().int().nonnegative(),
});

export type CurrencyBalance = z.infer<typeof CurrencyBalanceSchema>;

/** Recent transaction item for dashboard preview */
export const RecentTransactionSchema = z.object({
  id: z.string(),
  amount: z.number(),
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
  description: z.string().nullable(),
  date: z.string().datetime(),
  currency: z.string(),
  accountName: z.string(),
  categoryName: z.string().nullable(),
});

export type RecentTransaction = z.infer<typeof RecentTransactionSchema>;

/** Monobank integration status summary for dashboard */
export const DashboardMonobankStatusSchema = z.object({
  connected: z.boolean(),
  lastSyncAt: z.string().datetime().nullable(),
  enabledAccountCount: z.number().int().nonnegative(),
});

export type DashboardMonobankStatus = z.infer<typeof DashboardMonobankStatusSchema>;

/** Current-period financial stats (this month) for the dashboard overview */
export const DashboardPeriodStatsSchema = z.array(
  z.object({
    income: z.number(),
    expenses: z.number(),
    netFlow: z.number(),
    /** ISO currency code used for all aggregations */
    currency: z.string(),
  }),
);

export type DashboardPeriodStats = z.infer<typeof DashboardPeriodStatsSchema>;

/** GET /api/mobile/dashboard/summary — response data */
export const DashboardSummarySchema = z.object({
  /** Balance totals grouped by currency */
  balances: z.array(CurrencyBalanceSchema),
  /** Total number of active finance accounts */
  totalAccounts: z.number().int().nonnegative(),
  /** Last 5 transactions across all accounts */
  recentTransactions: z.array(RecentTransactionSchema),
  /** Monobank integration quick status */
  monobank: DashboardMonobankStatusSchema,
  /**
   * Current-period (this month) income/expense stats.
   * Optional for backwards compatibility — added in API v2.
   */
  periodStats: DashboardPeriodStatsSchema.nullable().optional(),
  /** Server timestamp of the response (ISO 8601) */
  generatedAt: z.string().datetime(),
});

export type DashboardSummary = z.infer<typeof DashboardSummarySchema>;

/** GET /api/mobile/dashboard/history — response data */
export const DashboardHistoryPointSchema = z.object({
  date: z.string().datetime(),
  balances: z.record(z.string(), z.number()),
});

export type DashboardHistoryPoint = z.infer<typeof DashboardHistoryPointSchema>;

export const DashboardHistoryResponseSchema = z.object({
  history: z.array(DashboardHistoryPointSchema),
  generatedAt: z.string().datetime(),
});

export type DashboardHistoryResponse = z.infer<typeof DashboardHistoryResponseSchema>;
