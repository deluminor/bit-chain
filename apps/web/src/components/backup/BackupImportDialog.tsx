import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangleIcon } from 'lucide-react';

interface BackupImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFileName?: string;
  isLoading: boolean;
  onMerge: () => void;
  onReplace: () => void;
}

export function BackupImportDialog({
  open,
  onOpenChange,
  selectedFileName,
  isLoading,
  onMerge,
  onReplace,
}: BackupImportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Backup Data</DialogTitle>
          <DialogDescription>You have selected: {selectedFileName}</DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertTitle>Data Import Options</AlertTitle>
          <AlertDescription>Choose how to handle existing data during import.</AlertDescription>
        </Alert>

        <div className="flex gap-3">
          <Button onClick={onMerge} disabled={isLoading} variant="outline">
            Merge with existing
          </Button>
          <Button onClick={onReplace} disabled={isLoading} variant="destructive">
            Replace all data
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
