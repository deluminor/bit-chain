'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { FinanceAccount } from '@/features/finance/queries/accounts';
import { useAccounts } from '@/features/finance/queries/accounts';
import {
  useImportTransactions,
  usePreviewTransactionImport,
  useTransactionCategories,
  type TransactionCategory,
  type TransactionImportRequestItem,
} from '@/features/finance/queries/transactions';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TransactionImportConfigSection } from './transaction-import/TransactionImportConfigSection';
import { TransactionImportPreviewSection } from './transaction-import/TransactionImportPreviewSection';
import { type EditableImportRow } from './transaction-import/transaction-import.types';

interface TransactionImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

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

  const resetPreviewRef = useRef(previewMutation.reset);
  resetPreviewRef.current = previewMutation.reset;

  useEffect(() => {
    if (open) {
      return;
    }
    setFile(null);
    setRows([]);
    setSourceLabel(null);
    setSkippedCount(0);
    resetPreviewRef.current();
  }, [open]);

  const previewSummary = previewMutation.data?.summary;
  const includedRows = useMemo(() => rows.filter(row => row.include), [rows]);

  const handlePreview = async () => {
    if (!file) {
      return;
    }

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
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to parse CSV',
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
    } catch {
      toast({
        title: 'Import failed',
        description: 'Failed to import transactions',
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

  const handleCloseDialog = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
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
          <TransactionImportConfigSection
            accounts={accounts}
            incomeCategories={incomeCategories}
            expenseCategories={expenseCategories}
            accountId={accountId}
            incomeCategoryId={incomeCategoryId}
            expenseCategoryId={expenseCategoryId}
            onAccountChange={setAccountId}
            onIncomeCategoryChange={setIncomeCategoryId}
            onExpenseCategoryChange={setExpenseCategoryId}
            onFileChange={setFile}
            onPreview={handlePreview}
            canPreview={canPreview}
            isPreviewPending={previewMutation.isPending}
          />

          <TransactionImportPreviewSection
            rows={rows}
            sourceLabel={sourceLabel}
            skippedCount={skippedCount}
            totalRows={previewSummary?.total ?? rows.length}
            duplicates={previewSummary?.duplicates ?? 0}
            incomeCategories={incomeCategories}
            expenseCategories={expenseCategories}
            onRowUpdate={handleRowUpdate}
            onRowTypeChange={handleRowTypeChange}
            onRowRemove={handleRowRemove}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              {includedRows.length} of {rows.length} selected
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCloseDialog}>
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
