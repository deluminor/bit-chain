import type { Prisma } from '@/generated/prisma';

export const budgetWithCategoriesInclude = {
  categories: {
    include: {
      category: {
        select: {
          id: true,
          name: true,
          type: true,
          color: true,
          icon: true,
        },
      },
    },
  },
} satisfies Prisma.BudgetInclude;

export type BudgetWithCategories = Prisma.BudgetGetPayload<{
  include: typeof budgetWithCategoriesInclude;
}>;

export type BudgetCategoryWithActual = BudgetWithCategories['categories'][number] & {
  actual: number;
  actualBase: number;
  plannedBase: number;
  transactionCount: number;
};

export interface BudgetWithActual extends Omit<BudgetWithCategories, 'categories'> {
  totalActual: number;
  totalActualBase: number;
  totalPlannedBase: number;
  categories: BudgetCategoryWithActual[];
}

export interface BudgetsSummary {
  total: number;
  active: number;
  totalPlanned: number;
  totalActual: number;
  totalPlannedBase: number;
  totalActualBase: number;
}

export interface BudgetsWithSummaryResult {
  budgets: BudgetWithActual[];
  summary: BudgetsSummary;
}
