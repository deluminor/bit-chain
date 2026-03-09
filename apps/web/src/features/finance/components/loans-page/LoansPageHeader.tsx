'use client';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Landmark, Plus } from 'lucide-react';

interface LoansPageHeaderProps {
  showPaid: boolean;
  onToggleShowPaid: (value: boolean) => void;
  onCreateLoan: () => void;
}

export function LoansPageHeader({
  showPaid,
  onToggleShowPaid,
  onCreateLoan,
}: LoansPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4 md:gap-0">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-primary shadow-sm">
          <Landmark className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Loans & Debts</h1>
          <p className="text-muted-foreground">Track what you owe and what is owed to you</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div className="flex items-center gap-2 px-3 py-2 border rounded-lg">
          <Switch checked={showPaid} onCheckedChange={onToggleShowPaid} />
          <span className="text-sm text-muted-foreground">Show paid</span>
        </div>
        <Button onClick={onCreateLoan} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Loan
        </Button>
      </div>
    </div>
  );
}
