'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MonobankIntegrationAccount,
  useMonobankConnect,
  useMonobankIntegration,
  useMonobankSync,
  useMonobankUpdateAccounts,
} from '@/features/integrations/queries/monobank';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, CreditCard, RefreshCw, Settings2, ShieldAlert, Wallet } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { MonobankAccountsDialog } from './monobank-integration/MonobankAccountsDialog';
import { MonobankConnectDialog } from './monobank-integration/MonobankConnectDialog';
import { formatSyncTime } from './monobank-integration/monobank-integration.utils';

export function MonobankIntegrationCard() {
  const { toast } = useToast();
  const { data, isLoading, error } = useMonobankIntegration();
  const connectMutation = useMonobankConnect();
  const syncMutation = useMonobankSync();
  const updateAccountsMutation = useMonobankUpdateAccounts();

  const [isAccountsDialogOpen, setIsAccountsDialogOpen] = useState(false);
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
      if (!draft) {
        return false;
      }

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
      await syncMutation.mutateAsync({ reason: 'manual', chain: true });
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

  const handleToggleImport = (accountId: string, isChecked: boolean) => {
    setDraftAccounts(previous =>
      previous.map(account =>
        account.id === accountId ? { ...account, importEnabled: isChecked } : account,
      ),
    );
  };

  const handleRenameAccount = (accountId: string, name: string) => {
    setDraftAccounts(previous =>
      previous.map(account => (account.id === accountId ? { ...account, name } : account)),
    );
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
      setIsAccountsDialogOpen(false);
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
          {isConnected ? (
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Connected
            </Badge>
          ) : (
            <Badge variant="outline">Not connected</Badge>
          )}
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
              <Button onClick={() => setIsAccountsDialogOpen(true)} variant="default">
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

      <MonobankAccountsDialog
        open={isAccountsDialogOpen}
        onOpenChange={setIsAccountsDialogOpen}
        accounts={draftAccounts}
        onToggleImport={handleToggleImport}
        onRenameAccount={handleRenameAccount}
        onSave={handleSaveAccounts}
        hasChanges={hasChanges}
        isSaving={isSaving}
      />

      <MonobankConnectDialog
        open={isConnectDialogOpen}
        onOpenChange={setIsConnectDialogOpen}
        token={token}
        onTokenChange={setToken}
        onConnect={handleConnect}
        isConnecting={connectMutation.isPending}
      />
    </Card>
  );
}
