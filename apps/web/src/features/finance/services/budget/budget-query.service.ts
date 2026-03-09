import { convertToBaseCurrencySafe } from '@/lib/currency';
import { prisma } from '@/lib/prisma';
import { getBudgetRange } from './budget-domain.shared';
import {
  budgetWithCategoriesInclude,
  type BudgetCategoryWithActual,
  type BudgetsWithSummaryResult,
  type BudgetWithActual,
  type BudgetWithCategories,
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
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      amount: true,
      currency: true,
    },
  });

  const actual = Math.abs(transactions.reduce((sum, transaction) => sum + transaction.amount, 0));

  const convertedTransactions = await Promise.all(
    transactions.map(transaction =>
      convertToBaseCurrencySafe(transaction.amount, transaction.currency ?? undefined),
    ),
  );

  const actualBase = Math.abs(convertedTransactions.reduce((sum, amount) => sum + amount, 0));
  const plannedBase = await convertToBaseCurrencySafe(budgetCategory.planned, budget.currency);

  return {
    ...budgetCategory,
    actual,
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

  const totalActual = categories.reduce((sum, category) => sum + category.actual, 0);
  const totalActualBase = categories.reduce((sum, category) => sum + category.actualBase, 0);
  const totalPlannedBase = await convertToBaseCurrencySafe(budget.totalPlanned, budget.currency);

  return {
    ...budget,
    categories,
    totalActual,
    totalActualBase,
    totalPlannedBase,
  };
}

/**
 * Returns all budgets with computed actuals and summary metrics.
 */
export async function listBudgetsWithSummary(userId: string): Promise<BudgetsWithSummaryResult> {
  const budgets = await prisma.budget.findMany({
    where: { userId },
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
