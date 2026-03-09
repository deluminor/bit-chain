import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
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
import { AlertTriangleIcon, CalendarIcon, DatabaseIcon, FileIcon, Trash2Icon } from 'lucide-react';
import type { BackupFile } from './backup.types';

interface BackupHistoryCardProps {
  isListLoading: boolean;
  backupFiles: BackupFile[];
  isLoading: boolean;
  onRestore: (filename: string, overwrite: boolean) => void;
  onDelete: (filename: string) => void;
  formatTimestamp: (timestamp: string) => string;
}

export function BackupHistoryCard({
  isListLoading,
  backupFiles,
  isLoading,
  onRestore,
  onDelete,
  formatTimestamp,
}: BackupHistoryCardProps) {
  if (isListLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <DatabaseIcon className="h-4 w-4 animate-spin" />
            <span>Loading backup history...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!backupFiles.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Backup History</CardTitle>
        <CardDescription>Your previously created personal backups</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {backupFiles.map((backup, index) => (
            <div key={index} className="flex items-center justify-between rounded-lg border p-3">
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
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
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
                      <span>•</span>
                      <span>{backup.recordCounts.loans} loans</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
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
                        This will restore data from {backup.filename}. Choose how to handle existing
                        data.
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
                        onClick={() => onRestore(backup.filename, false)}
                        disabled={isLoading}
                        variant="outline"
                      >
                        Merge with existing
                      </Button>
                      <Button
                        onClick={() => onRestore(backup.filename, true)}
                        disabled={isLoading}
                        variant="destructive"
                      >
                        Replace all data
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Backup</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete {backup.filename}? This action cannot be
                        undone.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-end gap-3">
                      <DialogTrigger asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogTrigger>
                      <Button
                        onClick={() => onDelete(backup.filename)}
                        disabled={isLoading}
                        variant="destructive"
                      >
                        Delete
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
