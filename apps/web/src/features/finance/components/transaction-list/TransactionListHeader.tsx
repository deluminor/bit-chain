'use client';

import { Button } from '@/components/ui/button';
import { Plus, Receipt, Upload } from 'lucide-react';

interface TransactionListHeaderProps {
  onOpenImport: () => void;
  onOpenCreate: () => void;
}

export function TransactionListHeader({ onOpenImport, onOpenCreate }: TransactionListHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="p-2 sm:p-3 rounded-xl bg-primary shadow-sm">
          <Receipt className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Transactions</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Track your income, expenses, and transfers
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Button variant="outline" onClick={onOpenImport}>
          <Upload className="h-4 w-4 mr-2" />
          Import CSV
        </Button>
        <Button onClick={onOpenCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </div>
    </div>
  );
}
