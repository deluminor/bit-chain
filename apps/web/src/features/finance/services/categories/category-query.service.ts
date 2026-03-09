import { prisma } from '@/lib/prisma';
import type { MobileCategoriesQuery, WebCategoriesQuery } from './category-domain.schemas';

/**
 * Returns categories for web routes in either hierarchical or flat mode.
 */
export async function listWebCategories(userId: string, query: WebCategoriesQuery) {
  const where = {
    userId,
    ...(query.type && { type: query.type }),
    ...(query.includeInactive ? {} : { isActive: true }),
  };

  if (query.hierarchical) {
    const categories = await prisma.transactionCategory.findMany({
      where: {
        ...where,
        parentId: null,
      },
      include: {
        children: {
          where: {
            userId,
            ...(query.includeInactive ? {} : { isActive: true }),
          },
          orderBy: { name: 'asc' },
        },
        _count: {
          select: {
            transactions: true,
            children: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return {
      categories,
      total: categories.length,
    };
  }

  const categories = await prisma.transactionCategory.findMany({
    where,
    include: {
      parent: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
      _count: {
        select: {
          transactions: true,
          children: true,
        },
      },
    },
    orderBy: [{ parent: { name: 'asc' } }, { name: 'asc' }],
  });

  const incomeCount = categories.filter(category => category.type === 'INCOME').length;
  const expenseCount = categories.filter(category => category.type === 'EXPENSE').length;

  return {
    categories,
    total: categories.length,
    counts: {
      income: incomeCount,
      expense: expenseCount,
      parents: categories.filter(category => !category.parentId).length,
      children: categories.filter(category => category.parentId).length,
    },
  };
}

/**
 * Returns categories for mobile routes with summary counts.
 */
export async function listMobileCategories(userId: string, query: MobileCategoriesQuery) {
  const categories = await prisma.transactionCategory.findMany({
    where: {
      userId,
      isActive: true,
      isDemo: false,
      type: query.type ?? { in: ['INCOME', 'EXPENSE'] },
    },
    select: {
      id: true,
      name: true,
      type: true,
      color: true,
      icon: true,
      isDefault: true,
      _count: { select: { transactions: true } },
    },
    orderBy: [{ type: 'asc' }, { name: 'asc' }],
  });

  const incomeCount = categories.filter(category => category.type === 'INCOME').length;
  const expenseCount = categories.filter(category => category.type === 'EXPENSE').length;

  return {
    categories: categories.map(category => ({
      id: category.id,
      name: category.name,
      type: category.type as 'INCOME' | 'EXPENSE',
      color: category.color,
      icon: category.icon,
      isDefault: category.isDefault,
      transactionCount: category._count.transactions,
    })),
    incomeCount,
    expenseCount,
  };
}
