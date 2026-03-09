import { prisma } from '@/lib/prisma';
import { budgetWithCategoriesInclude, type BudgetWithCategories } from './budget-domain.types';

export class BudgetDomainError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'BudgetDomainError';
    this.status = status;
  }
}

export function getBudgetRange(budget: BudgetWithCategories): {
  startDate: Date;
  endDate: Date;
} {
  const startDate = new Date(budget.startDate);
  const endDate = new Date(budget.endDate);

  if (budget.period === 'MONTHLY') {
    startDate.setDate(1);
  }

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  return { startDate, endDate };
}

export async function ensureBudgetNameUnique(
  userId: string,
  name: string,
  excludeId?: string,
): Promise<void> {
  const existingBudget = await prisma.budget.findFirst({
    where: {
      userId,
      name,
      ...(excludeId && { id: { not: excludeId } }),
    },
    select: { id: true },
  });

  if (existingBudget) {
    throw new BudgetDomainError(
      'A budget with this name already exists. Please choose a different name.',
      400,
    );
  }
}

export async function requireBudgetOwnership(
  userId: string,
  budgetId: string,
): Promise<{ readonly id: string; readonly name: string }> {
  const budget = await prisma.budget.findFirst({
    where: {
      id: budgetId,
      userId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!budget) {
    throw new BudgetDomainError('Budget not found or access denied', 404);
  }

  return budget;
}

export async function getBudgetById(budgetId: string): Promise<BudgetWithCategories | null> {
  return prisma.budget.findUnique({
    where: { id: budgetId },
    include: budgetWithCategoriesInclude,
  });
}
