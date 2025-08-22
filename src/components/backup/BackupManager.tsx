'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  DownloadIcon,
  UploadIcon,
  DatabaseIcon,
  AlertTriangleIcon,
  FileIcon,
  CalendarIcon,
} from 'lucide-react';
import axios from 'axios';

interface BackupFile {
  filename: string;
  metadata?: {
    version: string;
    timestamp: string;
    totalRecords: number;
  };
  recordCounts?: {
    users: number;
    categories: number;
    trades: number;
    screenshots: number;
    financeAccounts: number;
    transactions: number;
    transactionCategories: number;
    budgets: number;
    budgetCategories: number;
    financialGoals: number;
  };
}

export function BackupManager() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [backupFiles, setBackupFiles] = useState<BackupFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const { toast } = useToast();

  const loadBackupFiles = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      const response = await axios.get(`/api/backup?action=list&userId=${session.user.id}`);

      // Get info for each backup file
      const filesWithInfo = await Promise.all(
        response.data.files.map(async (filename: string) => {
          try {
            const infoResponse = await axios.get(`/api/backup?action=info&filename=${filename}`);
            return { filename, ...infoResponse.data.info };
          } catch (error) {
            console.error(`Error getting info for ${filename}:`, error);
            return { filename, error: 'Failed to load info' };
          }
        }),
      );

      setBackupFiles(filesWithInfo);
    } catch (error) {
      console.error('Error loading backup files:', error);
      toast({
        title: 'Error',
        description: 'Failed to load backup files',
        variant: 'destructive',
      });
    }
  }, [session?.user?.id, toast]);

  useEffect(() => {
    loadBackupFiles();
  }, [loadBackupFiles]);

  // Don't render if no user session
  if (!session?.user?.id) {
    return (
      <div className="flex items-center justify-center h-64">
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
        toast({
          title: 'Success',
          description: 'Personal backup created successfully',
        });
        await loadBackupFiles();
      }
    } catch {
      console.error('Error creating backup:');
      toast({
        title: 'Error',
        description: 'Failed to create backup',
        variant: 'destructive',
      });
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

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `my_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: 'Your personal data exported successfully',
      });
    } catch {
      console.error('Error exporting data:');
      toast({
        title: 'Error',
        description: 'Failed to export data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/json') {
      setSelectedFile(file);
      setShowImportDialog(true);
    } else {
      toast({
        title: 'Error',
        description: 'Please select a valid JSON backup file',
        variant: 'destructive',
      });
    }
  };

  const importData = async (overwrite: boolean = false) => {
    if (!selectedFile) return;

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
        toast({
          title: 'Success',
          description: 'Personal data imported successfully',
        });
        setShowImportDialog(false);
        setSelectedFile(null);
        await loadBackupFiles();
      }
    } catch {
      console.error('Error importing data:');
      toast({
        title: 'Error',
        description: 'Failed to import data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const restoreFromFile = async (filename: string, overwrite: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/backup', {
        action: 'restore',
        filename,
        userId: session.user.id,
        overwrite,
      });

      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Personal backup restored successfully',
        });
        // removed unused setShowRestoreDialog(false)
      }
    } catch {
      console.error('Error restoring backup:');
      toast({
        title: 'Error',
        description: 'Failed to restore backup',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DatabaseIcon className="h-5 w-5" />
            Personal Backup Manager
          </CardTitle>
          <CardDescription>
            Create, export, and restore backups of your personal trading data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              Always create a backup before making significant changes to your data. Personal
              backups include your trades, categories, and screenshots.
            </AlertDescription>
          </Alert>

          <div className="flex flex-wrap gap-3">
            <Button onClick={createBackup} disabled={isLoading} className="flex items-center gap-2">
              <DatabaseIcon className="h-4 w-4" />
              Create Personal Backup
            </Button>

            <Button
              onClick={exportData}
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <DownloadIcon className="h-4 w-4" />
              Export My Data
            </Button>

            <Button
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <UploadIcon className="h-4 w-4" />
              Import Data
            </Button>
          </div>

          <input
            id="file-upload"
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileUpload}
          />
        </CardContent>
      </Card>

      {backupFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>My Backup History</CardTitle>
            <CardDescription>Your previously created personal backups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {backupFiles.map((backup, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{backup.filename}</p>
                      {backup.metadata && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CalendarIcon className="h-3 w-3" />
                          {formatTimestamp(backup.metadata.timestamp)}
                          <Badge variant="secondary" className="text-xs">
                            {backup.metadata.totalRecords} records
                          </Badge>
                        </div>
                      )}
                      {backup.recordCounts && (
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-1">
                          <span>{backup.recordCounts.users} users</span>
                          <span>•</span>
                          <span>{backup.recordCounts.trades} trades</span>
                          <span>•</span>
                          <span>{backup.recordCounts.categories} trade cats</span>
                          <span>•</span>
                          <span>{backup.recordCounts.financeAccounts} accounts</span>
                          <span>•</span>
                          <span>{backup.recordCounts.transactions} transactions</span>
                          <span>•</span>
                          <span>{backup.recordCounts.transactionCategories} fin cats</span>
                          <span>•</span>
                          <span>{backup.recordCounts.budgets} budgets</span>
                          <span>•</span>
                          <span>{backup.recordCounts.financialGoals} goals</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Restore
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Restore Backup</DialogTitle>
                        <DialogDescription>
                          This will restore data from {backup.filename}. Choose how to handle
                          existing data.
                        </DialogDescription>
                      </DialogHeader>

                      <Alert>
                        <AlertTriangleIcon className="h-4 w-4" />
                        <AlertTitle>Warning</AlertTitle>
                        <AlertDescription>
                          Restoring will modify your current data. Make sure to create a backup of
                          your current state first.
                        </AlertDescription>
                      </Alert>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => restoreFromFile(backup.filename, false)}
                          disabled={isLoading}
                          variant="outline"
                        >
                          Merge with existing
                        </Button>
                        <Button
                          onClick={() => restoreFromFile(backup.filename, true)}
                          disabled={isLoading}
                          variant="destructive"
                        >
                          Replace all data
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Backup Data</DialogTitle>
            <DialogDescription>You have selected: {selectedFile?.name}</DialogDescription>
          </DialogHeader>

          <Alert>
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertTitle>Data Import Options</AlertTitle>
            <AlertDescription>Choose how to handle existing data during import.</AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button onClick={() => importData(false)} disabled={isLoading} variant="outline">
              Merge with existing
            </Button>
            <Button onClick={() => importData(true)} disabled={isLoading} variant="destructive">
              Replace all data
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
