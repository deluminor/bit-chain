import { z } from 'zod';

export const LoanItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['LOAN', 'DEBT']),
  totalAmount: z.number(),
  paidAmount: z.number(),
  currency: z.string(),
  startDate: z.string().nullable(),
  dueDate: z.string().nullable(),
  interestRate: z.number().nullable(),
  lender: z.string().nullable(),
  notes: z.string().nullable(),
  createdAt: z.string(),
});

export type LoanItem = z.infer<typeof LoanItemSchema>;

export const LoansSummarySchema = z.object({
  total: z.number(),
  active: z.number(),
  loanCount: z.number(),
  debtCount: z.number(),
  totalOutstandingBase: z.number(),
});

export type LoansSummary = z.infer<typeof LoansSummarySchema>;

export const LoansListResponseSchema = z.object({
  loans: z.array(LoanItemSchema),
  summary: LoansSummarySchema,
});

export type LoansListResponse = z.infer<typeof LoansListResponseSchema>;

export const CreateLoanRequestSchema = z.object({
  name: z.string().min(1).max(120),
  type: z.enum(['LOAN', 'DEBT']),
  totalAmount: z.number().positive(),
  currency: z.string().min(3).max(3).optional(),
  paidAmount: z.number().min(0).optional(),
  startDate: z.string().datetime().nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
  interestRate: z.number().min(0).max(100).nullable().optional(),
  lender: z.string().max(120).optional(),
  notes: z.string().max(1000).optional(),
});

export type CreateLoanRequest = z.infer<typeof CreateLoanRequestSchema>;

export const UpdateLoanRequestSchema = CreateLoanRequestSchema.partial().extend({
  id: z.string().cuid(),
});

export type UpdateLoanRequest = z.infer<typeof UpdateLoanRequestSchema>;
