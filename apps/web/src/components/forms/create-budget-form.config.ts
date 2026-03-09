import { BASE_CURRENCY } from '@/lib/currency';
import { Calendar, Clock, DollarSign, Target } from 'lucide-react';
import { z } from 'zod';

export const budgetFormSchema = z.object({
  name: z.string().min(1, 'Budget name is required').max(100, 'Budget name is too long'),
  period: z.enum(['WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']),
  startDate: z.date(),
  endDate: z.date(),
  currency: z.string().min(3).max(3).default(BASE_CURRENCY),
  totalPlanned: z.coerce
    .number()
    .positive('Total planned amount must be positive')
    .min(1, 'Minimum amount is 1'),
  isTemplate: z.boolean().default(false),
  templateName: z.string().optional(),
  categories: z
    .array(
      z.object({
        categoryId: z.string(),
        planned: z.coerce.number().positive('Category amount must be positive'),
      }),
    )
    .default([]),
});

export type BudgetFormInput = z.input<typeof budgetFormSchema>;
export type BudgetFormData = z.output<typeof budgetFormSchema>;

export const budgetPeriods = [
  {
    value: 'WEEKLY',
    label: 'Weekly',
    icon: Clock,
    description: 'Budget for one week',
  },
  {
    value: 'MONTHLY',
    label: 'Monthly',
    icon: Calendar,
    description: 'Budget for one month',
  },
  {
    value: 'QUARTERLY',
    label: 'Quarterly',
    icon: Target,
    description: 'Budget for 3 months',
  },
  {
    value: 'YEARLY',
    label: 'Yearly',
    icon: DollarSign,
    description: 'Budget for one year',
  },
] as const;
