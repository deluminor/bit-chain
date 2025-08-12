'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BudgetPerformanceChart } from '@/components/layout/charts/BudgetPerformanceChart';
import { CreateBudgetForm } from '@/components/forms/CreateBudgetForm';
import { Button } from '@/components/ui/button';
import { Plus, PieChart, TrendingUp, DollarSign, Target } from 'lucide-react';
import { useState } from 'react';
import { AnimatedDiv } from '@/components/ui/animations';
import { useBudgets } from '@/features/finance/queries/budget';
import { useToast } from '@/hooks/use-toast';
import { formatSummaryAmount, formatDisplayAmount } from '@/lib/currency';
import { StatCardSkeleton, ChartSkeleton, CardSkeleton } from '@/components/ui/loading-skeleton';

export default function BudgetPage() {
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data: budgetsData, isLoading, error, refetch } = useBudgets();

  if (error) {
    toast({
      title: 'Error',
      description: 'Failed to load budgets',
      variant: 'destructive',
    });
  }

  const budgets = budgetsData?.budgets || [];
  const summary = budgetsData?.summary || {
    total: 0,
    active: 0,
    totalPlanned: 0,
    totalActual: 0,
  };

  const activeBudget = budgets.find(b => b.isActive) || budgets[0];

  const handleFormSuccess = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <AnimatedDiv variant="slideUp" className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary shadow-sm">
                <PieChart className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Budget Planning</h1>
                <p className="text-muted-foreground">
                  Track your spending and manage your finances
                </p>
              </div>
            </div>
            <Button disabled>
              <Plus className="h-4 w-4 mr-2" />
              Create Budget
            </Button>
          </div>
        </div>

        {/* Budget Overview Stats Skeleton */}
        <div className="px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        </div>

        {/* Budget Performance Chart Skeleton */}
        <div className="px-4 lg:px-6 space-y-6">
          <ChartSkeleton />

          {/* Category Budget Breakdown Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </AnimatedDiv>
    );
  }

  return (
    <AnimatedDiv variant="slideUp" className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary shadow-sm">
              <PieChart className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Budget Planning</h1>
              <p className="text-muted-foreground">Track your spending and manage your finances</p>
            </div>
          </div>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Budget
          </Button>
        </div>
      </div>

      {/* Budget Overview Stats */}
      <div className="px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="font-semibold">Total Budgeted</h3>
            </div>
            <div className="text-2xl font-bold mb-1">
              {formatSummaryAmount(summary.totalPlanned)}
            </div>
            <p className="text-sm text-muted-foreground">Total planned</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="font-semibold">Total Spent</h3>
            </div>
            <div className="text-2xl font-bold mb-1">
              {formatSummaryAmount(summary.totalActual)}
            </div>
            <p className="text-sm text-muted-foreground">
              {summary.totalPlanned > 0
                ? Math.round((summary.totalActual / summary.totalPlanned) * 100)
                : 0}
              % of budget
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Target className="h-5 w-5 text-purple-500" />
              </div>
              <h3 className="font-semibold">Remaining</h3>
            </div>
            <div className="text-2xl font-bold mb-1">
              {formatSummaryAmount(Math.max(summary.totalPlanned - summary.totalActual, 0))}
            </div>
            <p className="text-sm text-muted-foreground">
              {summary.totalPlanned > 0
                ? Math.round(
                    ((summary.totalPlanned - summary.totalActual) / summary.totalPlanned) * 100,
                  )
                : 0}
              % remaining
            </p>
          </Card>
        </div>
      </div>

      {/* Budget Performance Chart */}
      <div className="px-4 lg:px-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Budget Performance
            </CardTitle>
            <CardDescription>Your budget vs actual spending by category</CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetPerformanceChart />
          </CardContent>
        </Card>

        {/* Category Budget Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Category Breakdown</h3>
            <div className="space-y-4">
              {activeBudget ? (
                activeBudget.categories.length > 0 ? (
                  activeBudget.categories.map(budgetCategory => {
                    const usagePercentage =
                      budgetCategory.planned > 0
                        ? Math.round((budgetCategory.actual / budgetCategory.planned) * 100)
                        : 0;

                    return (
                      <div key={budgetCategory.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: budgetCategory.category.color }}
                          ></div>
                          <span>{budgetCategory.category.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {formatDisplayAmount(
                              budgetCategory.actual,
                              activeBudget.currency,
                              'detailed',
                            )}{' '}
                            /{' '}
                            {formatDisplayAmount(
                              budgetCategory.planned,
                              activeBudget.currency,
                              'detailed',
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {usagePercentage}% used
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-muted-foreground text-center">No categories allocated</p>
                )
              ) : (
                <p className="text-muted-foreground text-center">No active budget found</p>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Budget Alerts</h3>
            <div className="space-y-3">
              {activeBudget && activeBudget.categories.length > 0 ? (
                activeBudget.categories
                  .filter(cat => cat.planned > 0)
                  .map(budgetCategory => {
                    const usagePercentage = Math.round(
                      (budgetCategory.actual / budgetCategory.planned) * 100,
                    );
                    let alertType = 'green';
                    let alertMessage = 'On Track';
                    let alertDescription = `You're staying within your ${budgetCategory.category.name.toLowerCase()} budget`;

                    if (usagePercentage >= 90) {
                      alertType = 'red';
                      alertMessage = 'Near Limit';
                      alertDescription = `You're approaching your ${budgetCategory.category.name.toLowerCase()} budget limit`;
                    } else if (usagePercentage >= 75) {
                      alertType = 'yellow';
                      alertMessage = 'High Usage';
                      alertDescription = `You've spent ${usagePercentage}% of your ${budgetCategory.category.name.toLowerCase()} budget`;
                    }

                    const alertColors = {
                      green: 'bg-green-500/10 border-green-500/20',
                      yellow: 'bg-yellow-500/10 border-yellow-500/20',
                      red: 'bg-red-500/10 border-red-500/20',
                    };

                    const dotColors = {
                      green: 'bg-green-500',
                      yellow: 'bg-yellow-500',
                      red: 'bg-red-500',
                    };

                    return (
                      <div
                        key={budgetCategory.id}
                        className={`p-3 rounded-lg border ${alertColors[alertType as keyof typeof alertColors]}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className={`w-2 h-2 rounded-full ${dotColors[alertType as keyof typeof dotColors]}`}
                          ></div>
                          <span className="font-medium text-sm">
                            {budgetCategory.category.name} - {alertMessage}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{alertDescription}</p>
                      </div>
                    );
                  })
              ) : (
                <p className="text-muted-foreground text-center">No budget alerts</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Create Budget Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-lg w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Create New Budget</h2>
            <CreateBudgetForm
              onClose={() => setShowCreateForm(false)}
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      )}
    </AnimatedDiv>
  );
}
