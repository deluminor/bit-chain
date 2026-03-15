import type { BackupFile } from '@/components/backup/backup.types';
import { BackupListResponseSchema } from '@/features/backup/backup.schema';
import axiosInstance from '@/lib/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const backupKeys = {
  all: ['backup'] as const,
  list: (userId: string) => [...backupKeys.all, 'list', userId] as const,
};

export async function fetchBackupList(): Promise<BackupFile[]> {
  const { data } = await axiosInstance.get('/backup?action=list');
  const parsed = BackupListResponseSchema.parse(data);
  return parsed.files;
}

export async function createBackup(userId: string): Promise<{ success: boolean }> {
  const { data } = await axiosInstance.post<{ success: boolean }>('/backup', {
    action: 'create',
    userId,
  });
  return data;
}

export async function exportBackup(userId: string): Promise<Blob> {
  const { data } = await axiosInstance.get<Blob>(`/backup?action=export&userId=${userId}`, {
    responseType: 'blob',
  });
  return data;
}

export async function importBackup(
  userId: string,
  backupData: unknown,
  overwrite: boolean,
): Promise<{ success: boolean }> {
  const { data } = await axiosInstance.post<{ success: boolean }>('/backup', {
    action: 'import',
    data: backupData,
    userId,
    overwrite,
  });
  return data;
}

export async function restoreBackup(
  userId: string,
  filename: string,
  overwrite: boolean,
): Promise<{ success: boolean }> {
  const { data } = await axiosInstance.post<{ success: boolean }>('/backup', {
    action: 'restore',
    filename,
    userId,
    overwrite,
  });
  return data;
}

export async function deleteBackup(filename: string): Promise<{ success: boolean }> {
  const { data } = await axiosInstance.post<{ success: boolean }>('/backup', {
    action: 'delete',
    filename,
  });
  return data;
}

export function useBackupList(userId: string | undefined) {
  return useQuery({
    queryKey: backupKeys.list(userId ?? ''),
    queryFn: fetchBackupList,
    enabled: !!userId,
  });
}

function requireUserId(userId: string | undefined): asserts userId is string {
  if (!userId) {
    throw new Error('User ID required for backup operation');
  }
}

export function useCreateBackup(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      requireUserId(userId);
      return createBackup(userId);
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: backupKeys.list(userId) });
      }
    },
  });
}

export function useImportBackup(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, overwrite }: { data: unknown; overwrite: boolean }) => {
      requireUserId(userId);
      return importBackup(userId, data, overwrite);
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: backupKeys.list(userId) });
      }
    },
  });
}

export function useRestoreBackup(userId: string | undefined) {
  return useMutation({
    mutationFn: ({ filename, overwrite }: { filename: string; overwrite: boolean }) => {
      requireUserId(userId);
      return restoreBackup(userId, filename, overwrite);
    },
  });
}

export function useDeleteBackup(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (filename: string) => deleteBackup(filename),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: backupKeys.list(userId) });
      }
    },
  });
}

export function useExportBackup() {
  return useMutation({
    mutationFn: (userId: string) => exportBackup(userId),
  });
}
