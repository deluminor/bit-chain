import { prisma } from '@/lib/prisma';
import { CategoryDomainError } from './category-domain.shared';

/**
 * Deletes category with strict web-level guards.
 */
export async function deleteWebCategory(userId: string, categoryId: string): Promise<void> {
  const category = await prisma.transactionCategory.findFirst({
    where: {
      id: categoryId,
      userId,
    },
    include: {
      _count: {
        select: {
          transactions: true,
          children: true,
        },
      },
    },
  });

  if (!category) {
    throw new CategoryDomainError('Category not found', 404, 'NOT_FOUND');
  }

  if (category.isDefault) {
    throw new CategoryDomainError(
      'Cannot delete default categories. Deactivate instead.',
      400,
      'FORBIDDEN',
    );
  }

  if (category._count.transactions > 0) {
    throw new CategoryDomainError('Cannot delete category with transactions', 400, 'CONFLICT', {
      hasTransactions: true,
      transactionCount: category._count.transactions,
      message: 'Deactivate the category instead or reassign transactions first',
    });
  }

  if (category._count.children > 0) {
    throw new CategoryDomainError('Cannot delete category with subcategories', 400, 'CONFLICT', {
      hasChildren: true,
      childrenCount: category._count.children,
      message: 'Delete or reassign subcategories first',
    });
  }

  await prisma.transactionCategory.delete({ where: { id: categoryId } });
}

/**
 * Deletes category with mobile-level guards.
 */
export async function deleteMobileCategory(userId: string, categoryId: string): Promise<void> {
  const category = await prisma.transactionCategory.findFirst({
    where: {
      id: categoryId,
      userId,
    },
    include: {
      _count: {
        select: {
          transactions: true,
        },
      },
    },
  });

  if (!category) {
    throw new CategoryDomainError('Category not found', 404, 'NOT_FOUND');
  }

  if (category.isDefault) {
    throw new CategoryDomainError('Cannot delete default categories', 403, 'FORBIDDEN');
  }

  if (category._count.transactions > 0) {
    throw new CategoryDomainError(
      `Category has ${category._count.transactions} transactions. Reassign them first.`,
      409,
      'CONFLICT',
    );
  }

  await prisma.transactionCategory.delete({ where: { id: categoryId } });
}
