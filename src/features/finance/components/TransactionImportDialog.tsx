'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Upload } from 'lucide-react';
import { useAccounts } from '@/features/finance/queries/accounts';
import type { FinanceAccount } from '@/features/finance/queries/accounts';
import { useTransactionCategories } from '@/features/finance/queries/transactions';
import {
  useImportTransactions,
  usePreviewTransactionImport,
  type TransactionCategory,
  type TransactionImportPreviewItem,
  type TransactionImportRequestItem,
} from '@/features/finance/queries/transactions';

interface TransactionImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface EditableImportRow extends TransactionImportPreviewItem {
  include: boolean;
}

const formatDateTimeInput = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (num: number) => String(num).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
};

const parseDateTimeInput = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

export function TransactionImportDialog({
  open,
  onOpenChange,
  onSuccess,
}: TransactionImportDialogProps) {
  const { toast } = useToast();
  const { data: accountsData } = useAccounts();
  const { data: incomeCategoriesData } = useTransactionCategories('INCOME');
  const { data: expenseCategoriesData } = useTransactionCategories('EXPENSE');
  const previewMutation = usePreviewTransactionImport();
  const importMutation = useImportTransactions();

  const accounts = (accountsData?.accounts || []) as FinanceAccount[];
  const incomeCategories = (incomeCategoriesData?.categories || []) as TransactionCategory[];
  const expenseCategories = (expenseCategoriesData?.categories || []) as TransactionCategory[];

  const [accountId, setAccountId] = useState('');
  const [incomeCategoryId, setIncomeCategoryId] = useState('');
  const [expenseCategoryId, setExpenseCategoryId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<EditableImportRow[]>([]);
  const [sourceLabel, setSourceLabel] = useState<string | null>(null);
  const [skippedCount, setSkippedCount] = useState(0);

  const canPreview = Boolean(accountId && incomeCategoryId && expenseCategoryId && file);

  const resetState = () => {
    setFile(null);
    setRows([]);
    setSourceLabel(null);
    setSkippedCount(0);
    previewMutation.reset();
  };

  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open]);

  const previewSummary = previewMutation.data?.summary;

  const includedRows = useMemo(() => rows.filter(row => row.include), [rows]);

  const handlePreview = async () => {
    if (!file) return;
    try {
      const response = await previewMutation.mutateAsync({
        file,
        accountId,
        incomeCategoryId,
        expenseCategoryId,
      });

      setRows(
        response.items.map(item => ({
          ...item,
          include: !item.duplicate,
        })),
      );
      setSourceLabel(response.source);
      setSkippedCount(response.skipped || 0);
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error && 'response' in error && error.response
            ? 'Failed to parse CSV'
            : 'Failed to parse CSV',
        variant: 'destructive',
      });
    }
  };

  const handleImport = async () => {
    if (!includedRows.length) {
      toast({
        title: 'Nothing to import',
        description: 'Select at least one transaction to import.',
      });
      return;
    }

    const payload: TransactionImportRequestItem[] = includedRows.map(row => ({
      type: row.type,
      amount: row.amount,
      currency: row.currency,
      description: row.description,
      date: row.date,
      categoryId: row.categoryId,
    }));

    try {
      await importMutation.mutateAsync({ accountId, items: payload });
      toast({
        title: 'Import completed',
        description: `${payload.length} transaction(s) imported successfully.`,
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Import failed',
        description:
          error instanceof Error && 'response' in error && error.response
            ? 'Failed to import transactions'
            : 'Failed to import transactions',
        variant: 'destructive',
      });
    }
  };

  const handleRowUpdate = (id: string, updates: Partial<EditableImportRow>) => {
    setRows(prev => prev.map(row => (row.id === id ? { ...row, ...updates } : row)));
  };

  const handleRowTypeChange = (id: string, nextType: 'INCOME' | 'EXPENSE') => {
    const nextCategory = nextType === 'INCOME' ? incomeCategoryId : expenseCategoryId;
    handleRowUpdate(id, { type: nextType, categoryId: nextCategory });
  };

  const handleRowRemove = (id: string) => {
    setRows(prev => prev.filter(row => row.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import CSV
          </DialogTitle>
          <DialogDescription>
            Upload a Revolut or Monobank CSV file to preview and import transactions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Account *</Label>
              <Select value={accountId} onValueChange={setAccountId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map(account => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name} ({account.currency})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Default Income Category *</Label>
              <Select value={incomeCategoryId} onValueChange={setIncomeCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select income category" />
                </SelectTrigger>
                <SelectContent>
                  {incomeCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Default Expense Category *</Label>
              <Select value={expenseCategoryId} onValueChange={setExpenseCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select expense category" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
            <div className="space-y-2">
              <Label>CSV File *</Label>
              <Input
                type="file"
                accept=".csv,text/csv"
                onChange={event => {
                  const selectedFile = event.target.files?.[0] ?? null;
                  setFile(selectedFile);
                }}
              />
            </div>
            <Button onClick={handlePreview} disabled={!canPreview || previewMutation.isPending}>
              {previewMutation.isPending ? 'Parsing...' : 'Preview CSV'}
            </Button>
          </div>

          {(previewSummary || rows.length > 0) && (
            <div className="space-y-4">
              <Separator />
              <div className="flex flex-wrap gap-3 items-center">
                {sourceLabel && <Badge variant="secondary">Source: {sourceLabel}</Badge>}
                <Badge variant="outline">Rows: {previewSummary?.total ?? rows.length}</Badge>
                <Badge variant="outline">Duplicates: {previewSummary?.duplicates ?? 0}</Badge>
                {skippedCount > 0 && <Badge variant="outline">Skipped: {skippedCount}</Badge>}
              </div>

              <div className="border rounded-lg overflow-auto max-h-[380px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Import</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="w-[120px] text-right">Amount</TableHead>
                      <TableHead className="w-[90px]">Currency</TableHead>
                      <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map(row => {
                      const categoryOptions =
                        row.type === 'INCOME' ? incomeCategories : expenseCategories;
                      return (
                        <TableRow key={row.id} className={row.duplicate ? 'bg-muted/50' : ''}>
                          <TableCell>
                            <Checkbox
                              checked={row.include}
                              disabled={row.duplicate}
                              onCheckedChange={checked =>
                                handleRowUpdate(row.id, { include: Boolean(checked) })
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="datetime-local"
                              value={formatDateTimeInput(row.date)}
                              onChange={event => {
                                const nextValue = parseDateTimeInput(event.target.value);
                                if (nextValue) {
                                  handleRowUpdate(row.id, { date: nextValue });
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <Input
                                value={row.description}
                                onChange={event =>
                                  handleRowUpdate(row.id, { description: event.target.value })
                                }
                              />
                              {row.duplicate && <Badge variant="destructive">Duplicate</Badge>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={row.type}
                              onValueChange={value =>
                                handleRowTypeChange(row.id, value as 'INCOME' | 'EXPENSE')
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="INCOME">Income</SelectItem>
                                <SelectItem value="EXPENSE">Expense</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={row.categoryId}
                              onValueChange={value =>
                                handleRowUpdate(row.id, { categoryId: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {categoryOptions.map(category => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              value={row.amount}
                              onChange={event =>
                                handleRowUpdate(row.id, {
                                  amount: Number.parseFloat(event.target.value) || 0,
                                })
                              }
                              className="text-right"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={row.currency}
                              onChange={event =>
                                handleRowUpdate(row.id, {
                                  currency: event.target.value.toUpperCase(),
                                })
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRowRemove(row.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              {includedRows.length} of {rows.length} selected
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={importMutation.isPending || includedRows.length === 0}
              >
                {importMutation.isPending ? 'Importing...' : 'Import Selected'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
