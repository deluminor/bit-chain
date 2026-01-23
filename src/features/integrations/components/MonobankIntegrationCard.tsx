'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  MonobankIntegrationAccount,
  useMonobankConnect,
  useMonobankIntegration,
  useMonobankSync,
  useMonobankUpdateAccounts,
} from '@/features/integrations/queries/monobank';
import { useToast } from '@/hooks/use-toast';
import {
  Building2,
  CheckCircle2,
  CreditCard,
  RefreshCw,
  Settings2,
  ShieldAlert,
  Wallet,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const formatSyncTime = (value?: string | null) => {
  if (!value) {
    return 'Not synced yet';
  }
  const date = new Date(value);
  return date.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const buildAccountMeta = (account: MonobankIntegrationAccount) => {
  const details: string[] = [];
  if (account.maskedPan) {
    details.push(account.maskedPan);
  }
  if (account.iban) {
    const ibanTail = account.iban.slice(-6);
    details.push(`IBAN ****${ibanTail}`);
  }
  if (account.ownerType === 'FOP' && account.ownerName) {
    details.push(`FOP ${account.ownerName}`);
  }
  return details.join(' | ');
};

export function MonobankIntegrationCard() {
  const { toast } = useToast();
  const { data, isLoading, error } = useMonobankIntegration();
  const connectMutation = useMonobankConnect();
  const syncMutation = useMonobankSync();
  const updateAccountsMutation = useMonobankUpdateAccounts();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [token, setToken] = useState('');
  const [draftAccounts, setDraftAccounts] = useState<MonobankIntegrationAccount[]>([]);

  const integration = data?.integration ?? null;
  const accounts = useMemo(() => data?.accounts ?? [], [data?.accounts]);
  const summary = data?.summary ?? { totalAccounts: 0, enabledAccounts: 0 };
  const isConnected = Boolean(integration);

  useEffect(() => {
    setDraftAccounts(accounts);
  }, [accounts]);

  const isSaving = updateAccountsMutation.isPending;

  const hasChanges = useMemo(() => {
    if (!accounts.length || accounts.length !== draftAccounts.length) {
      return false;
    }
    return accounts.some(account => {
      const draft = draftAccounts.find(item => item.id === account.id);
      if (!draft) return false;
      return draft.name !== account.name || draft.importEnabled !== account.importEnabled;
    });
  }, [accounts, draftAccounts]);

  const handleConnect = async () => {
    try {
      await connectMutation.mutateAsync({ token: token || undefined });
      toast({
        title: 'Monobank connected',
        description: 'Accounts fetched successfully. Select what to import.',
      });
      setIsConnectDialogOpen(false);
      setToken('');
    } catch (connectionError) {
      toast({
        title: 'Connection failed',
        description:
          connectionError instanceof Error
            ? connectionError.message
            : 'Unable to connect to Monobank. Check your token.',
        variant: 'destructive',
      });
    }
  };

  const handleSync = async () => {
    try {
      await syncMutation.mutateAsync({ reason: 'manual' });
      toast({
        title: 'Sync started',
        description: 'Monobank data is refreshing in the background.',
      });
    } catch (syncError) {
      toast({
        title: 'Sync failed',
        description: syncError instanceof Error ? syncError.message : 'Unable to sync Monobank',
        variant: 'destructive',
      });
    }
  };

  const handleSaveAccounts = async () => {
    try {
      await updateAccountsMutation.mutateAsync({
        accounts: draftAccounts.map(account => ({
          id: account.id,
          name: account.name.trim(),
          importEnabled: account.importEnabled,
        })),
      });
      toast({
        title: 'Accounts updated',
        description: 'Import preferences saved successfully.',
      });
      setIsDialogOpen(false);
    } catch (updateError) {
      toast({
        title: 'Update failed',
        description:
          updateError instanceof Error ? updateError.message : 'Unable to update Monobank accounts',
        variant: 'destructive',
      });
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            Monobank Integration
          </CardTitle>
          <CardDescription>Unable to load Monobank status.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Monobank Integration
            </CardTitle>
            <CardDescription>
              Sync accounts and transactions on demand or in the background.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {isConnected ? (
              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Connected
              </Badge>
            ) : (
              <Badge variant="outline">Not connected</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected ? (
          <div className="flex flex-col gap-3 rounded-lg border border-border/70 bg-muted/30 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Accounts imported</div>
                <div className="text-lg font-semibold">
                  {summary.enabledAccounts} / {summary.totalAccounts}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Last sync: {formatSyncTime(integration?.lastSyncedAt)}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleSync} disabled={syncMutation.isPending} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                {syncMutation.isPending ? 'Syncing...' : 'Sync now'}
              </Button>
              <Button onClick={() => setIsDialogOpen(true)} variant="default">
                <Settings2 className="mr-2 h-4 w-4" />
                Manage accounts
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 rounded-lg border border-dashed border-border/70 bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wallet className="h-4 w-4" />
              Connect Monobank to import balances and statements.
            </div>
            <Button
              onClick={() => setIsConnectDialogOpen(true)}
              disabled={connectMutation.isPending || isLoading}
            >
              Connect Monobank
            </Button>
          </div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Monobank Accounts</DialogTitle>
            <DialogDescription>
              Select which accounts to import and edit display names for clarity.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {draftAccounts.length === 0 ? (
              <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                No accounts loaded yet.
              </div>
            ) : (
              draftAccounts.map(account => (
                <div
                  key={account.id}
                  className="flex flex-col gap-3 rounded-lg border border-border/70 bg-background p-3"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={account.importEnabled}
                        onCheckedChange={checked => {
                          const isChecked = checked === true;
                          setDraftAccounts(prev =>
                            prev.map(item =>
                              item.id === account.id ? { ...item, importEnabled: isChecked } : item,
                            ),
                          );
                        }}
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
                      onChange={event => {
                        const value = event.target.value;
                        setDraftAccounts(prev =>
                          prev.map(item =>
                            item.id === account.id ? { ...item, name: value } : item,
                          ),
                        );
                      }}
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAccounts} disabled={!hasChanges || isSaving}>
              {isSaving ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isConnectDialogOpen} onOpenChange={setIsConnectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Monobank</DialogTitle>
            <DialogDescription>
              Enter your Monobank Activation Token. You can get it from{' '}
              <a
                href="https://api.monobank.ua/"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-primary"
              >
                api.monobank.ua
              </a>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Input
                placeholder="uX..."
                value={token}
                onChange={e => setToken(e.target.value)}
                autoComplete="off"
                type="password"
              />
              <p className="text-xs text-muted-foreground">
                The token is encrypted and stored securely.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsConnectDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConnect} disabled={!token || connectMutation.isPending}>
              {connectMutation.isPending ? 'Connecting...' : 'Connect'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
