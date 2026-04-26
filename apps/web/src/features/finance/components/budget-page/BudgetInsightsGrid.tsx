'use client';

import { Card } from '@/components/ui/card';
import { Budget } from '@/features/finance/queries/budget';
import { formatEuroAmount } from '@/lib/currency';
import { cn } from '@/lib/utils';

import { compareBudgetCategoriesByAlertSeverity } from './budget-alerts-severity';

interface BudgetInsightsGridProps {
  activeBudget: Budget | undefined;
}

type UsageBand = 'none' | 'ok' | 'caution' | 'critical' | 'over';

function getUsageBand(percent: number, hasPlanned: boolean): UsageBand {
  if (!hasPlanned) {
    return 'none';
  }
  if (percent > 100) {
    return 'over';
  }
  if (percent >= 90) {
    return 'critical';
  }
  if (percent >= 75) {
    return 'caution';
  }
  return 'ok';
}

const BAND_INDICATOR: Record<Exclude<UsageBand, 'none'>, string> = {
  ok: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.45)]',
  caution: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]',
  critical: 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.45)]',
  over: 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.55)]',
};

function CategoryUsageBar({
  percentOfTarget,
  band,
  hasPlanned,
}: {
  percentOfTarget: number;
  band: UsageBand;
  hasPlanned: boolean;
}) {
  const widthPercent = hasPlanned ? Math.min(percentOfTarget, 100) : 0;

  return (
    <div
      className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted/60 ring-1 ring-inset ring-border/40"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(widthPercent)}
    >
      <div
        className={cn(
          'h-full rounded-full transition-[width] duration-500 ease-out',
          band === 'none' && 'w-0 bg-transparent',
          band === 'ok' && BAND_INDICATOR.ok,
          band === 'caution' && BAND_INDICATOR.caution,
          band === 'critical' && BAND_INDICATOR.critical,
          band === 'over' && BAND_INDICATOR.over,
        )}
        style={band === 'none' ? undefined : { width: `${widthPercent}%` }}
      />
      {band === 'over' ? (
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-[2px] rounded-full bg-rose-200/80"
          aria-hidden
        />
      ) : null}
    </div>
  );
}

