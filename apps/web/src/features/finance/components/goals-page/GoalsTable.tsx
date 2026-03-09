'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { calculateGoalProgress, FinancialGoal } from '@/features/finance/queries/goals';
import { formatDisplayAmount } from '@/lib/currency';
import { Calendar, DollarSign, Edit, Plus, Target } from 'lucide-react';

interface GoalsTableProps {
  goals: FinancialGoal[];
  onAddFunds: (goal: FinancialGoal) => void;
  onEditGoal: (goal: FinancialGoal) => void;
  onCreateGoal: () => void;
}

function getDaysUntilDeadline(deadline: string | null): number | null {
  if (!deadline) return null;
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function GoalsTable({ goals, onAddFunds, onEditGoal, onCreateGoal }: GoalsTableProps) {
  return (
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
                            of {formatDisplayAmount(goal.targetAmount, goal.currency, 'detailed')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {goal.deadline ? (
                          <div className="flex items-center justify-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            <span
                              className={daysLeft !== null && daysLeft <= 0 ? 'text-red-500' : ''}
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
                            onClick={() => onAddFunds(goal)}
                            className="h-8 w-8 p-0"
                          >
                            <DollarSign className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onEditGoal(goal)}
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
            <Button onClick={onCreateGoal}>
              <Plus className="h-4 w-4 mr-2" />
              Create Goal
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
