import { z } from 'zod';

const numericInputSchema = z.preprocess(
  value => {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) {
        return value;
      }
      return Number(trimmed);
    }

    return value;
  },
  z.number({ invalid_type_error: 'Expected a number' }).finite(),
);

const positiveAmountSchema = numericInputSchema.refine(value => value > 0, {
  message: 'Amount must be positive',
});

const nonNegativeAmountSchema = numericInputSchema.refine(value => value >= 0, {
  message: 'Amount cannot be negative',
});

const optionalDeadlineSchema = z.string().trim().min(1).optional().nullable();

export const createWebGoalInputSchema = z.object({
  name: z.string().trim().min(1, 'Goal name is required'),
  description: z.string().trim().optional().nullable(),
  targetAmount: positiveAmountSchema,
  currentAmount: nonNegativeAmountSchema.optional().default(0),
  currency: z.string().trim().min(3).max(10).default('UAH'),
  deadline: optionalDeadlineSchema,
  color: z.string().trim().min(1).default('#10B981'),
  icon: z.string().trim().min(1).default('🎯'),
});

export const updateWebGoalInputSchema = z.object({
  id: z.string().trim().min(1, 'Goal ID is required'),
  name: z.string().trim().min(1).optional(),
  description: z.string().trim().optional().nullable(),
  targetAmount: positiveAmountSchema.optional(),
  currentAmount: nonNegativeAmountSchema.optional(),
  currency: z.string().trim().min(3).max(10).optional(),
  deadline: optionalDeadlineSchema,
  color: z.string().trim().min(1).optional(),
  icon: z.string().trim().min(1).optional(),
  isActive: z.boolean().optional(),
});

export const createMobileGoalInputSchema = z.object({
  name: z.string().trim().min(1, 'Goal name is required'),
  description: z.string().trim().optional().nullable(),
  targetAmount: positiveAmountSchema,
  currentAmount: nonNegativeAmountSchema.optional(),
  currency: z.string().trim().min(3).max(10).optional(),
  deadline: optionalDeadlineSchema,
  color: z.string().trim().min(1).optional(),
  icon: z.string().trim().min(1).optional(),
});

export const updateMobileGoalInputSchema = z.object({
  id: z.string().trim().min(1, 'Goal ID is required'),
  name: z.string().trim().min(1).optional(),
  description: z.string().trim().optional().nullable(),
  targetAmount: positiveAmountSchema.optional(),
  currentAmount: nonNegativeAmountSchema.optional(),
  currency: z.string().trim().min(3).max(10).optional(),
  deadline: optionalDeadlineSchema,
  color: z.string().trim().min(1).optional(),
  icon: z.string().trim().min(1).optional(),
  isActive: z.boolean().optional(),
});

export const goalDeleteInputSchema = z.object({
  id: z.string().trim().min(1, 'Goal ID is required'),
});

export type CreateWebGoalInput = z.infer<typeof createWebGoalInputSchema>;
export type UpdateWebGoalInput = z.infer<typeof updateWebGoalInputSchema>;
export type CreateMobileGoalInput = z.infer<typeof createMobileGoalInputSchema>;
export type UpdateMobileGoalInput = z.infer<typeof updateMobileGoalInputSchema>;