export function BudgetInsightsGrid({ activeBudget }: BudgetInsightsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
      <Card className="overflow-hidden border-border/60 bg-card/50 p-3 shadow-sm md:p-5">
        <div className="mb-3 md:mb-4">
          <h3 className="text-sm font-semibold tracking-tight">Category Breakdown</h3>
          <p className="text-xs text-muted-foreground">
            Spending vs. planned, sorted by amount spent
          </p>
        </div>
        <div className="max-h-[min(70vh,520px)] space-y-2 overflow-y-auto pr-0.5 [scrollbar-gutter:stable]">
          {activeBudget ? (
            activeBudget.categories.length > 0 ? (
              [...activeBudget.categories]
                .sort((a, b) => {
                  const actualA = a.actualBase ?? a.actual;
                  const actualB = b.actualBase ?? b.actual;
                  if (actualB !== actualA) {
                    return actualB - actualA;
                  }
                  return a.category.name.localeCompare(b.category.name);
                })
                .map(budgetCategory => {
                  const plannedBase = budgetCategory.plannedBase ?? budgetCategory.planned;
                  const actualBase = budgetCategory.actualBase ?? budgetCategory.actual;
                  const hasPlanned = plannedBase > 0;
                  const rawPercent = hasPlanned ? (actualBase / plannedBase) * 100 : 0;
                  const usageRounded = Math.round(rawPercent);
                  const band = getUsageBand(rawPercent, hasPlanned);

                  return (
                    <div
                      key={budgetCategory.id}
                      className="rounded-xl border border-border/50 bg-background/40 p-3 transition-colors hover:bg-muted/30"
                    >
                      <div className="mb-2.5 flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <div
                            className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-background"
                            style={{ backgroundColor: budgetCategory.category.color }}
                          />
                          <span className="truncate text-sm font-medium leading-tight">
                            {budgetCategory.category.name}
                          </span>
                        </div>
                        <div className="shrink-0 text-right font-mono text-xs leading-snug sm:text-sm">
                          <div className="text-foreground tabular-nums">
                            {formatEuroAmount(actualBase)}{' '}
                            <span className="text-muted-foreground">/</span>{' '}
                            {formatEuroAmount(plannedBase)}
                          </div>
                        </div>
                      </div>
                      <CategoryUsageBar
                        percentOfTarget={rawPercent}
                        band={band}
                        hasPlanned={hasPlanned}
                      />
                      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground sm:text-xs">
                        <span>
                          {hasPlanned ? (
                            <span
                              className={cn(
                                'font-medium tabular-nums',
                                band === 'over' && 'text-rose-500',
                                band === 'critical' && 'text-orange-500',
                                band === 'caution' && 'text-amber-500',
                                band === 'ok' && 'text-emerald-500/90',
                              )}
                            >
                              {usageRounded}%{rawPercent > 100 ? ' (over plan)' : ' used'}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">No budget set</span>
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No categories allocated
              </p>
            )
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">No active budget found</p>
          )}
        </div>
      </Card>

      <Card className="overflow-hidden border-border/60 bg-card/50 p-3 shadow-sm md:p-5">
        <div className="mb-3 md:mb-4">
          <h3 className="text-sm font-semibold tracking-tight">Budget Alerts</h3>
          <p className="text-xs text-muted-foreground">
            Planned &gt; 0, sorted by severity (worst first)
          </p>
        </div>
        <div className="max-h-[min(70vh,520px)] space-y-2.5 overflow-y-auto pr-0.5 [scrollbar-gutter:stable]">
          {activeBudget && activeBudget.categories.length > 0 ? (
            activeBudget.categories
              .filter(category => (category.plannedBase ?? category.planned) > 0)
              .sort(compareBudgetCategoriesByAlertSeverity)
              .map(budgetCategory => {
                const plannedBase = budgetCategory.plannedBase ?? budgetCategory.planned;
                const actualBase = budgetCategory.actualBase ?? budgetCategory.actual;
                const usagePercentage = Math.round((actualBase / plannedBase) * 100);
                let alertType: 'green' | 'yellow' | 'red' = 'green';
                let alertMessage = 'On Track';
                let alertDescription = `You're staying within your ${budgetCategory.category.name.toLowerCase()} budget.`;

                if (usagePercentage > 100) {
                  alertType = 'red';
                  alertMessage = 'Over Budget';
                  alertDescription = `Spending is at ${usagePercentage}% of your ${budgetCategory.category.name.toLowerCase()} plan.`;
                } else if (usagePercentage >= 90) {
                  alertType = 'red';
                  alertMessage = 'Near Limit';
                  alertDescription = `You're close to your ${budgetCategory.category.name.toLowerCase()} budget cap.`;
                } else if (usagePercentage >= 75) {
                  alertType = 'yellow';
                  alertMessage = 'High Usage';
                  alertDescription = `You've used ${usagePercentage}% of your ${budgetCategory.category.name.toLowerCase()} budget.`;
                }

                const alertColors = {
                  green:
                    'bg-emerald-500/8 border-emerald-500/15 border-l-emerald-500/70 hover:bg-emerald-500/12',
                  yellow:
                    'bg-amber-500/8 border-amber-500/15 border-l-amber-500/70 hover:bg-amber-500/12',
                  red: 'bg-rose-500/8 border-rose-500/15 border-l-rose-500/70 hover:bg-rose-500/12',
                };

                const dotColors = {
                  green: 'bg-emerald-500',
                  yellow: 'bg-amber-500',
                  red: 'bg-rose-500',
                };

                return (
                  <div
                    key={budgetCategory.id}
                    className={cn(
                      'rounded-xl border border-l-4 p-3.5 pl-3.5 transition-colors',
                      alertColors[alertType],
                    )}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <div className={cn('h-2 w-2 shrink-0 rounded-full', dotColors[alertType])} />
                      <span className="text-sm font-medium leading-snug">
                        {budgetCategory.category.name}
                        <span className="text-muted-foreground"> — {alertMessage}</span>
                      </span>
                    </div>
                    <p className="pl-4 text-xs leading-relaxed text-muted-foreground">
                      {alertDescription}
                    </p>
                  </div>
                );
              })
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">No budget alerts</p>
          )}
        </div>
      </Card>
    </div>
  );
}
