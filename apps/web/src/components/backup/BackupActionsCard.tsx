import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangleIcon, DatabaseIcon, DownloadIcon, UploadIcon } from 'lucide-react';

interface BackupActionsCardProps {
  isLoading: boolean;
  onCreateBackup: () => void;
  onExportData: () => void;
  onImportClick: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BackupActionsCard({
  isLoading,
  onCreateBackup,
  onExportData,
  onImportClick,
  onFileUpload,
}: BackupActionsCardProps) {
  return (
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
            Always create a backup before making significant changes to your data. Personal backups
            include your trades, categories, and screenshots.
          </AlertDescription>
        </Alert>

        <div className="flex flex-wrap gap-3">
          <Button onClick={onCreateBackup} disabled={isLoading} className="flex items-center gap-2">
            <DatabaseIcon className="h-4 w-4" />
            Create Personal Backup
          </Button>

          <Button
            onClick={onExportData}
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <DownloadIcon className="h-4 w-4" />
            Export My Data
          </Button>

          <Button
            onClick={onImportClick}
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
          onChange={onFileUpload}
        />
      </CardContent>
    </Card>
  );
}
