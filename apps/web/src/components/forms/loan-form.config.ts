import { BASE_CURRENCY } from '@/lib/currency';
import { z } from 'zod';

export const loanFormSchema = z.object({
  name: z.string().min(1, 'Loan name is required').max(120, 'Loan name is too long'),
  type: z.enum(['LOAN', 'DEBT']),
  totalAmount: z.number().positive('Total amount must be positive'),
  paidAmount: z.number().min(0, 'Paid amount cannot be negative'),
  currency: z.string().min(3).max(3).optional().default(BASE_CURRENCY),
  startDate: z.date().optional(),
  dueDate: z.date().optional(),
  interestRate: z.number().min(0, 'Interest rate cannot be negative').max(100).optional(),
  lender: z.string().max(120).optional(),
  notes: z.string().max(1000).optional(),
});

export type LoanFormData = z.infer<typeof loanFormSchema>;

export const loanTypeOptions = [
  { value: 'LOAN', label: 'Loan (I owe)' },
  { value: 'DEBT', label: 'Debt (owed to me)' },
] as const;
