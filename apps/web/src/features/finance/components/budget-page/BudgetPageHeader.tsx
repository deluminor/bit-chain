'use client';

import { Button } from '@/components/ui/button';
import { PieChart, Plus } from 'lucide-react';

interface BudgetPageHeaderProps {
  onCreateBudget?: () => void;
  isCreateDisabled?: boolean;
}

export function BudgetPageHeader({
  onCreateBudget,
  isCreateDisabled = false,
}: BudgetPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4 md:gap-0">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-primary shadow-sm">
          <PieChart className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Budget Planning</h1>
          <p className="text-muted-foreground">Track your spending and manage your finances</p>
        </div>
      </div>

      {onCreateBudget != null ? (
        <Button onClick={onCreateBudget} disabled={isCreateDisabled} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Create Budget
        </Button>
      ) : null}
    </div>
  );
}
