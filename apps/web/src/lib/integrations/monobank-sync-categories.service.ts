import type { PrismaClient } from '@/generated/prisma';
import type { CategoryType, SyncCategoryResolver } from './monobank-sync.types';

const ensureFallbackCategory = async (
  prisma: PrismaClient,
  userId: string,
  type: 'INCOME' | 'EXPENSE',
) => {
  const existing = await prisma.transactionCategory.findFirst({
    where: {
      userId,
      type,
      isDefault: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  if (existing) {
    return existing;
  }

  const fallbackName = type === 'INCOME' ? 'Other Income' : 'Other Expenses';
  const fallbackColor = type === 'INCOME' ? '#10B981' : '#EF4444';

  return prisma.transactionCategory.create({
    data: {
      userId,
      name: fallbackName,
      type,
      color: fallbackColor,
      icon: 'MoreHorizontal',
      isDefault: true,
    },
  });
};

const ensureTransferCategory = async (prisma: PrismaClient, userId: string) => {
  const existing = await prisma.transactionCategory.findFirst({
    where: {
      userId,
      type: 'TRANSFER',
      isDefault: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  if (existing) {
    return existing;
  }

  return prisma.transactionCategory.create({
    data: {
      userId,
      name: 'Transfer',
      type: 'TRANSFER',
      color: '#3B82F6',
      icon: 'ArrowRightLeft',
      isDefault: true,
    },
  });
};

const resolveCategoryIdFromMap = (
  categoryMap: ReadonlyMap<string, string>,
  type: CategoryType,
  names: readonly string[],
  fallbackId: string,
): string => {
  for (const name of names) {
    const key = `${type}:${name.toLowerCase()}`;
    const match = categoryMap.get(key);
    if (match) {
      return match;
    }
  }

  return fallbackId;
};

/**
 * Builds reusable category resolver context for Monobank transaction import.
 */
export async function buildSyncCategoryResolver(
  prisma: PrismaClient,
  userId: string,
): Promise<SyncCategoryResolver> {
  const [incomeCategory, expenseCategory, transferCategory, categories] = await Promise.all([
    ensureFallbackCategory(prisma, userId, 'INCOME'),
    ensureFallbackCategory(prisma, userId, 'EXPENSE'),
    ensureTransferCategory(prisma, userId),
    prisma.transactionCategory.findMany({
      where: { userId, isActive: true },
      select: { id: true, name: true, type: true },
    }),
  ]);

  const categoryMap = new Map<string, string>();
  for (const category of categories) {
    categoryMap.set(`${category.type}:${category.name.toLowerCase()}`, category.id);
  }

  return {
    incomeCategoryId: incomeCategory.id,
    expenseCategoryId: expenseCategory.id,
    transferCategoryId: transferCategory.id,
    resolveCategoryId: (type, names) => {
      const fallbackId =
        type === 'INCOME'
          ? incomeCategory.id
          : type === 'TRANSFER'
            ? transferCategory.id
            : expenseCategory.id;

      return resolveCategoryIdFromMap(categoryMap, type, names, fallbackId);
    },
  };
}
