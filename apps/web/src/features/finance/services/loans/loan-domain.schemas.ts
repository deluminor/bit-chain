import { z } from 'zod';

const loanTypeSchema = z.enum(['LOAN', 'DEBT']);

const nullableDateStringSchema = z
  .union([z.string().datetime(), z.null()])
  .transform(value => (value ? new Date(value) : null));

/**
 * Shared create loan payload.
 */
export const createLoanInputSchema = z.object({
  name: z.string().min(1).max(120),
  type: loanTypeSchema,
  totalAmount: z.number().positive(),
  paidAmount: z.number().min(0).optional(),
  currency: z.string().min(3).max(3).optional(),
  startDate: nullableDateStringSchema.optional(),
  dueDate: nullableDateStringSchema.optional(),
  interestRate: z.number().min(0).max(100).nullable().optional(),
  lender: z.string().max(120).optional(),
  notes: z.string().max(1000).optional(),
});

/**
 * Shared update loan payload.
 */
export const updateLoanInputSchema = createLoanInputSchema.partial().extend({
  id: z.string().cuid(),
});

/**
 * Query payload for web loans endpoint.
 */
export const webLoansQuerySchema = z.object({
  includeInactive: z.boolean().optional().default(false),
});

/**
 * Query payload for mobile loans endpoint.
 */
export const mobileLoansQuerySchema = z.object({
  showPaid: z.boolean().optional().default(false),
});

/**
 * Query payload for deleting loan.
 */
export const loanDeleteInputSchema = z.object({
  id: z.string().cuid('Loan ID is required'),
});

export type CreateLoanInput = z.infer<typeof createLoanInputSchema>;
export type UpdateLoanInput = z.infer<typeof updateLoanInputSchema>;
export type WebLoansQuery = z.infer<typeof webLoansQuerySchema>;
export type MobileLoansQuery = z.infer<typeof mobileLoansQuerySchema>;
