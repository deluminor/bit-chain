'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartWrapper } from '@/components/layout/charts/ChartWrapper';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { THEME, useStore } from '@/store';
import { useMemo, useState, useEffect } from 'react';
import { ChartSkeleton } from '@/components/layout/charts/ChartSkeleton';
import { Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatSummaryAmount } from '@/lib/currency';
import { useBudgets, BudgetCategory as ApiBudgetCategory } from '@/features/finance/queries/budget';

interface BudgetCategory {
  id: string;
  name: string;
  planned: number;
  actual: number;
  color: string;
}

export function BudgetPerformanceChart() {
  const { theme } = useStore();
  const { data: budgetsResponse, isLoading } = useBudgets();

  const [budgetData, setBudgetData] = useState<BudgetCategory[]>([]);

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
          {budgetData.map(category => {
            const percentage =
              category.planned > 0 ? (category.actual / category.planned) * 100 : 0;
            const isOverBudget = category.actual > category.planned;
            const variance = category.actual - category.planned;

            return (
              <div key={category.id} className="p-3 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium">{category.name}</span>
                    {isOverBudget ? (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatSummaryAmount(category.actual)}</div>
                    <div className="text-sm text-muted-foreground">
                      of {formatSummaryAmount(category.planned)}
                    </div>
                  </div>
                </div>

                <Progress value={Math.min(percentage, 100)} className="h-2 mb-2" />

                <div className="flex items-center justify-between text-sm">
                  <Badge variant={isOverBudget ? 'destructive' : 'default'} className="text-xs">
                    {percentage.toFixed(1)}%
                  </Badge>
                  <span
                    className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}
                  >
                    {variance >= 0 ? '+' : ''}
                    {formatSummaryAmount(variance)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ChartWrapper>
  );
}
