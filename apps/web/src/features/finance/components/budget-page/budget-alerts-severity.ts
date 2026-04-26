import type { BudgetCategory } from '@/features/finance/queries/budget';

function getAlertSeverityRank(usagePercent: number): number {
  if (usagePercent > 100) {
    return 3;
  }

  if (usagePercent >= 90) {
    return 2;
  }

  if (usagePercent >= 75) {
    return 1;
  }

  return 0;
}

export function compareBudgetCategoriesByAlertSeverity(
  a: BudgetCategory,
  b: BudgetCategory,
): number {
  const plannedA = a.plannedBase ?? a.planned;
  const plannedB = b.plannedBase ?? b.planned;
  const actualA = a.actualBase ?? a.actual;
  const actualB = b.actualBase ?? b.actual;
  const rawA = (actualA / plannedA) * 100;
  const rawB = (actualB / plannedB) * 100;
  const rankA = getAlertSeverityRank(rawA);
  const rankB = getAlertSeverityRank(rawB);

  if (rankB !== rankA) {
    return rankB - rankA;
  }

  if (rawB !== rawA) {
    return rawB - rawA;
  }

  return a.category.name.localeCompare(b.category.name);
}
