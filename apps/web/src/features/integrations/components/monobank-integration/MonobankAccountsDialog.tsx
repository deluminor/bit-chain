import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { MonobankIntegrationAccount } from '@/features/integrations/queries/monobank';
import { Building2 } from 'lucide-react';
import { buildAccountMeta } from './monobank-integration.utils';

interface MonobankAccountsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: MonobankIntegrationAccount[];
  onToggleImport: (accountId: string, isChecked: boolean) => void;
  onRenameAccount: (accountId: string, name: string) => void;
  onSave: () => void;
  hasChanges: boolean;
  isSaving: boolean;
}

export function MonobankAccountsDialog({
  open,
  onOpenChange,
  accounts,
  onToggleImport,
  onRenameAccount,
  onSave,
  hasChanges,
  isSaving,
}: MonobankAccountsDialogProps) {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Monobank Accounts</DialogTitle>
          <DialogDescription>
            Select which accounts to import and edit display names for clarity.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {accounts.length === 0 ? (
            <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
              No accounts loaded yet.
            </div>
          ) : (
            accounts.map(account => (
              <div
                key={account.id}
                className="flex flex-col gap-3 rounded-lg border border-border/70 bg-background p-3"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={account.importEnabled}
                      onCheckedChange={checked => onToggleImport(account.id, checked === true)}
                    />
                    <div className="text-sm font-medium">Import account</div>
                  </div>
                  <Badge variant="outline" className="w-fit">
                    {account.currency}
                  </Badge>
                </div>
                <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_200px]">
                  <Input
                    value={account.name}
                    onChange={event => onRenameAccount(account.id, event.target.value)}
                    placeholder="Account name"
                  />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Building2 className="h-3 w-3" />
                    <span>{buildAccountMeta(account) || 'Monobank account'}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={!hasChanges || isSaving}>
            {isSaving ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
