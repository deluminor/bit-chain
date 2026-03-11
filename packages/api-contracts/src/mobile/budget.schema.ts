import { z } from 'zod';
import { CategoryListItemSchema } from './categories.schema';

export const budgetCategorySchema = z.object({
  id: z.string().cuid(),
  budgetId: z.string().cuid(),
  categoryId: z.string().cuid(),
  planned: z.number().positive(),
  actual: z.number().default(0),
  actualBase: z.number().default(0),
  plannedBase: z.number().default(0),
  category: CategoryListItemSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const budgetSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  name: z.string().min(1, 'Name is required'),
  period: z.enum(['MONTHLY', 'YEARLY', 'CUSTOM']),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  currency: z.string(),
  totalPlanned: z.number().positive(),
  isActive: z.boolean().default(true),
  isTemplate: z.boolean().default(false),
  templateName: z.string().nullable(),
  autoApply: z.boolean().default(false),
  categories: z.array(budgetCategorySchema),

  // Computed fields returned by backend
  totalActual: z.number().default(0),
  totalActualBase: z.number().default(0),
  totalPlannedBase: z.number().default(0),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const budgetSummarySchema = z.object({
  total: z.number(),
  active: z.number(),
  totalPlanned: z.number(),
  totalActual: z.number(),
  totalPlannedBase: z.number(),
  totalActualBase: z.number(),
});

export const getBudgetsResponseSchema = z.object({
  budgets: z.array(budgetSchema),
  summary: budgetSummarySchema,
});

export type Budget = z.infer<typeof budgetSchema>;
export type BudgetCategory = z.infer<typeof budgetCategorySchema>;
export type BudgetSummary = z.infer<typeof budgetSummarySchema>;
export type GetBudgetsResponse = z.infer<typeof getBudgetsResponseSchema>;

export const createBudgetSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  period: z.enum(['MONTHLY', 'YEARLY', 'CUSTOM']),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  currency: z.string().default('EUR'),
  totalPlanned: z.number().nonnegative('Total planned must be zero or positive'),
  categories: z
    .array(
      z.object({
        categoryId: z.string().cuid('Invalid category ID'),
        planned: z.number().nonnegative('Planned amount must be zero or positive'),
      }),
    )
    .default([]),
  isTemplate: z.boolean().optional(),
  templateName: z.string().optional().nullable(),
  autoApply: z.boolean().optional(),
});

export type CreateBudgetRequest = z.infer<typeof createBudgetSchema>;

export const updateBudgetSchema = createBudgetSchema.partial().extend({
  id: z.string().cuid(),
  isActive: z.boolean().optional(),
});

export type UpdateBudgetRequest = z.infer<typeof updateBudgetSchema>;
