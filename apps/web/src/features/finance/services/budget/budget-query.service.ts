import { convertToBaseCurrencySafe } from '@/lib/currency';
import { prisma } from '@/lib/prisma';
import { getBudgetRange } from './budget-domain.shared';
import {
  budgetWithCategoriesInclude,
  type BudgetCategoryWithActual,
  type BudgetWithActual,
  type BudgetWithCategories,
  type BudgetsWithSummaryResult,
} from './budget-domain.types';
import {
  intersectGlobalRangeWithBudget,
  pickPrimaryBudgetForDateRange,
  pickPrimaryBudgetWithoutDateFilter,
} from './budget-period-selection';

async function calculateBudgetCategoryActual(
  userId: string,
  budget: BudgetWithCategories,
  budgetCategory: BudgetWithCategories['categories'][number],
  dateBounds?: { gte: Date; lte: Date },
): Promise<BudgetCategoryWithActual> {
  const { startDate, endDate } = dateBounds
    ? { startDate: dateBounds.gte, endDate: dateBounds.lte }
    : getBudgetRange(budget);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      categoryId: budgetCategory.categoryId,
      type: 'EXPENSE',
      isDemo: false,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      amount: true,
      currency: true,
      account: { select: { currency: true } },
    },
  });

  const convertedTransactions = await Promise.all(
    transactions.map(transaction => {
      const currency = transaction.currency || transaction.account?.currency || budget.currency;
      return convertToBaseCurrencySafe(Math.abs(transaction.amount), currency);
    }),
  );

  const actualBaseRaw = convertedTransactions.reduce((sum, amount) => sum + amount, 0);
  const actualBase = Math.round(actualBaseRaw * 100) / 100;
  const plannedBaseRaw = await convertToBaseCurrencySafe(budgetCategory.planned, budget.currency);
  const plannedBase = Math.round(plannedBaseRaw * 100) / 100;

  return {
    ...budgetCategory,
    actual: actualBase,
    actualBase,
    plannedBase,
    transactionCount: transactions.length,
  };
}

async function hydrateBudgetWithActual(
  userId: string,
  budget: BudgetWithCategories,
  options?: { transactionDateBounds?: { gte: Date; lte: Date } },
): Promise<BudgetWithActual> {
  const bounds = options?.transactionDateBounds;
  const categories = await Promise.all(
    budget.categories.map(category =>
      calculateBudgetCategoryActual(userId, budget, category, bounds),
    ),
  );

  const totalActualBaseRaw = categories.reduce((sum, category) => sum + category.actualBase, 0);
  const totalPlannedBaseRaw = await convertToBaseCurrencySafe(budget.totalPlanned, budget.currency);
  const totalActualBase = Math.round(totalActualBaseRaw * 100) / 100;
  const totalPlannedBase = Math.round(totalPlannedBaseRaw * 100) / 100;

  return {
    ...budget,
    categories,
    totalActual: totalActualBase,
    totalActualBase,
    totalPlannedBase,
  };
}

export interface ListBudgetsWithSummaryOptions {
  globalFrom?: Date;
  globalTo?: Date;
}

export async function listBudgetsWithSummary(
  userId: string,
  options?: ListBudgetsWithSummaryOptions,
): Promise<BudgetsWithSummaryResult> {
  const budgets = await prisma.budget.findMany({
    where: { userId, isDemo: false },
    include: budgetWithCategoriesInclude,
    orderBy: { startDate: 'desc' },
  });

  const budgetsWithActual = await Promise.all(
    budgets.map(budget => hydrateBudgetWithActual(userId, budget)),
  );

  let primaryRow: BudgetWithCategories | null = null;
  let summaryPlanned: number;
  let summaryActual: number;

  if (options?.globalFrom && options?.globalTo) {
    primaryRow = pickPrimaryBudgetForDateRange(budgets, options.globalFrom, options.globalTo);
    if (primaryRow) {
      const clip = intersectGlobalRangeWithBudget(primaryRow, options.globalFrom, options.globalTo);
      if (clip) {
        const clipped = await hydrateBudgetWithActual(userId, primaryRow, {
          transactionDateBounds: clip,
        });
        summaryPlanned = clipped.totalPlannedBase ?? 0;
        summaryActual = clipped.totalActualBase ?? 0;
      } else {
        const full = budgetsWithActual.find(b => b.id === primaryRow?.id);
        summaryPlanned = full?.totalPlannedBase ?? 0;
        summaryActual = 0;
      }
    } else {
      summaryPlanned = 0;
      summaryActual = 0;
    }
  } else {
    primaryRow = pickPrimaryBudgetWithoutDateFilter(budgets);
    if (primaryRow) {
      const full = budgetsWithActual.find(b => b.id === primaryRow?.id);
      summaryPlanned = full?.totalPlannedBase ?? 0;
      summaryActual = full?.totalActualBase ?? 0;
    } else {
      summaryPlanned = 0;
      summaryActual = 0;
    }
  }

  return {
    budgets: budgetsWithActual,
    primarySummaryBudgetId: primaryRow?.id ?? null,
    summary: {
      total: budgetsWithActual.length,
      active: budgetsWithActual.filter(budget => budget.isActive).length,
      totalPlanned: summaryPlanned,
      totalActual: summaryActual,
      totalPlannedBase: summaryPlanned,
      totalActualBase: summaryActual,
    },
  };
}
