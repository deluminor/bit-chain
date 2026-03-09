import { z } from 'zod';

const budgetPeriodSchema = z.enum(['MONTHLY', 'YEARLY']);

/**
 * Budget category allocation payload.
 */
export const budgetCategoryInputSchema = z.object({
  categoryId: z.string().min(1, 'Category ID is required'),
  planned: z.coerce.number(),
});

/**
 * Shared budget creation payload for finance and mobile routes.
 */
export const createBudgetInputSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  period: budgetPeriodSchema,
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  currency: z.string().min(3).max(3).optional().default('UAH'),
  totalPlanned: z.coerce.number(),
  categories: z.array(budgetCategoryInputSchema).optional(),
  isTemplate: z.boolean().optional().default(false),
  templateName: z.string().nullable().optional(),
  autoApply: z.boolean().optional().default(false),
});

/**
 * Shared budget update payload for finance and mobile routes.
 */
export const updateBudgetInputSchema = createBudgetInputSchema
  .partial()
  .extend({
    id: z.string().min(1, 'Budget ID is required'),
    isActive: z.boolean().optional(),
  })
  .refine(data => data.id.length > 0, {
    message: 'Budget ID is required',
    path: ['id'],
  });

/**
 * Query payload for deleting a budget.
 */
export const deleteBudgetInputSchema = z.object({
  id: z.string().min(1, 'Budget ID is required'),
});

/**
 * Parsed create budget payload.
 */
export type CreateBudgetInput = z.infer<typeof createBudgetInputSchema>;

/**
 * Parsed update budget payload.
 */
export type UpdateBudgetInput = z.infer<typeof updateBudgetInputSchema>;
