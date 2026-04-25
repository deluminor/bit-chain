import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  ActiveComparisonLineChartPoint,
  ComparisonLineChartPoint,
} from '~/src/components/ui';
import { convertCurrency, useCurrencyStore } from '~/src/lib/currency';

function roundToCents(value: number): number {
  return Math.round(value * 100) / 100;
}

interface ExpensesTrendPoint {
  day: number;
  label: string;
  currentExpenseEUR: number;
  previousExpenseEUR: number;
}

interface ExpensesTrendData {
  points?: ExpensesTrendPoint[];
  currentMonthLabel?: string;
  previousMonthLabel?: string;
  comparedDays?: number;
}

interface BudgetCategory {
  id: string;
  categoryId: string;
  plannedBase: number;
  actualBase: number;
  category: { name: string; color?: string };
}

interface Budget {
  id: string;
  currency: string;
  startDate: string;
  endDate: string;
  totalPlanned: number;
  totalPlannedBase: number;
  categories: BudgetCategory[];
}

export function useDashboardExpenseComparison(
  expensesTrendData: ExpensesTrendData | null | undefined,
  currentMonthBudgets: Budget[],
): {
  points: ComparisonLineChartPoint[];
  budgetLimit: number | null;
  setActivePoint: (p: ActiveComparisonLineChartPoint | null) => void;
  activeExpensePoint: ActiveComparisonLineChartPoint | null;
} {
  const baseCurrency = useCurrencyStore(s => s.baseCurrency);
  const [expenseComparisonPoints, setExpenseComparisonPoints] = useState<
    ComparisonLineChartPoint[]
  >([]);
  const [expenseBudgetLimit, setExpenseBudgetLimit] = useState<number | null>(null);
  const [activeExpensePoint, setActiveExpensePoint] =
    useState<ActiveComparisonLineChartPoint | null>(null);

  useEffect(() => {
    let isMounted = true;

    const recomputeExpenseTrend = async () => {
      if (!expensesTrendData?.points || expensesTrendData.points.length === 0) {
        if (isMounted) {
          setExpenseComparisonPoints([]);
          setActiveExpensePoint(null);
          setExpenseBudgetLimit(null);
        }
        return;
      }

      const factor =
        baseCurrency === 'EUR' ? 1 : await convertCurrency(1, 'EUR', baseCurrency).catch(() => 1);
      const todayDay = new Date().getUTCDate();

      const normalized: ComparisonLineChartPoint[] = expensesTrendData.points.map(point => ({
        day: point.day,
        label: point.label,
        currentValue: point.day <= todayDay ? roundToCents(point.currentExpenseEUR * factor) : null,
        previousValue: roundToCents(point.previousExpenseEUR * factor),
      }));

      if (!isMounted) return;
      setExpenseComparisonPoints(normalized);
      setActiveExpensePoint(null);

      let resolvedBudgetLimit: number | null = null;
      if (currentMonthBudgets.length > 0) {
        const convertedBudgetLimits = await Promise.all(
          currentMonthBudgets.map(async budget => {
            const plannedBase = Number(budget.totalPlannedBase);
            if (Number.isFinite(plannedBase) && plannedBase >= 0) {
              const converted = await convertCurrency(plannedBase, 'EUR', baseCurrency).catch(
                () => plannedBase,
              );
              return roundToCents(converted);
            }

            const planned = Number(budget.totalPlanned);
            if (!Number.isFinite(planned) || planned < 0) return null;

            const converted = await convertCurrency(planned, budget.currency, baseCurrency).catch(
              () => planned,
            );
            return roundToCents(converted);
          }),
        );

        const totalLimit = convertedBudgetLimits.reduce<number>(
          (sum, value) => sum + (typeof value === 'number' ? value : 0),
          0,
        );
        resolvedBudgetLimit = totalLimit > 0 ? roundToCents(totalLimit) : null;
      }

      setExpenseBudgetLimit(resolvedBudgetLimit);
    };

    void recomputeExpenseTrend();

    return () => {
      isMounted = false;
    };
  }, [currentMonthBudgets, expensesTrendData, baseCurrency]);

  const setActivePoint = useCallback((p: ActiveComparisonLineChartPoint | null) => {
    setActiveExpensePoint(p);
  }, []);

  return {
    points: expenseComparisonPoints,
    budgetLimit: expenseBudgetLimit,
    setActivePoint,
    activeExpensePoint,
  };
}

