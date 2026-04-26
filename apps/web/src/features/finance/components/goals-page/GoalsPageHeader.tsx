'use client';

import { Button } from '@/components/ui/button';
import { Plus, Target } from 'lucide-react';

interface GoalsPageHeaderProps {
  onCreateGoal?: () => void;
  createDisabled?: boolean;
}

export function GoalsPageHeader({ onCreateGoal, createDisabled = false }: GoalsPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4 md:gap-0">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-primary shadow-sm">
          <Target className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Financial Goals</h1>
          <p className="text-muted-foreground">Track and achieve your financial objectives</p>
        </div>
      </div>
      {onCreateGoal != null ? (
        <Button onClick={onCreateGoal} disabled={createDisabled} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Goal
        </Button>
      ) : null}
    </div>
  );
}
