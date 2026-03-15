import { z } from 'zod';

/**
 * Schema for backup list API response.
 */
const BackupFileSchema = z.object({
  filename: z.string(),
  metadata: z
    .object({
      version: z.string(),
      timestamp: z.string(),
      totalRecords: z.number(),
    })
    .optional(),
  recordCounts: z
    .object({
      users: z.number(),
      categories: z.number(),
      trades: z.number(),
      screenshots: z.number(),
      financeAccounts: z.number(),
      transactions: z.number(),
      transactionCategories: z.number(),
      budgets: z.number(),
      budgetCategories: z.number(),
      financialGoals: z.number(),
      loans: z.number(),
    })
    .optional(),
});

export const BackupListResponseSchema = z.object({
  files: z.array(BackupFileSchema).optional().default([]),
});

export type BackupListResponse = z.infer<typeof BackupListResponseSchema>;

const BackupMetadataSchema = z.object({
  version: z.string(),
  timestamp: z.string(),
  totalRecords: z.number(),
});

export const BackupDataImportSchema = z.object({
  metadata: BackupMetadataSchema,
  users: z.array(z.unknown()),
  categories: z.array(z.unknown()),
  trades: z.array(z.unknown()),
  screenshots: z.array(z.unknown()).optional().default([]),
  financeAccounts: z.array(z.unknown()).optional().default([]),
  transactions: z.array(z.unknown()).optional().default([]),
  transactionCategories: z.array(z.unknown()).optional().default([]),
  budgets: z.array(z.unknown()).optional().default([]),
  budgetCategories: z.array(z.unknown()).optional().default([]),
  financialGoals: z.array(z.unknown()).optional().default([]),
  loans: z.array(z.unknown()).optional().default([]),
});

export type BackupDataImport = z.infer<typeof BackupDataImportSchema>;

/**
 * Validates parsed JSON as backup data. Throws ZodError if invalid.
 */
export function parseBackupFileContent(content: unknown): BackupDataImport {
  return BackupDataImportSchema.parse(content);
}
