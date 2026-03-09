'use client';

import { ChartSkeleton } from '@/components/layout/charts/ChartSkeleton';
import { ChartWrapper } from '@/components/layout/charts/ChartWrapper';
import { Badge } from '@/components/ui/badge';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BudgetCategory as ApiBudgetCategory, useBudgets } from '@/features/finance/queries/budget';
import { formatSummaryAmount } from '@/lib/currency';
import { THEME, useStore } from '@/store';
import { CheckCircle, Target } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  BudgetCategoryDetailCard,
  type BudgetCategoryDetail,
} from './budget-performance/BudgetCategoryDetailCard';

export function BudgetPerformanceChart() {
  const { theme } = useStore();
  const { data: budgetsResponse, isLoading } = useBudgets();

  const [budgetData, setBudgetData] = useState<BudgetCategoryDetail[]>([]);

  useEffect(() => {
    const processBudgets = async () => {
      const activeBudgets = budgetsResponse?.budgets?.filter(budget => budget.isActive);
      const currentBudget = activeBudgets?.[0];

      if (!budgetsResponse?.budgets?.length || !activeBudgets?.length || !currentBudget) {
        setBudgetData([]);
        return;
      }

      const processed = currentBudget.categories.map((category: ApiBudgetCategory) => {
        const planned = category.plannedBase ?? category.planned;
        const actual = category.actualBase ?? category.actual;

        return {
          id: category.id,
          name: category.category.name,
          planned,
          actual,
          color: category.category.color,
        };
      });

      setBudgetData(processed);
    };

    processBudgets();
  }, [budgetsResponse]);

  const chartData = useMemo(() => {
    return budgetData.map(category => ({
      category: category.name,
      planned: category.planned,
      actual: category.actual,
      variance: category.actual - category.planned,
      percentage: category.planned > 0 ? (category.actual / category.planned) * 100 : 0,
    }));
  }, [budgetData]);

  const performance = useMemo(() => {
    const totalPlanned = budgetData.reduce((sum, cat) => sum + cat.planned, 0);
    const totalActual = budgetData.reduce((sum, cat) => sum + cat.actual, 0);
    const onBudgetCount = budgetData.filter(cat => cat.actual <= cat.planned).length;
    const overBudgetCount = budgetData.filter(cat => cat.actual > cat.planned).length;

    return {
      totalPlanned,
      totalActual,
      totalVariance: totalActual - totalPlanned,
      overallPercentage: totalPlanned > 0 ? (totalActual / totalPlanned) * 100 : 0,
      onBudgetCount,
      overBudgetCount,
      categoriesCount: budgetData.length,
    };
  }, [budgetData]);

  const chartConfig = {
    planned: {
      label: 'Planned',
      color: theme === THEME.DARK ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
    },
    actual: {
      label: 'Actual',
      color: theme === THEME.DARK ? 'rgba(255, 107, 53, 0.8)' : '#FF6B35',
    },
  } satisfies ChartConfig;

  if (isLoading) return <ChartSkeleton />;

  if (!budgetData.length) {
    return (
      <ChartWrapper title="Budget Performance" description="Track spending against planned budgets">
        <div className="text-center text-muted-foreground py-8">
          <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No budget data available</p>
          <p className="text-xs mt-1">Set up budgets to track your spending</p>
        </div>
      </ChartWrapper>
    );
  }

  const headerActions = (
    <Badge
      variant={performance.overallPercentage <= 100 ? 'default' : 'destructive'}
      className="text-sm"
    >
      {performance.overallPercentage.toFixed(1)}% of budget
    </Badge>
  );

  return (
    <ChartWrapper
      title="Budget Performance"
      description="Actual spending vs planned budget"
      headerActions={headerActions}
    >
      <div className="space-y-6">
        {/* Overall Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg bg-muted/50">
          <div className="text-center">
            <div className="text-2xl font-bold">{formatSummaryAmount(performance.totalActual)}</div>
            <div className="text-sm text-muted-foreground">Total Spent</div>
            <div className="text-xs text-muted-foreground mt-1">
              of {formatSummaryAmount(performance.totalPlanned)} planned
            </div>
          </div>

          <div className="text-center">
            <div
              className={`text-2xl font-bold ${
                performance.totalVariance <= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {performance.totalVariance >= 0 ? '+' : ''}
              {formatSummaryAmount(performance.totalVariance)}
            </div>
            <div className="text-sm text-muted-foreground">Variance</div>
            <div className="text-xs text-muted-foreground mt-1">
              {performance.totalVariance <= 0 ? 'Under' : 'Over'} budget
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold flex items-center justify-center gap-1">
              <CheckCircle className="h-5 w-5 text-green-500" />
              {performance.onBudgetCount}
            </div>
            <div className="text-sm text-muted-foreground">On Budget</div>
            <div className="text-xs text-muted-foreground mt-1">
              {performance.overBudgetCount} over budget
            </div>
          </div>
        </div>

        {/* Chart */}
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] md:h-[300px] w-full">
          <BarChart data={chartData} margin={{ top: 10, right: 5, left: 5, bottom: 10 }}>
            <CartesianGrid
              vertical={false}
              horizontal={true}
              stroke={theme === THEME.DARK ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
              strokeDasharray="3 4"
            />
            <XAxis
              dataKey="category"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: theme === THEME.DARK ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                fontSize: 11,
              }}
              tickMargin={10}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tickFormatter={value => formatSummaryAmount(value)}
              tickLine={false}
              axisLine={false}
              tick={{
                fill: theme === THEME.DARK ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                fontSize: 12,
              }}
              tickMargin={10}
              domain={[0, 'dataMax']}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    if (name === 'planned') {
                      return [formatSummaryAmount(Number(value)), 'Budget'];
                    }
                    return [formatSummaryAmount(Number(value)), 'Spent'];
                  }}
                  labelFormatter={label => `${label} Category`}
                  indicator="line"
                />
              }
            />
            <Bar
              dataKey="planned"
              fill="var(--color-planned)"
              radius={[4, 4, 0, 0]}
              name="planned"
            />
            <Bar dataKey="actual" fill="var(--color-actual)" radius={[4, 4, 0, 0]} name="actual" />
          </BarChart>
        </ChartContainer>

        {/* Detailed Category Breakdown */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold mb-3">Category Details</h4>
          {budgetData.map(category => (
            <BudgetCategoryDetailCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </ChartWrapper>
  );
}
