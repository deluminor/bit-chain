'use client';

import { AnimatedDiv } from '@/components/ui/animations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AccountDialogs } from '@/features/finance/components/account-list/AccountDialogs';
import { AccountListHeader } from '@/features/finance/components/account-list/AccountListHeader';
import { AccountSummaryCards } from '@/features/finance/components/account-list/AccountSummaryCards';
import { AccountTableSection } from '@/features/finance/components/account-list/AccountTableSection';
import { createAccountFilterFields } from '@/features/finance/components/account-list/account-filter-fields';
import {
  DEFAULT_ACCOUNT_SUMMARY,
  getApiErrorMessage,
} from '@/features/finance/components/account-list/account-list.utils';
import { useAccountBalanceConversion } from '@/features/finance/components/account-list/use-account-balance-conversion';
import { useAccountFilters } from '@/features/finance/hooks/useAccountFilters';
import {
  FinanceAccount,
  useAccountAction,
  useAccounts,
  useDeleteAccount,
} from '@/features/finance/queries/accounts';
import { useMonobankAutoSync } from '@/features/integrations/hooks/useMonobankAutoSync';
import { useMonobankSync } from '@/features/integrations/queries/monobank';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

export function AccountList() {
  const { data: accountsData, isLoading, error, refetch } = useAccounts(true);
  const accountAction = useAccountAction();
  const deleteAccount = useDeleteAccount();
  const syncMutation = useMonobankSync();
  const { toast } = useToast();

  useMonobankAutoSync('accounts_page');

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<FinanceAccount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    filters,
    handleSearchChange,
    handleTypeFilterChange,
    handleCurrencyFilterChange,
    handleStatusFilterChange,
    resetFilters,
  } = useAccountFilters();

  const allAccounts = useMemo<FinanceAccount[]>(
    () => (accountsData?.accounts ?? []) as FinanceAccount[],
    [accountsData?.accounts],
  );

  const accounts = useMemo(
    () =>
      allAccounts.filter(account => {
        if (
          filters.searchTerm &&
          !account.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
        ) {
          return false;
        }

        if (filters.typeFilter && account.type !== filters.typeFilter) {
          return false;
        }

        if (filters.currencyFilter && account.currency !== filters.currencyFilter) {
          return false;
        }

        if (filters.statusFilter) {
          const isActive = filters.statusFilter === 'active';
          if (account.isActive !== isActive) {
            return false;
          }
        }

        return true;
      }),
    [allAccounts, filters],
  );

  const summary = useMemo(
    () => accountsData?.summary || DEFAULT_ACCOUNT_SUMMARY,
    [accountsData?.summary],
  );

  const { totalBalanceEUR, isConverting } = useAccountBalanceConversion(accounts);

  const hasActiveFilters = Boolean(
    filters.searchTerm || filters.typeFilter || filters.currencyFilter || filters.statusFilter,
  );

  const uniqueCurrencies = useMemo(() => {
    const currencies = new Set(allAccounts.map(account => account.currency));
    return Array.from(currencies).map(currency => ({ value: currency, label: currency }));
  }, [allAccounts]);

  const filterFields = createAccountFilterFields({
    filters,
    uniqueCurrencies,
    onSearchChange: handleSearchChange,
    onTypeFilterChange: handleTypeFilterChange,
    onCurrencyFilterChange: handleCurrencyFilterChange,
    onStatusFilterChange: handleStatusFilterChange,
  });

  const handleToggleActive = async (account: FinanceAccount) => {
    try {
      await accountAction.mutateAsync({
        id: account.id,
        action: account.isActive ? 'deactivate' : 'activate',
      });
      toast({
        title: 'Success',
        description: `Account ${account.isActive ? 'deactivated' : 'activated'} successfully`,
      });
      void refetch();
    } catch (mutationError) {
      toast({
        title: 'Error',
        description: getApiErrorMessage(mutationError, 'Failed to update account'),
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!selectedAccount) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAccount.mutateAsync({
        id: selectedAccount.id,
        force: false,
      });
      toast({ title: 'Success', description: 'Account deleted successfully.' });
      setShowDeleteDialog(false);
      setSelectedAccount(null);
      void refetch();
    } catch (mutationError) {
      toast({
        title: 'Error',
        description: getApiErrorMessage(mutationError, 'Failed to delete account'),
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    void refetch();
    setShowCreateDialog(false);
    setShowEditDialog(false);
    setSelectedAccount(null);
  };

  const handleSync = useCallback(() => {
    syncMutation.mutate({ reason: 'manual_reload', force: true, chain: true });
  }, [syncMutation]);

  const handleCreateAccount = useCallback(() => {
    setShowCreateDialog(true);
  }, []);

  const handleSelectDeleteAccount = useCallback((account: FinanceAccount) => {
    setSelectedAccount(account);
    setShowDeleteDialog(true);
  }, []);

  const handleEditAccount = useCallback((account: FinanceAccount) => {
    setSelectedAccount(account);
    setShowEditDialog(true);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setShowEditDialog(false);
    setSelectedAccount(null);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteDialog(false);
    setSelectedAccount(null);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    handleDeleteAccount();
  }, [handleDeleteAccount]);

  if (error) {
    return (
      <AnimatedDiv variant="slideUp" className="container">
        <Card>
          <CardContent className="py-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <p className="text-lg font-medium mb-2">Failed to load accounts</p>
            <p className="text-muted-foreground mb-4">There was an error loading your accounts.</p>
            <Button
              onClick={() => {
                void refetch();
              }}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </AnimatedDiv>
    );
  }

  return (
    <AnimatedDiv variant="slideUp" className="space-y-6">
      <div className="flex flex-col gap-3 md:gap-6">
        <AccountListHeader onCreateAccount={handleCreateAccount} />

        <AccountSummaryCards
          isLoading={isLoading}
          isConverting={isConverting}
          totalBalanceEUR={totalBalanceEUR}
          summary={summary}
        />

        <AccountTableSection
          accounts={accounts}
          isLoading={isLoading}
          filterFields={filterFields}
          hasActiveFilters={hasActiveFilters}
          isSyncing={syncMutation.isPending}
          onClearFilters={resetFilters}
          onSync={handleSync}
          onCreateAccount={handleCreateAccount}
          onEditAccount={handleEditAccount}
          onToggleAccountStatus={handleToggleActive}
          onDeleteAccount={handleSelectDeleteAccount}
        />

        <AccountDialogs
          showCreateDialog={showCreateDialog}
          showEditDialog={showEditDialog}
          showDeleteDialog={showDeleteDialog}
          selectedAccount={selectedAccount}
          isDeleting={isDeleting}
          onCreateDialogChange={setShowCreateDialog}
          onEditDialogChange={setShowEditDialog}
          onDeleteDialogChange={setShowDeleteDialog}
          onFormSuccess={handleFormSuccess}
          onCancelEdit={handleCancelEdit}
          onCancelDelete={handleCancelDelete}
          onConfirmDelete={handleConfirmDelete}
        />
      </div>
    </AnimatedDiv>
  );
}
