'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { TableLoadingBar } from '@/components/ui/table-loading-bar';
import { useToast } from '@/hooks/use-toast';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  Wallet,
  CreditCard,
  PiggyBank,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Activity,
} from 'lucide-react';
import { AccountForm } from '@/components/forms/AccountForm';
import {
  useAccounts,
  useAccountAction,
  useDeleteAccount,
  FinanceAccount,
} from '@/features/finance/queries/accounts';
import { TotalBalanceDisplay } from '@/components/layout/TotalBalanceDisplay';
import { formatCurrency, formatSummaryAmount } from '@/lib/currency';
import { AnimatedDiv } from '@/components/ui/animations';
import { currencyService } from '@/lib/currency';

const accountTypeIcons = {
  CASH: Wallet,
  BANK_CARD: CreditCard,
  SAVINGS: PiggyBank,
  INVESTMENT: TrendingUp,
};

const getAccountTypeColor = (type: string) => {
  switch (type) {
    case 'CASH':
      return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    case 'BANK_CARD':
      return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
    case 'SAVINGS':
      return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
    case 'INVESTMENT':
      return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
    default:
      return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
  }
};

const getBalanceColor = (balance: number) => {
  if (balance > 0) return 'text-green-600 dark:text-green-400';
  if (balance < 0) return 'text-red-600 dark:text-red-400';
  return 'text-gray-600 dark:text-gray-400';
};

