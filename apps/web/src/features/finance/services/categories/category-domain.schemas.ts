import { z } from 'zod';

const webCategoryTypeSchema = z.enum(['INCOME', 'EXPENSE', 'TRANSFER']);
const mobileCategoryTypeSchema = z.enum(['INCOME', 'EXPENSE']);

/**
 * Query params for web categories endpoint.
 */
export const webCategoriesQuerySchema = z.object({
  type: webCategoryTypeSchema.optional(),
  includeInactive: z.boolean().optional().default(false),
  hierarchical: z.boolean().optional().default(false),
});

/**
 * Query params for mobile categories endpoint.
 */
export const mobileCategoriesQuerySchema = z.object({
  type: mobileCategoryTypeSchema.optional(),
});

/**
 * Create payload for web categories endpoint.
 */
export const createWebCategoryInputSchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Category name too long'),
  type: webCategoryTypeSchema,
  parentId: z.string().cuid().optional().nullable(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  icon: z.string().min(1, 'Icon is required'),
  isDefault: z.boolean().default(false),
});

/**
 * Update payload for web categories endpoint.
 */
export const updateWebCategoryInputSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1).max(50).optional(),
  type: webCategoryTypeSchema.optional(),
  parentId: z.string().cuid().optional().nullable(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i)
    .optional(),
  icon: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
});

/**
 * Create payload for mobile categories endpoint.
 */
export const createMobileCategoryInputSchema = z.object({
  name: z.string().min(1).max(50),
  type: mobileCategoryTypeSchema,
  color: z.string().regex(/^#[0-9A-F]{6}$/i),
  icon: z.string().min(1).optional(),
  isLoanRepayment: z.boolean().optional(),
});

/**
 * Update payload for mobile categories endpoint.
 */
export const updateMobileCategoryInputSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1).max(50).optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i)
    .optional(),
  icon: z.string().min(1).optional(),
  isLoanRepayment: z.boolean().optional(),
});

/**
 * Category id query payload.
 */
export const categoryDeleteInputSchema = z.object({
  id: z.string().cuid('Category ID is required'),
});

export type WebCategoriesQuery = z.infer<typeof webCategoriesQuerySchema>;
export type MobileCategoriesQuery = z.infer<typeof mobileCategoriesQuerySchema>;
export type CreateWebCategoryInput = z.infer<typeof createWebCategoryInputSchema>;
export type UpdateWebCategoryInput = z.infer<typeof updateWebCategoryInputSchema>;
export type CreateMobileCategoryInput = z.infer<typeof createMobileCategoryInputSchema>;
export type UpdateMobileCategoryInput = z.infer<typeof updateMobileCategoryInputSchema>;
