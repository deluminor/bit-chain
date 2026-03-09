import type {
  ApiResponse,
  BackupListResponse,
  CreateBackupResponse,
} from '@bit-chain/api-contracts';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '~/src/lib/api';
import { queryClient } from '~/src/lib/query';

export const BACKUP_QUERY_KEY = ['backup', 'list'] as const;

export function useBackupList() {
  return useQuery({
    queryKey: BACKUP_QUERY_KEY,
    queryFn: async (): Promise<BackupListResponse> => {
      const { data } = await api.get<ApiResponse<BackupListResponse>>('/backup?action=list');
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
  });
}

export function useCreateBackup() {
  return useMutation({
    mutationFn: async (): Promise<CreateBackupResponse> => {
      const { data } = await api.post<ApiResponse<CreateBackupResponse>>('/backup', {
        action: 'create',
      });
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BACKUP_QUERY_KEY });
    },
  });
}

export async function exportBackupData(): Promise<string> {
  const { data } = await api.get<unknown>('/backup?action=export');
  return JSON.stringify(data, null, 2);
}
