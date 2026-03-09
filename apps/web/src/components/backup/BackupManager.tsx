'use client';

import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { BackupActionsCard } from './BackupActionsCard';
import { BackupHistoryCard } from './BackupHistoryCard';
import { BackupImportDialog } from './BackupImportDialog';
import type { BackupFile } from './backup.types';

export function BackupManager() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isListLoading, setIsListLoading] = useState(true);
  const [backupFiles, setBackupFiles] = useState<BackupFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const { toast } = useToast();

  const loadBackupFiles = useCallback(async () => {
    if (!session?.user?.id) {
      return;
    }

    setIsListLoading(true);
    try {
      const response = await axios.get('/api/backup?action=list');
      setBackupFiles(response.data.files || []);
    } catch (error) {
      console.error('Error loading backup files:', error);
      toast({
        title: 'Error',
        description: 'Failed to load backup files',
        variant: 'destructive',
      });
    } finally {
      setIsListLoading(false);
    }
  }, [session?.user?.id, toast]);

  useEffect(() => {
    void loadBackupFiles();
  }, [loadBackupFiles]);

  if (!session?.user?.id) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Please log in to access backup management</p>
      </div>
    );
  }

  const createBackup = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/backup', {
        action: 'create',
        userId: session.user.id,
      });

      if (response.data.success) {
        toast({ title: 'Success', description: 'Personal backup created successfully' });
        await loadBackupFiles();
      }
    } catch {
      console.error('Error creating backup:');
      toast({ title: 'Error', description: 'Failed to create backup', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/backup?action=export&userId=${session.user.id}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `my_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast({ title: 'Success', description: 'Your personal data exported successfully' });
    } catch {
      console.error('Error exporting data:');
      toast({ title: 'Error', description: 'Failed to export data', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

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

  const importData = async (overwrite = false) => {
    if (!selectedFile) {
      return;
    }

    setIsLoading(true);
    try {
      const fileContent = await selectedFile.text();
      const backupData = JSON.parse(fileContent);

      const response = await axios.post('/api/backup', {
        action: 'import',
        data: backupData,
        userId: session.user.id,
        overwrite,
      });

      if (response.data.success) {
        toast({ title: 'Success', description: 'Personal data imported successfully' });
        setShowImportDialog(false);
        setSelectedFile(null);
        await loadBackupFiles();
      }
    } catch {
      console.error('Error importing data:');
      toast({ title: 'Error', description: 'Failed to import data', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const restoreFromFile = async (filename: string, overwrite = false) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/backup', {
        action: 'restore',
        filename,
        userId: session.user.id,
        overwrite,
      });

      if (response.data.success) {
        toast({ title: 'Success', description: 'Personal backup restored successfully' });
      }
    } catch {
      console.error('Error restoring backup:');
      toast({ title: 'Error', description: 'Failed to restore backup', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBackup = async (filename: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/backup', {
        action: 'delete',
        filename,
      });

      if (response.data.success) {
        toast({ title: 'Success', description: 'Backup deleted successfully' });
        await loadBackupFiles();
      }
    } catch {
      console.error('Error deleting backup:');
      toast({ title: 'Error', description: 'Failed to delete backup', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

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
