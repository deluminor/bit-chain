'use client';

import { CreateBudgetForm } from '@/components/forms/CreateBudgetForm';
import { BudgetPerformanceChart } from '@/components/layout/charts/BudgetPerformanceChart';
import { AnimatedDiv } from '@/components/ui/animations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CardSkeleton, ChartSkeleton, StatCardSkeleton } from '@/components/ui/loading-skeleton';
import { BudgetList } from '@/features/finance/components/BudgetList';
import {
  useApplyBudgetTemplate,
  useBudgets,
  useBudgetTemplates,
} from '@/features/finance/queries/budget';
import { useToast } from '@/hooks/use-toast';
import { formatEuroAmount } from '@/lib/currency';
import {
  Clock,
  DollarSign,
  Edit,
  MoreHorizontal,
  PieChart,
  Plus,
  Target,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';

export default function BudgetPage() {
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data: budgetsData, isLoading, error, refetch } = useBudgets();
  const { data: templates } = useBudgetTemplates();
  const applyTemplate = useApplyBudgetTemplate();

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
    totalPlannedBase: 0,
    totalActualBase: 0,
  };

  const activeBudget = budgets.find(b => b.isActive) || budgets[0];
  const totalPlannedBase = summary.totalPlannedBase ?? summary.totalPlanned;
  const totalActualBase = summary.totalActualBase ?? summary.totalActual;

  const handleFormSuccess = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <AnimatedDiv variant="slideUp" className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4 md:gap-0">
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
        <div className="px-4 lg:px-6 space-y-8 md:space-y-12">
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
          <Button onClick={() => setShowCreateForm(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create Budget
          </Button>
        </div>
      </div>

      {/* Budget Overview Stats */}
      <div className="px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-2 md:p-6 shadow-md rounded-lg hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="font-semibold">Total Budgeted</h3>
            </div>
            <div className="text-2xl font-bold mb-1">{formatEuroAmount(totalPlannedBase)}</div>
            <p className="text-sm text-muted-foreground">Total planned</p>
          </Card>

          <Card className="p-2 md:p-6 shadow-md rounded-lg hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="font-semibold">Total Spent</h3>
            </div>
            <div className="text-2xl font-bold mb-1">{formatEuroAmount(totalActualBase)}</div>
            <p className="text-sm text-muted-foreground">
              {totalPlannedBase > 0 ? Math.round((totalActualBase / totalPlannedBase) * 100) : 0}%
              of budget
            </p>
          </Card>

          <Card className="p-2 md:p-6 shadow-md rounded-lg hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Target className="h-5 w-5 text-purple-500" />
              </div>
              <h3 className="font-semibold">Remaining</h3>
            </div>
            <div className="text-2xl font-bold mb-1">
              {formatEuroAmount(Math.max(totalPlannedBase - totalActualBase, 0))}
            </div>
            <p className="text-sm text-muted-foreground">
              {totalPlannedBase > 0
                ? Math.round(((totalPlannedBase - totalActualBase) / totalPlannedBase) * 100)
                : 0}
              % remaining
            </p>
          </Card>
        </div>
      </div>

      {/* Budget Performance Chart */}
      <div className="px-4 lg:px-6 space-y-6">
        <Card className="shadow-md rounded-lg hover:shadow-lg transition-shadow">
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

        {/* Budget List */}
        <BudgetList
          budgets={budgets} // TS might complain if types don't strictly match, hopefully inferred type matches
          onEdit={budget => {
            // TODO: Implement edit
            console.log('Edit budget', budget);
          }}
          onDelete={budget => {
            // TODO: Implement delete
            console.log('Delete budget', budget);
          }}
          onToggleStatus={budget => {
            // TODO: Implement toggle
            console.log('Toggle status', budget);
          }}
          onCreate={() => setShowCreateForm(true)}
        />

        {/* Budget Templates */}
        <Card className="shadow-md rounded-lg hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Monthly Budget Templates
            </CardTitle>
            <CardDescription>Templates for automatically creating monthly budgets</CardDescription>
          </CardHeader>
          <CardContent>
            {templates && templates.length > 0 ? (
              <div className="space-y-4">
                {templates.map(template => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <div>
                          <h4 className="font-medium">{template.templateName || template.name}</h4>
                          <div className="text-sm text-muted-foreground">
                            {template.categories.length} categories •{' '}
                            {formatEuroAmount(template.totalPlannedBase ?? template.totalPlanned)}{' '}
                            total
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          try {
                            await applyTemplate.mutateAsync({ templateId: template.id });
                            toast({
                              title: 'Success',
                              description: `Budget created from template "${template.templateName || template.name}"`,
                            });
                          } catch (error) {
                            toast({
                              title: 'Error',
                              description:
                                error instanceof Error ? error.message : 'Failed to apply template',
                              variant: 'destructive',
                            });
                          }
                        }}
                        disabled={applyTemplate.isPending}
                      >
                        {applyTemplate.isPending ? 'Creating...' : 'Apply for This Month'}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Template
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Template
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-muted-foreground mb-4">No budget templates created yet</div>
                <p className="text-sm text-muted-foreground mb-4">
                  Create a budget and mark it as a template to reuse it monthly
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Budget Template
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Budget Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-2 md:p-6">
            <h3 className="font-semibold mb-4">Category Breakdown</h3>
            <div className="space-y-4">
              {activeBudget ? (
                activeBudget.categories.length > 0 ? (
                  activeBudget.categories.map(budgetCategory => {
                    const plannedBase = budgetCategory.plannedBase ?? budgetCategory.planned;
                    const actualBase = budgetCategory.actualBase ?? budgetCategory.actual;
                    const usagePercentage =
                      plannedBase > 0 ? Math.round((actualBase / plannedBase) * 100) : 0;

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
                            {formatEuroAmount(actualBase)} / {formatEuroAmount(plannedBase)}
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

          <Card className="p-2 md:p-6">
            <h3 className="font-semibold mb-4">Budget Alerts</h3>
            <div className="space-y-3">
              {activeBudget && activeBudget.categories.length > 0 ? (
                activeBudget.categories
                  .filter(cat => (cat.plannedBase ?? cat.planned) > 0)
                  .map(budgetCategory => {
                    const plannedBase = budgetCategory.plannedBase ?? budgetCategory.planned;
                    const actualBase = budgetCategory.actualBase ?? budgetCategory.actual;
                    const usagePercentage = Math.round((actualBase / plannedBase) * 100);
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
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <CreateBudgetForm
            onClose={() => setShowCreateForm(false)}
            onSuccess={handleFormSuccess}
          />
        </DialogContent>
      </Dialog>
    </AnimatedDiv>
  );
}
