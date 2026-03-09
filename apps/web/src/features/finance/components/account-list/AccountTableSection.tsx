'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FilterField, TableFilters } from '@/components/ui/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TableLoadingBar } from '@/components/ui/table-loading-bar';
import {
  accountTypeIcons,
  getAccountTypeColor,
  getBalanceColor,
} from '@/features/finance/components/account-list.config';
import { accountColorSwatchStyle } from '@/features/finance/components/account-list.styles';
import { FinanceAccount } from '@/features/finance/queries/accounts';
import { formatCurrency } from '@/lib/currency';
import { Edit, Eye, EyeOff, MoreHorizontal, Plus, Trash2, Wallet } from 'lucide-react';

interface AccountTableSectionProps {
  accounts: FinanceAccount[];
  isLoading: boolean;
  filterFields: FilterField[];
  hasActiveFilters: boolean;
  isSyncing: boolean;
  onClearFilters: () => void;
  onSync: () => void;
  onCreateAccount: () => void;
  onEditAccount: (account: FinanceAccount) => void;
  onToggleAccountStatus: (account: FinanceAccount) => void;
  onDeleteAccount: (account: FinanceAccount) => void;
}

export function AccountTableSection({
  accounts,
  isLoading,
  filterFields,
  hasActiveFilters,
  isSyncing,
  onClearFilters,
  onSync,
  onCreateAccount,
  onEditAccount,
  onToggleAccountStatus,
  onDeleteAccount,
}: AccountTableSectionProps) {
  return (
    <div className="shadow rounded-lg border bg-card text-card-foreground">
      <div className="p-4 border-b flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <TableFilters
          fields={filterFields}
          onClearFilters={onClearFilters}
          onRefresh={onSync}
          isFetching={isSyncing || isLoading}
          hasActiveFilters={hasActiveFilters}
          layout="flex"
          showCard={false}
          className="items-center w-full"
        />
      </div>
      <div className="p-0">
        <div className="relative">
          <TableLoadingBar isLoading={isLoading} className="absolute top-0 left-0 right-0 z-10" />

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
                    ? Array.from({ length: 3 }).map((_, index) => (
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
                    : accounts.map(account => {
                        const TypeIcon =
                          accountTypeIcons[account.type as keyof typeof accountTypeIcons] || Wallet;
                        const typeColor = getAccountTypeColor(account.type);
                        const balanceColor = getBalanceColor(account.balance);

                        return (
                          <TableRow key={account.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-3 h-3 rounded-full flex-shrink-0"
                                  style={accountColorSwatchStyle(account.color)}
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
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => onEditAccount(account)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onToggleAccountStatus(account)}>
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
                                    onClick={() => onDeleteAccount(account)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
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
              <p className="text-muted-foreground mb-4">Create your first account to get started</p>
              <Button onClick={onCreateAccount}>
                <Plus className="h-4 w-4 mr-2" />
                Add Account
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
