import { prisma } from '@/lib/prisma';
import type { CreateBudgetInput, UpdateBudgetInput } from './budget-domain.schemas';
import {
  BudgetDomainError,
  ensureBudgetNameUnique,
  getBudgetById,
  requireBudgetOwnership,
} from './budget-domain.shared';
import type { BudgetWithCategories } from './budget-domain.types';

/**
 * Creates a budget with optional category allocations.
 */
export async function createBudget(
  userId: string,
  input: CreateBudgetInput,
): Promise<BudgetWithCategories> {
  await ensureBudgetNameUnique(userId, input.name);

  const budget = await prisma.budget.create({
    data: {
      userId,
      name: input.name,
      period: input.period,
      startDate: input.startDate,
      endDate: input.endDate,
      currency: input.currency,
      totalPlanned: input.totalPlanned,
      isActive: true,
      isTemplate: input.isTemplate,
      templateName: input.templateName,
      autoApply: input.autoApply,
    },
    select: {
      id: true,
    },
  });

  if (input.categories && input.categories.length > 0) {
    await prisma.budgetCategory.createMany({
      data: input.categories.map(category => ({
        budgetId: budget.id,
        categoryId: category.categoryId,
        planned: category.planned,
      })),
    });
  }

  const createdBudget = await getBudgetById(budget.id);
  if (!createdBudget) {
    throw new BudgetDomainError('Failed to create budget', 500);
  }

  return createdBudget;
}

/**
 * Updates budget metadata and optionally replaces category allocations.
 */
export async function updateBudget(
  userId: string,
  input: UpdateBudgetInput,
): Promise<BudgetWithCategories> {
  const { id, categories, ...changes } = input;

  const existingBudget = await requireBudgetOwnership(userId, id);

  if (changes.name && changes.name !== existingBudget.name) {
    await ensureBudgetNameUnique(userId, changes.name, id);
  }

  await prisma.budget.update({
    where: { id },
    data: {
      ...(changes.name !== undefined && { name: changes.name }),
      ...(changes.period !== undefined && { period: changes.period }),
      ...(changes.startDate !== undefined && { startDate: changes.startDate }),
      ...(changes.endDate !== undefined && { endDate: changes.endDate }),
      ...(changes.currency !== undefined && { currency: changes.currency }),
      ...(changes.totalPlanned !== undefined && { totalPlanned: changes.totalPlanned }),
      ...(changes.isActive !== undefined && { isActive: changes.isActive }),
      ...(changes.isTemplate !== undefined && { isTemplate: changes.isTemplate }),
      ...(changes.templateName !== undefined && { templateName: changes.templateName }),
      ...(changes.autoApply !== undefined && { autoApply: changes.autoApply }),
    },
  });

  if (categories) {
    await prisma.budgetCategory.deleteMany({
      where: { budgetId: id },
    });

    if (categories.length > 0) {
      await prisma.budgetCategory.createMany({
        data: categories.map(category => ({
          budgetId: id,
          categoryId: category.categoryId,
          planned: category.planned,
        })),
      });
    }
  }

  const updatedBudget = await getBudgetById(id);
  if (!updatedBudget) {
    throw new BudgetDomainError('Budget not found or access denied', 404);
  }

  return updatedBudget;
}

/**
 * Deletes budget after ownership validation.
 */
export async function deleteBudget(userId: string, budgetId: string): Promise<void> {
  await requireBudgetOwnership(userId, budgetId);

  await prisma.budget.delete({
    where: { id: budgetId },
  });
}