export function useDashboardExpenseTrendStats(
  expenseComparisonPoints: ComparisonLineChartPoint[],
  expensesTrendData:
    | { currentMonthLabel?: string; previousMonthLabel?: string; comparedDays?: number }
    | null
    | undefined,
  activeExpensePoint: ActiveComparisonLineChartPoint | null,
) {
  return useMemo(() => {
    const latestCurrentPoint = [...expenseComparisonPoints]
      .reverse()
      .find(point => typeof point.currentValue === 'number' && Number.isFinite(point.currentValue));
    const fallbackCurrentTotal = latestCurrentPoint?.currentValue ?? 0;
    const fallbackDay = latestCurrentPoint?.day ?? new Date().getUTCDate();
    const fallbackPreviousValue = expenseComparisonPoints.find(
      point => point.day === fallbackDay,
    )?.previousValue;
    const fallbackPreviousTotal =
      typeof fallbackPreviousValue === 'number' && Number.isFinite(fallbackPreviousValue)
        ? fallbackPreviousValue
        : 0;

    const currentTotal = activeExpensePoint?.current?.value ?? fallbackCurrentTotal;
    const previousTotal = activeExpensePoint?.previous?.value ?? fallbackPreviousTotal;
    const currentDay = activeExpensePoint?.current?.day ?? fallbackDay;
    const currentPointLabel = activeExpensePoint?.current?.label ?? String(currentDay);
    const previousPointLabel = activeExpensePoint?.previous?.label ?? String(currentDay);
    const delta = roundToCents(currentTotal - previousTotal);
    const deltaPct = previousTotal > 0 ? (delta / previousTotal) * 100 : null;

    return {
      currentTotal,
      previousTotal,
      currentDay,
      currentPointLabel,
      previousPointLabel,
      delta,
      deltaPct,
      isHigherThanPrevious: delta > 0,
      hasData: expenseComparisonPoints.length > 0,
      currentMonthLabel: expensesTrendData?.currentMonthLabel ?? 'Current month',
      previousMonthLabel: expensesTrendData?.previousMonthLabel ?? 'Previous month',
      comparedDays: expensesTrendData?.comparedDays ?? expenseComparisonPoints.length,
    };
  }, [expenseComparisonPoints, expensesTrendData, activeExpensePoint]);
}

export function useDashboardBudgetLimitStatus(
  expenseBudgetLimit: number | null,
  currentTotal: number,
) {
  return useMemo(() => {
    if (!expenseBudgetLimit || expenseBudgetLimit <= 0) return null;

    const usagePercent = (currentTotal / expenseBudgetLimit) * 100;

    return {
      usagePercent,
      isApproaching: usagePercent >= 80 && usagePercent < 100,
      isOverLimit: usagePercent >= 100,
    };
  }, [expenseBudgetLimit, currentTotal]);
}

interface BudgetForFilter {
  id: string;
  isActive: boolean;
  isTemplate?: boolean;
  period: string;
  startDate: string;
  endDate: string;
  currency: string;
  totalPlanned: number;
  totalPlannedBase: number;
  categories: BudgetCategory[];
}

export function useCurrentMonthBudgets(
  budgetsData: { budgets?: BudgetForFilter[] } | null | undefined,
): Budget[] {
  return useMemo(() => {
    const budgets = budgetsData?.budgets ?? [];
    const now = new Date();
    const currentUtcMonthStartTs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0);
    const nextUtcMonthStartTs = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth() + 1,
      1,
      0,
      0,
      0,
      0,
    );
    const currentLocalMonthStartTs = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0,
    ).getTime();
    const nextLocalMonthStartTs = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1,
      0,
      0,
      0,
      0,
    ).getTime();

    const monthlyBudgets = budgets.filter(budget => budget.isActive && budget.period === 'MONTHLY');

    const parsedMonthlyBudgets = monthlyBudgets
      .map(budget => ({
        budget,
        startTs: Date.parse(budget.startDate),
        endTs: Date.parse(budget.endDate),
      }))
      .filter(item => Number.isFinite(item.startTs) && Number.isFinite(item.endTs))
      .filter(item => {
        const overlapsUtcMonth =
          item.startTs < nextUtcMonthStartTs && item.endTs >= currentUtcMonthStartTs;
        const overlapsLocalMonth =
          item.startTs < nextLocalMonthStartTs && item.endTs >= currentLocalMonthStartTs;

        return overlapsUtcMonth || overlapsLocalMonth;
      })
      .map(item => item.budget);

    const currentRegularBudgets = parsedMonthlyBudgets.filter(budget => !budget.isTemplate);
    if (currentRegularBudgets.length > 0) return currentRegularBudgets;

    if (parsedMonthlyBudgets.length > 0) return parsedMonthlyBudgets;

    const fallbackSorted = monthlyBudgets
      .map(budget => ({
        budget,
        startTs: Date.parse(budget.startDate),
      }))
      .filter(item => Number.isFinite(item.startTs))
      .sort((left, right) => right.startTs - left.startTs);

    const latestRegular = fallbackSorted.find(item => !item.budget.isTemplate)?.budget;
    if (latestRegular) return [latestRegular];

    const latestAny = fallbackSorted[0]?.budget;
    return latestAny ? [latestAny] : [];
  }, [budgetsData?.budgets]);
}
