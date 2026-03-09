'use client';

import { AddFundsDialog } from '@/components/dialogs/AddFundsDialog';
import { GoalForm } from '@/components/forms/GoalForm';
import { AnimatedDiv } from '@/components/ui/animations';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GoalsInsightsCard } from '@/features/finance/components/goals-page/GoalsInsightsCard';
import { GoalsPageHeader } from '@/features/finance/components/goals-page/GoalsPageHeader';
import { GoalsPageLoading } from '@/features/finance/components/goals-page/GoalsPageLoading';
import { GoalsSummaryCards } from '@/features/finance/components/goals-page/GoalsSummaryCards';
import { GoalsTable } from '@/features/finance/components/goals-page/GoalsTable';
import { FinancialGoal, useGoals, useUpdateGoal } from '@/features/finance/queries/goals';
import { useToast } from '@/hooks/use-toast';
import { formatDisplayAmount } from '@/lib/currency';
import { useEffect, useMemo, useState } from 'react';

function getDaysUntilDeadline(deadline: string | null): number | null {
  if (!deadline) return null;
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default function GoalsPage() {
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const [addFundsGoal, setAddFundsGoal] = useState<FinancialGoal | null>(null);
  const { data: goalsData, isLoading, error, refetch } = useGoals();
  const updateGoal = useUpdateGoal();

  useEffect(() => {
    if (!error) {
      return;
    }

    toast({
      title: 'Error',
      description: 'Failed to load goals',
      variant: 'destructive',
    });
  }, [error, toast]);

  const goals = useMemo(
    () =>
      [...(goalsData?.goals || [])].sort((a, b) => {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }),
    [goalsData?.goals],
  );

  const summary =
    goalsData?.summary ||
    ({
      total: 0,
      active: 0,
      totalTarget: 0,
      totalCurrent: 0,
      completed: 0,
    } as const);

  const nearestDeadlineDays = useMemo(() => {
    const days = goals
      .filter(goal => goal.deadline)
      .map(goal => getDaysUntilDeadline(goal.deadline))
      .filter((day): day is number => day !== null && day > 0);

    if (days.length === 0) {
      return null;
    }

    return Math.min(...days);
  }, [goals]);

  const handleFormSuccess = () => {
    void refetch();
    setEditingGoal(null);
  };

  const handleAddFunds = async (amount: number) => {
    if (!addFundsGoal) return;

    try {
      await updateGoal.mutateAsync({
        id: addFundsGoal.id,
        currentAmount: addFundsGoal.currentAmount + amount,
      });

      toast({
        title: 'Success',
        description: `Added ${formatDisplayAmount(amount, addFundsGoal.currency, 'detailed')} to your goal`,
      });

      void refetch();
    } catch (mutationError) {
      toast({
        title: 'Error',
        description: mutationError instanceof Error ? mutationError.message : 'Failed to add funds',
        variant: 'destructive',
      });
      throw mutationError;
    }
  };

  const handleEditGoal = (goal: FinancialGoal) => {
    setEditingGoal(goal);
    setShowCreateForm(true);
  };

  const closeForm = () => {
    setShowCreateForm(false);
    setEditingGoal(null);
  };

  if (isLoading) {
    return <GoalsPageLoading />;
  }

  return (
    <AnimatedDiv variant="slideUp" className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <GoalsPageHeader onCreateGoal={() => setShowCreateForm(true)} />
      </div>

      <div className="px-4 lg:px-6">
        <GoalsSummaryCards summary={summary} nearestDeadlineDays={nearestDeadlineDays} />
      </div>

      <div className="px-4 lg:px-6">
        <GoalsTable
          goals={goals}
          onAddFunds={goal => setAddFundsGoal(goal)}
          onEditGoal={handleEditGoal}
          onCreateGoal={() => setShowCreateForm(true)}
        />
      </div>

      <div className="px-4 lg:px-6">
        <GoalsInsightsCard summary={summary} goalsCount={goals.length} />
      </div>

      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingGoal ? 'Edit Goal' : 'Create New Goal'}</DialogTitle>
          </DialogHeader>
          <GoalForm
            onClose={closeForm}
            onSuccess={handleFormSuccess}
            goal={editingGoal || undefined}
          />
        </DialogContent>
      </Dialog>

      {addFundsGoal && (
        <AddFundsDialog
          open={!!addFundsGoal}
          onOpenChange={open => !open && setAddFundsGoal(null)}
          goalName={addFundsGoal.name}
          currentAmount={addFundsGoal.currentAmount}
          targetAmount={addFundsGoal.targetAmount}
          currency={addFundsGoal.currency}
          onConfirm={handleAddFunds}
        />
      )}
    </AnimatedDiv>
  );
}
