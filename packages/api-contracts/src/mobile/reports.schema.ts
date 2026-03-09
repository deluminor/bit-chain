import { z } from 'zod';

export const ReportCategoryItemSchema = z.object({
  name: z.string(),
  type: z.enum(['INCOME', 'EXPENSE']),
  total: z.number(),
  count: z.number(),
  percentage: z.number(),
  color: z.string().nullable(),
});

export type ReportCategoryItem = z.infer<typeof ReportCategoryItemSchema>;

export const ReportTransactionItemSchema = z.object({
  id: z.string(),
  date: z.string(),
  amount: z.number(),
  currency: z.string(),
  amountBase: z.number(),
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
  description: z.string().nullable(),
  categoryName: z.string().nullable(),
  accountName: z.string(),
});

export type ReportTransactionItem = z.infer<typeof ReportTransactionItemSchema>;

export const ReportResponseSchema = z.object({
  dateFrom: z.string(),
  dateTo: z.string(),
  baseCurrency: z.string(),
  totalIncome: z.number(),
  totalExpenses: z.number(),
  netFlow: z.number(),
  transactionCount: z.number(),
  byCategory: z.array(ReportCategoryItemSchema),
  topTransactions: z.array(ReportTransactionItemSchema),
});

export type ReportResponse = z.infer<typeof ReportResponseSchema>;
