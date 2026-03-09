'use client';

import { Card } from '@/components/ui/card';
import { Budget } from '@/features/finance/queries/budget';
import { formatEuroAmount } from '@/lib/currency';

interface BudgetInsightsGridProps {
  activeBudget: Budget | undefined;
}

export function BudgetInsightsGrid({ activeBudget }: BudgetInsightsGridProps) {
  return (
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
                      <div className="text-sm text-muted-foreground">{usagePercentage}% used</div>
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
              .filter(category => (category.plannedBase ?? category.planned) > 0)
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
                    className={`p-3 rounded-lg border ${
                      alertColors[alertType as keyof typeof alertColors]
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          dotColors[alertType as keyof typeof dotColors]
                        }`}
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
  );
}
