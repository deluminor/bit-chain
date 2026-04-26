import { getBudgetRange } from './budget-domain.shared';
import type { BudgetWithCategories } from './budget-domain.types';

function rangeOverlapsBudget(bStart: Date, bEnd: Date, rangeFrom: Date, rangeTo: Date): boolean {
  return bStart <= rangeTo && bEnd >= rangeFrom;
}

export function pickPrimaryBudgetForDateRange(
  budgets: readonly BudgetWithCategories[],
  rangeFrom: Date,
  rangeTo: Date,
): BudgetWithCategories | null {
  const r0 = new Date(rangeFrom);
  const r1 = new Date(rangeTo);
  r0.setHours(0, 0, 0, 0);
  r1.setHours(23, 59, 59, 999);

  const candidates = budgets.filter(b => {
    if (b.isTemplate) {
      return false;
    }

    const { startDate, endDate } = getBudgetRange(b);
    return rangeOverlapsBudget(startDate, endDate, r0, r1);
  });

  if (candidates.length === 0) {
    return null;
  }
  const active = candidates.find(b => b.isActive);
  if (active) {
    return active;
  }

  return (
    [...candidates].sort(
      (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    )[0] ?? null
  );
}

export function pickPrimaryBudgetWithoutDateFilter(
  budgets: readonly BudgetWithCategories[],
): BudgetWithCategories | null {
  const nonTemplate = budgets.filter(b => !b.isTemplate);
  if (nonTemplate.length === 0) {
    return null;
  }
  return nonTemplate.find(b => b.isActive) ?? nonTemplate[0] ?? null;
}

export function intersectGlobalRangeWithBudget(
  budget: BudgetWithCategories,
  rangeFrom: Date,
  rangeTo: Date,
): { gte: Date; lte: Date } | null {
  const r0 = new Date(rangeFrom);
  const r1 = new Date(rangeTo);

  r0.setHours(0, 0, 0, 0);
  r1.setHours(23, 59, 59, 999);

  const { startDate: bStart, endDate: bEnd } = getBudgetRange(budget);
  const gte = bStart > r0 ? bStart : r0;
  const lte = bEnd < r1 ? bEnd : r1;

  if (gte.getTime() > lte.getTime()) {
    return null;
  }

  return { gte, lte };
}