export function AccountList() {
  const { data: accountsData, isLoading, error, refetch } = useAccounts(true);
  const accountAction = useAccountAction();
  const deleteAccount = useDeleteAccount();
  const { toast } = useToast();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<FinanceAccount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [totalBalanceEUR, setTotalBalanceEUR] = useState<number>(0);
  const [isConverting, setIsConverting] = useState<boolean>(false);

  const accounts = useMemo(() => accountsData?.accounts || [], [accountsData?.accounts]);
  const summary = useMemo(
    () =>
      accountsData?.summary || {
        total: 0,
        active: 0,
        inactive: 0,
        totalBalance: 0,
      },
    [accountsData?.summary],
  );

  // Convert account balances to EUR (only active accounts)
  useEffect(() => {
    const convertBalances = async () => {
      if (!accounts || accounts.length === 0) {
        setTotalBalanceEUR(0);
        return;
      }

      setIsConverting(true);
      try {
        let totalEUR = 0;
        // Only include active accounts in calculations
        const activeAccounts = accounts.filter((account: FinanceAccount) => account.isActive);

        for (const account of activeAccounts) {
          const convertedBalance = await currencyService.convertToBaseCurrency(
            account.balance,
            account.currency,
          );
          totalEUR += convertedBalance;
        }

        setTotalBalanceEUR(totalEUR);
      } catch (error) {
        console.error('Error converting balances:', error);
        // Fallback calculation should also exclude deactivated accounts
        const activeAccountsBalance = accounts
          .filter((account: FinanceAccount) => account.isActive)
          .reduce((sum: number, account: FinanceAccount) => sum + account.balance, 0);
        setTotalBalanceEUR(activeAccountsBalance);
      } finally {
        setIsConverting(false);
      }
    };

    convertBalances();
  }, [accounts, summary]);

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
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error &&
          'response' in error &&
          error.response &&
          typeof error.response === 'object' &&
          'data' in error.response &&
          error.response.data &&
          typeof error.response.data === 'object' &&
          'error' in error.response.data
            ? String(error.response.data.error)
            : 'Failed to update account',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!selectedAccount) return;

    setIsDeleting(true);
    try {
      await deleteAccount.mutateAsync({
        id: selectedAccount.id,
        force: false,
      });
      toast({
        title: 'Success',
        description: 'Account deleted successfully.',
      });
      setShowDeleteDialog(false);
      setSelectedAccount(null);
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error &&
          'response' in error &&
          error.response &&
          typeof error.response === 'object' &&
          'data' in error.response &&
          error.response.data &&
          typeof error.response.data === 'object' &&
          'error' in error.response.data
            ? String(error.response.data.error)
            : 'Failed to delete account',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    refetch();
    setShowCreateDialog(false);
    setShowEditDialog(false);
    setSelectedAccount(null);
  };

  if (error) {
    return (
      <AnimatedDiv variant="slideUp" className="container">
        <Card>
          <CardContent className="py-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <p className="text-lg font-medium mb-2">Failed to load accounts</p>
            <p className="text-muted-foreground mb-4">There was an error loading your accounts.</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </CardContent>
        </Card>
      </AnimatedDiv>
    );
  }

  return (
    <AnimatedDiv variant="slideUp" className="space-y-6">
      <div className="flex flex-col gap-3 md:gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 rounded-xl bg-primary shadow-sm">
              <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Accounts</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Manage your financial accounts
              </p>
            </div>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 bg-purple-500/10 rounded-lg">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
              </div>
              <h3 className="font-medium sm:font-semibold text-sm sm:text-base">Total Balance</h3>
            </div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">
              <TotalBalanceDisplay size="md" showLoading={isLoading} />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Converted to EUR</p>
          </Card>

          <Card className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 bg-orange-500/10 rounded-lg">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
              </div>
              <h3 className="font-medium sm:font-semibold text-sm sm:text-base">Avg Balance</h3>
            </div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">
              {isConverting ? (
                <span className="text-muted-foreground">Converting...</span>
              ) : (
                formatSummaryAmount(totalBalanceEUR / Math.max(summary.active, 1))
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Per active account</p>
          </Card>

          <Card className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-lg">
                <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
              </div>
              <h3 className="font-medium sm:font-semibold text-sm sm:text-base">Total Accounts</h3>
            </div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">{summary.total}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">All accounts</p>
          </Card>

          <Card className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 bg-green-500/10 rounded-lg">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
              </div>
              <h3 className="font-medium sm:font-semibold text-sm sm:text-base">Active</h3>
            </div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">{summary.active}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Currently active</p>
          </Card>
        </div>

        {/* Accounts Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Your Accounts
            </CardTitle>
            <CardDescription>Manage your financial accounts and track balances</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative">
              <TableLoadingBar
                isLoading={isLoading}
                className="absolute top-0 left-0 right-0 z-10"
              />

              {accounts.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="sticky top-0 z-10">
                      <TableRow className="hover:bg-transparent">
                        <TableHead>Account</TableHead>
                        <TableHead className="text-center">Type</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                        <TableHead className="text-center">Currency</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-center">Transactions</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading
                        ? // Skeleton loader rows
                          Array.from({ length: 3 }).map((_, index) => (
                            <TableRow key={`skeleton-${index}`}>
                              <TableCell className="py-2 px-3 sm:py-4 sm:px-6">
                                <div className="flex items-center gap-3">
                                  <Skeleton className="h-8 w-8 rounded" />
                                  <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <Skeleton className="h-6 w-16 mx-auto rounded-full" />
                              </TableCell>
                              <TableCell className="text-right">
                                <Skeleton className="h-4 w-20 ml-auto" />
                              </TableCell>
                              <TableCell className="text-center">
                                <Skeleton className="h-4 w-8 mx-auto" />
                              </TableCell>
                              <TableCell className="text-center">
                                <Skeleton className="h-6 w-16 mx-auto rounded-full" />
                              </TableCell>
                              <TableCell className="text-center">
                                <Skeleton className="h-4 w-12 mx-auto" />
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  <Skeleton className="h-8 w-8" />
                                  <Skeleton className="h-8 w-8" />
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        : accounts.map((account: FinanceAccount) => {
                            const TypeIcon =
                              accountTypeIcons[account.type as keyof typeof accountTypeIcons] ||
                              Wallet;
                            const typeColor = getAccountTypeColor(account.type);
                            const balanceColor = getBalanceColor(account.balance);

                            return (
                              <TableRow key={account.id}>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <div
                                      className="w-3 h-3 rounded-full flex-shrink-0"
                                      style={{ backgroundColor: account.color || '#3B82F6' }}
                                    />
                                    <div>
                                      <div className="font-medium">{account.name}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {account.description || 'No description'}
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  <div
                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${typeColor}`}
                                  >
                                    <TypeIcon className="h-3 w-3" />
                                    {account.type.replace('_', ' ')}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className={`font-semibold ${balanceColor}`}>
                                    {formatCurrency(account.balance, account.currency, {
                                      useLargeNumberFormat: false,
                                    })}
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge variant="outline" className="text-xs">
                                    {account.currency}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                  {account.isActive ? (
                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                      Active
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="secondary"
                                      className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                    >
                                      Deactivated
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-center">
                                  <span className="text-sm text-muted-foreground">
                                    {account._count?.transactions || 0}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                          onClick={() => {
                                            setSelectedAccount(account);
                                            setShowEditDialog(true);
                                          }}
                                        >
                                          <Edit className="h-4 w-4 mr-2" />
                                          Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => handleToggleActive(account)}
                                        >
                                          {account.isActive ? (
                                            <>
                                              <EyeOff className="h-4 w-4 mr-2" />
                                              Deactivate
                                            </>
                                          ) : (
                                            <>
                                              <Eye className="h-4 w-4 mr-2" />
                                              Activate
                                            </>
                                          )}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          onClick={() => {
                                            setSelectedAccount(account);
                                            setShowDeleteDialog(true);
                                          }}
                                          className="text-destructive"
                                        >
                                          <Trash2 className="h-4 w-4 mr-2" />
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">No accounts found</p>
                  <p className="text-muted-foreground mb-4">
                    Create your first account to get started
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Account
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Create Account Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Account</DialogTitle>
              <DialogDescription>
                Add a new financial account to track your balance and transactions.
              </DialogDescription>
            </DialogHeader>
            <AccountForm
              onSuccess={handleFormSuccess}
              onCancel={() => setShowCreateDialog(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Account Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Account</DialogTitle>
              <DialogDescription>Update your account details and settings.</DialogDescription>
            </DialogHeader>
            <AccountForm
              account={selectedAccount || undefined}
              onSuccess={handleFormSuccess}
              onCancel={() => {
                setShowEditDialog(false);
                setSelectedAccount(null);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Account Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogDescription className="space-y-2">
                <p>
                  Are you sure you want to permanently delete "{selectedAccount?.name}"? This action
                  cannot be undone.
                </p>
                {selectedAccount?._count?.transactions !== 0 && (
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Warning: This account has {selectedAccount?._count?.transactions}{' '}
                        transaction(s) associated with it. Deleting this account will also remove
                        all transaction history. Consider deactivating instead to preserve data.
                      </span>
                    </div>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteDialog(false);
                  setSelectedAccount(null);
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AnimatedDiv>
  );
}
