'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GoalForm } from '@/components/forms/GoalForm';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Target, TrendingUp, Calendar, DollarSign, Edit } from 'lucide-react';
import { useState } from 'react';
import { AnimatedDiv } from '@/components/ui/animations';
import {
  useGoals,
  calculateGoalProgress,
  getRemainingAmount,
  useUpdateGoal,
  FinancialGoal,
} from '@/features/finance/queries/goals';
import { useToast } from '@/hooks/use-toast';
import { formatDisplayAmount, BASE_CURRENCY } from '@/lib/currency';
import { StatCardSkeleton } from '@/components/ui/loading-skeleton';

export default function GoalsPage() {
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const { data: goalsData, isLoading, error, refetch } = useGoals();
  const updateGoal = useUpdateGoal();

  if (error) {
    toast({
      title: 'Error',
      description: 'Failed to load goals',
      variant: 'destructive',
    });
  }

  const goals = goalsData?.goals || [];
  const summary = goalsData?.summary || {
    total: 0,
    active: 0,
    totalTarget: 0,
    totalCurrent: 0,
    completed: 0,
  };

  const getDaysUntilDeadline = (deadline: string | null) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleFormSuccess = () => {
    refetch();
    setEditingGoal(null);
  };

  const handleAddFunds = async (goalId: string, amount: number) => {
    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) return;

      await updateGoal.mutateAsync({
        id: goalId,
        currentAmount: goal.currentAmount + amount,
      });

      toast({
        title: 'Success',
        description: `Added ${formatDisplayAmount(amount, goal.currency, 'detailed')} to your goal`,
      });

      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add funds',
        variant: 'destructive',
      });
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
    return (
      <AnimatedDiv variant="slideUp" className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
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
            <Button disabled>
              <Plus className="h-4 w-4 mr-2" />
              New Goal
            </Button>
          </div>
        </div>

        {/* Goals Overview Stats Skeleton */}
        <div className="px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        </div>

        {/* Goals List Skeleton */}
        <div className="px-4 lg:px-6 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-48 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Goal</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={`skeleton-${i}`}>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                            <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="h-2 w-full bg-muted rounded animate-pulse" />
                            <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                            <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </AnimatedDiv>
    );
  }

  return (
    <AnimatedDiv variant="slideUp" className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
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
          <Button onClick={() => setShowCreateForm(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            New Goal
          </Button>
        </div>
      </div>

      {/* Goals Overview Stats */}
      <div className="px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-2 md:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </div>
              <h3 className="font-semibold">Total Target</h3>
            </div>
            <div className="text-2xl font-bold mb-1">
              {formatDisplayAmount(summary.totalTarget, BASE_CURRENCY, 'summary')}
            </div>
            <p className="text-sm text-muted-foreground">Target amount</p>
          </Card>

          <Card className="p-2 md:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Calendar className="h-5 w-5 text-orange-500" />
              </div>
              <h3 className="font-semibold">Next Deadline</h3>
            </div>
            <div className="text-2xl font-bold mb-1">
              {goals.length > 0
                ? Math.min(
                    ...(goals
                      .filter(g => g.deadline)
                      .map(g => getDaysUntilDeadline(g.deadline))
                      .filter(d => d !== null && d > 0) as number[]),
                  )
                : 0}
            </div>
            <p className="text-sm text-muted-foreground">Days remaining</p>
          </Card>
          <Card className="p-2 md:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Target className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="font-semibold">Active Goals</h3>
            </div>
            <div className="text-2xl font-bold mb-1">{summary.active}</div>
            <p className="text-sm text-muted-foreground">In progress</p>
          </Card>
        </div>
      </div>

      {/* Goals Table */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardContent className="p-0">
            {goals.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Goal</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead className="text-right">Current / Target</TableHead>
                      <TableHead className="text-center">Deadline</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {goals.map(goal => {
                      const progress = calculateGoalProgress(goal.currentAmount, goal.targetAmount);
                      const _remaining = getRemainingAmount(goal.currentAmount, goal.targetAmount);
                      const daysLeft = getDaysUntilDeadline(goal.deadline);

                      return (
                        <TableRow key={goal.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">{goal.icon}</div>
                              <div>
                                <div className="font-medium">{goal.name}</div>
                                {goal.description && (
                                  <div className="text-xs text-muted-foreground">
                                    {goal.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>{Math.round(progress)}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="space-y-1">
                              <div className="font-semibold">
                                {formatDisplayAmount(goal.currentAmount, goal.currency, 'detailed')}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                of{' '}
                                {formatDisplayAmount(goal.targetAmount, goal.currency, 'detailed')}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {goal.deadline ? (
                              <div className="flex items-center justify-center gap-1 text-sm">
                                <Calendar className="h-3 w-3" />
                                <span
                                  className={
                                    daysLeft !== null && daysLeft <= 0 ? 'text-red-500' : ''
                                  }
                                >
                                  {daysLeft !== null && daysLeft > 0
                                    ? `${daysLeft}d left`
                                    : daysLeft !== null && daysLeft <= 0
                                      ? 'Overdue'
                                      : 'Invalid'}
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">No deadline</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {progress >= 100 ? (
                              <div className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                                Completed
                              </div>
                            ) : (
                              <div className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                                In Progress
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const amount = prompt(
                                    `How much would you like to add to ${goal.name}?`,
                                  );
                                  if (
                                    amount &&
                                    !isNaN(parseFloat(amount)) &&
                                    parseFloat(amount) > 0
                                  ) {
                                    handleAddFunds(goal.id, parseFloat(amount));
                                  }
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <DollarSign className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditGoal(goal)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <Target className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No goals found</p>
                <p className="mb-4">Create your first financial goal to get started</p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Goal
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Achievement Section */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Achievement Insights
            </CardTitle>
            <CardDescription>Your progress and milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-500/10 rounded-lg">
                <div className="text-2xl font-bold text-green-500">
                  {summary.totalTarget > 0
                    ? Math.round((summary.totalCurrent / summary.totalTarget) * 100)
                    : 0}
                  %
                </div>
                <div className="text-sm text-muted-foreground">Overall Progress</div>
              </div>

              <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                <div className="text-2xl font-bold text-blue-500">
                  {formatDisplayAmount(
                    summary.totalCurrent / Math.max(goals.length, 1),
                    BASE_CURRENCY,
                    'summary',
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Avg per Goal</div>
              </div>

              <div className="text-center p-4 bg-purple-500/10 rounded-lg">
                <div className="text-2xl font-bold text-purple-500">{summary.completed}</div>
                <div className="text-sm text-muted-foreground">Completed Goals</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Goal Form Modal */}
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
    </AnimatedDiv>
  );
}
