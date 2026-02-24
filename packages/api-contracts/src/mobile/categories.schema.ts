import { z } from 'zod';

// ---------------------------------------------------------------------------
// Mobile Categories
// Used by: GET /api/mobile/categories
// ---------------------------------------------------------------------------

export const CategoryTypeSchema = z.enum(['INCOME', 'EXPENSE']);
export type CategoryType = z.infer<typeof CategoryTypeSchema>;

/** Single category item in the list */
export const CategoryListItemSchema = z.object({
  id:               z.string(),
  name:             z.string(),
  type:             CategoryTypeSchema,
  /** Hex color, e.g. "#22c55e" */
  color:            z.string(),
  isDefault:        z.boolean(),
  transactionCount: z.number().int().nonnegative(),
});

export type CategoryListItem = z.infer<typeof CategoryListItemSchema>;

/** GET /api/mobile/categories — response data */
export const CategoriesListResponseSchema = z.object({
  categories:   z.array(CategoryListItemSchema),
  incomeCount:  z.number().int().nonnegative(),
  expenseCount: z.number().int().nonnegative(),
});

export type CategoriesListResponse = z.infer<typeof CategoriesListResponseSchema>;
