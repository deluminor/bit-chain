import { z } from 'zod';

export const BackupInfoSchema = z.object({
  filename: z.string(),
  createdAt: z.string(),
  sizeMb: z.number(),
});

export type BackupInfo = z.infer<typeof BackupInfoSchema>;

export const BackupListResponseSchema = z.object({
  backups: z.array(BackupInfoSchema),
});

export type BackupListResponse = z.infer<typeof BackupListResponseSchema>;

export const CreateBackupResponseSchema = z.object({
  success: z.boolean(),
  filename: z.string(),
  createdAt: z.string(),
});

export type CreateBackupResponse = z.infer<typeof CreateBackupResponseSchema>;
