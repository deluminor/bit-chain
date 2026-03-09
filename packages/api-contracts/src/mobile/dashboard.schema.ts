import { z } from 'zod';
/** Balance per currency across all active accounts */
export const CurrencyBalanceSchema = z.object({
  currency: z.string(),
  totalBalance: z.number(),
  accountCount: z.number().int().nonnegative(),
});

export type CurrencyBalance = z.infer<typeof CurrencyBalanceSchema>;

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

export const DashboardMonobankStatusSchema = z.object({
  connected: z.boolean(),
  lastSyncAt: z.string().datetime().nullable(),
  enabledAccountCount: z.number().int().nonnegative(),
});

export type DashboardMonobankStatus = z.infer<typeof DashboardMonobankStatusSchema>;

export const DashboardPeriodStatsSchema = z.array(
  z.object({
    income: z.number(),
    expenses: z.number(),
    netFlow: z.number(),
    currency: z.string(),
  }),
);

export type DashboardPeriodStats = z.infer<typeof DashboardPeriodStatsSchema>;

export const DashboardSummarySchema = z.object({
  balances: z.array(CurrencyBalanceSchema),
  totalAccounts: z.number().int().nonnegative(),
  recentTransactions: z.array(RecentTransactionSchema),
  monobank: DashboardMonobankStatusSchema,
  periodStats: DashboardPeriodStatsSchema.nullable().optional(),
  generatedAt: z.string().datetime(),
});

export type DashboardSummary = z.infer<typeof DashboardSummarySchema>;

export const DashboardHistoryPointSchema = z.object({
  date: z.string().datetime(),
  balances: z.record(z.string(), z.number()),
  totalEUR: z.number(),
});

export type DashboardHistoryPoint = z.infer<typeof DashboardHistoryPointSchema>;

export const DashboardHistoryResponseSchema = z.object({
  history: z.array(DashboardHistoryPointSchema),
  generatedAt: z.string().datetime(),
});

export type DashboardHistoryResponse = z.infer<typeof DashboardHistoryResponseSchema>;

export const DashboardExpenseTrendPointSchema = z.object({
  day: z.number().int().positive(),
  label: z.string(),
  currentExpenseEUR: z.number(),
  previousExpenseEUR: z.number(),
});

export type DashboardExpenseTrendPoint = z.infer<typeof DashboardExpenseTrendPointSchema>;

export const DashboardExpensesTrendResponseSchema = z.object({
  points: z.array(DashboardExpenseTrendPointSchema),
  currentMonthLabel: z.string(),
  previousMonthLabel: z.string(),
  comparedDays: z.number().int().positive(),
  generatedAt: z.string().datetime(),
});

export type DashboardExpensesTrendResponse = z.infer<typeof DashboardExpensesTrendResponseSchema>;
