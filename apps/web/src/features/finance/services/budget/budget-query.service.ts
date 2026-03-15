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

async function calculateBudgetCategoryActual(
  userId: string,
  budget: BudgetWithCategories,
  budgetCategory: BudgetWithCategories['categories'][number],
): Promise<BudgetCategoryWithActual> {
  const { startDate, endDate } = getBudgetRange(budget);

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
): Promise<BudgetWithActual> {
  const categories = await Promise.all(
    budget.categories.map(category => calculateBudgetCategoryActual(userId, budget, category)),
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

/**
 * Returns all budgets with computed actuals and summary metrics.
 */
export async function listBudgetsWithSummary(userId: string): Promise<BudgetsWithSummaryResult> {
  const budgets = await prisma.budget.findMany({
    where: { userId, isDemo: false },
    include: budgetWithCategoriesInclude,
    orderBy: { startDate: 'desc' },
  });

  const budgetsWithActual = await Promise.all(
    budgets.map(budget => hydrateBudgetWithActual(userId, budget)),
  );

  const totalPlannedBase = budgetsWithActual.reduce(
    (sum, budget) => sum + (budget.totalPlannedBase ?? 0),
    0,
  );
  const totalActualBase = budgetsWithActual.reduce(
    (sum, budget) => sum + (budget.totalActualBase ?? 0),
    0,
  );

  return {
    budgets: budgetsWithActual,
    summary: {
      total: budgetsWithActual.length,
      active: budgetsWithActual.filter(budget => budget.isActive).length,
      totalPlanned: totalPlannedBase,
      totalActual: totalActualBase,
      totalPlannedBase,
      totalActualBase,
    },
  };
}
