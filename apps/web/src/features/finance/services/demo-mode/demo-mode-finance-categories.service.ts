import { prisma } from '@/lib/prisma';
import { DEMO_EXPENSE_CATEGORIES, DEMO_INCOME_CATEGORIES } from './demo-mode.constants';
import type { DemoFinanceCategoryRef } from './demo-mode-finance.types';

export async function ensureDemoFinanceCategories(
  userId: string,
): Promise<DemoFinanceCategoryRef[]> {
  const allCategories = [...DEMO_INCOME_CATEGORIES, ...DEMO_EXPENSE_CATEGORIES];

  const existing = await prisma.transactionCategory.findMany({
    where: {
      userId,
      name: { in: allCategories.map(category => category.name) },
    },
    select: { name: true, type: true },
  });

  const existingKeys = new Set(existing.map(category => `${category.name}:${category.type}`));
  const toCreate = allCategories.filter(
    category => !existingKeys.has(`${category.name}:${category.type}`),
  );

  if (toCreate.length > 0) {
    await prisma.transactionCategory.createMany({
      data: toCreate.map(category => ({
        ...category,
        userId,
        isDemo: true,
      })),
      skipDuplicates: true,
    });
  }

  return prisma.transactionCategory.findMany({
    where: {
      userId,
      name: { in: allCategories.map(category => category.name) },
    },
    select: { id: true, name: true, type: true },
  });
}
