'use client';

import { parseBackupFileContent } from '@/features/backup/backup.schema';
import {
  useBackupList,
  useCreateBackup,
  useDeleteBackup,
  useExportBackup,
  useImportBackup,
  useRestoreBackup,
} from '@/features/backup/queries/backup';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { useCallback, useState } from 'react';
import { ZodError } from 'zod';
import { BackupActionsCard } from './BackupActionsCard';
import { BackupHistoryCard } from './BackupHistoryCard';
import { BackupImportDialog } from './BackupImportDialog';

export function BackupManager() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { toast } = useToast();

  const { data: backupFiles = [], isLoading: isListLoading, refetch } = useBackupList(userId);
  const createBackupMutation = useCreateBackup(userId);
  const exportBackupMutation = useExportBackup();
  const importBackupMutation = useImportBackup(userId);
  const restoreBackupMutation = useRestoreBackup(userId);
  const deleteBackupMutation = useDeleteBackup(userId);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);

  const isLoading =
    createBackupMutation.isPending ||
    exportBackupMutation.isPending ||
    importBackupMutation.isPending ||
    restoreBackupMutation.isPending ||
    deleteBackupMutation.isPending;

  const loadBackupFiles = useCallback(() => {
    void refetch();
  }, [refetch]);

  const createBackup = useCallback(async () => {
    if (!userId) return;
    try {
      await createBackupMutation.mutateAsync();
      toast({ title: 'Success', description: 'Personal backup created successfully' });
      loadBackupFiles();
    } catch (error) {
      console.error('Error creating backup:', error);
      toast({
        title: 'Error',
        description: 'Failed to create backup',
        variant: 'destructive',
      });
    }
  }, [userId, createBackupMutation, toast, loadBackupFiles]);

  const exportData = useCallback(async () => {
    if (!userId) return;
    try {
      const blob = await exportBackupMutation.mutateAsync(userId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `my_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast({ title: 'Success', description: 'Your personal data exported successfully' });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: 'Error',
        description: 'Failed to export data',
        variant: 'destructive',
      });
    }
  }, [userId, exportBackupMutation, toast]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/json') {
      setSelectedFile(file);
      setShowImportDialog(true);
      return;
    }
    toast({
      title: 'Error',
      description: 'Please select a valid JSON backup file',
      variant: 'destructive',
    });
  };

  const importData = useCallback(
    async (overwrite: boolean) => {
      if (!selectedFile || !userId) return;
      try {
        const fileContent = await selectedFile.text();
        let parsed: unknown;
        try {
          parsed = JSON.parse(fileContent);
        } catch {
          toast({
            title: 'Error',
            description: 'Invalid JSON file. Please select a valid backup file.',
            variant: 'destructive',
          });
          return;
        }
        const backupData = parseBackupFileContent(parsed);
        await importBackupMutation.mutateAsync({ data: backupData, overwrite });
        toast({ title: 'Success', description: 'Personal data imported successfully' });
        setShowImportDialog(false);
        setSelectedFile(null);
        loadBackupFiles();
      } catch (error) {
        const message =
          error instanceof ZodError
            ? 'Invalid backup file format. Ensure it was exported from BitChain.'
            : 'Failed to import data';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      }
    },
    [selectedFile, userId, importBackupMutation, toast, loadBackupFiles],
  );

  const restoreFromFile = useCallback(
    async (filename: string, overwrite: boolean) => {
      if (!userId) return;
      try {
        await restoreBackupMutation.mutateAsync({ filename, overwrite });
        toast({ title: 'Success', description: 'Personal backup restored successfully' });
      } catch (error) {
        console.error('Error restoring backup:', error);
        toast({
          title: 'Error',
          description: 'Failed to restore backup',
          variant: 'destructive',
        });
      }
    },
    [userId, restoreBackupMutation, toast],
  );

  const deleteBackup = useCallback(
    async (filename: string) => {
      try {
        await deleteBackupMutation.mutateAsync(filename);
        toast({ title: 'Success', description: 'Backup deleted successfully' });
        loadBackupFiles();
      } catch (error) {
        console.error('Error deleting backup:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete backup',
          variant: 'destructive',
        });
      }
    },
    [deleteBackupMutation, toast, loadBackupFiles],
  );

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!userId) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Please log in to access backup management</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BackupActionsCard
        isLoading={isLoading}
        onCreateBackup={createBackup}
        onExportData={exportData}
        onImportClick={() => document.getElementById('file-upload')?.click()}
        onFileUpload={handleFileUpload}
      />

      <BackupHistoryCard
        isListLoading={isListLoading}
        backupFiles={backupFiles}
        isLoading={isLoading}
        onRestore={restoreFromFile}
        onDelete={deleteBackup}
        formatTimestamp={formatTimestamp}
      />

      <BackupImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        selectedFileName={selectedFile?.name}
        isLoading={isLoading}
        onMerge={() => importData(false)}
        onReplace={() => importData(true)}
      />
    </div>
  );
}
