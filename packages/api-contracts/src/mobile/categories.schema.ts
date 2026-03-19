import { z } from 'zod';

export const CategoryTypeSchema = z.enum(['INCOME', 'EXPENSE']);
export type CategoryType = z.infer<typeof CategoryTypeSchema>;

/** Single category item in the list */
export const CategoryListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: CategoryTypeSchema,
  color: z.string(),
  /** Optional emoji icon, e.g. "🍔" */
  icon: z.string().nullable().optional(),
  isDefault: z.boolean(),
  isLoanRepayment: z.boolean().optional(),
  transactionCount: z.number().int().nonnegative(),
});

export type CategoryListItem = z.infer<typeof CategoryListItemSchema>;

/** GET /api/mobile/categories — response data */
export const CategoriesListResponseSchema = z.object({
  categories: z.array(CategoryListItemSchema),
  incomeCount: z.number().int().nonnegative(),
  expenseCount: z.number().int().nonnegative(),
});

export type CategoriesListResponse = z.infer<typeof CategoriesListResponseSchema>;

export const CreateCategoryRequestSchema = z.object({
  name: z.string().min(1).max(50),
  type: CategoryTypeSchema,
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  icon: z.string().min(1).optional(),
  isLoanRepayment: z.boolean().optional(),
});

export type CreateCategoryRequest = z.infer<typeof CreateCategoryRequestSchema>;

export const UpdateCategoryRequestSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(50).optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  icon: z.string().min(1).optional(),
  isLoanRepayment: z.boolean().optional(),
});

export type UpdateCategoryRequest = z.infer<typeof UpdateCategoryRequestSchema>;
