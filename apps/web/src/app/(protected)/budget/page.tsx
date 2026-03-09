'use client';

import { CreateBudgetForm } from '@/components/forms/CreateBudgetForm';
import { BudgetPerformanceChart } from '@/components/layout/charts/BudgetPerformanceChart';
import { AnimatedDiv } from '@/components/ui/animations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { BudgetInsightsGrid } from '@/features/finance/components/budget-page/BudgetInsightsGrid';
import { BudgetPageHeader } from '@/features/finance/components/budget-page/BudgetPageHeader';
import { BudgetPageLoading } from '@/features/finance/components/budget-page/BudgetPageLoading';
import { BudgetSummaryCards } from '@/features/finance/components/budget-page/BudgetSummaryCards';
import { BudgetTemplatesCard } from '@/features/finance/components/budget-page/BudgetTemplatesCard';
import { BudgetList } from '@/features/finance/components/BudgetList';
import {
  Budget,
  useApplyBudgetTemplate,
  useBudgets,
  useBudgetTemplates,
} from '@/features/finance/queries/budget';
import { useToast } from '@/hooks/use-toast';
import { Clock, PieChart } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export default function BudgetPage() {
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data: budgetsData, isLoading, error, refetch } = useBudgets();
  const { data: templates } = useBudgetTemplates();
  const applyTemplate = useApplyBudgetTemplate();

  useEffect(() => {
    if (!error) {
      return;
    }

    toast({
      title: 'Error',
      description: 'Failed to load budgets',
      variant: 'destructive',
    });
  }, [error, toast]);

  const budgets = useMemo(() => budgetsData?.budgets ?? [], [budgetsData?.budgets]);
  const summary =
    budgetsData?.summary ||
    ({
      total: 0,
      active: 0,
      totalPlanned: 0,
      totalActual: 0,
      totalPlannedBase: 0,
      totalActualBase: 0,
    } as const);

  const activeBudget = useMemo(
    () => budgets.find(budget => budget.isActive) || budgets[0],
    [budgets],
  );

  const totalPlannedBase = summary.totalPlannedBase ?? summary.totalPlanned;
  const totalActualBase = summary.totalActualBase ?? summary.totalActual;

  const handleFormSuccess = () => {
    void refetch();
  };

  const handleApplyTemplate = async (template: Budget) => {
    try {
      await applyTemplate.mutateAsync({ templateId: template.id });
      toast({
        title: 'Success',
        description: `Budget created from template "${template.templateName || template.name}"`,
      });
      void refetch();
    } catch (applyError) {
      toast({
        title: 'Error',
        description: applyError instanceof Error ? applyError.message : 'Failed to apply template',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <BudgetPageLoading />;
  }

  return (
    <AnimatedDiv variant="slideUp" className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <BudgetPageHeader onCreateBudget={() => setShowCreateForm(true)} />
      </div>

      <div className="px-4 lg:px-6">
        <BudgetSummaryCards totalPlannedBase={totalPlannedBase} totalActualBase={totalActualBase} />
      </div>

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

        <BudgetList
          budgets={budgets}
          onEdit={() => {}}
          onDelete={() => {}}
          onToggleStatus={() => {}}
          onCreate={() => setShowCreateForm(true)}
        />

        <BudgetTemplatesCard
          templates={templates}
          isApplyingTemplate={applyTemplate.isPending}
          onApplyTemplate={handleApplyTemplate}
          onCreateTemplate={() => setShowCreateForm(true)}
        />

        <Card className="shadow-md rounded-lg hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Budget Insights
            </CardTitle>
            <CardDescription>Category usage and proactive budget alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetInsightsGrid activeBudget={activeBudget} />
          </CardContent>
        </Card>
      </div>

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
