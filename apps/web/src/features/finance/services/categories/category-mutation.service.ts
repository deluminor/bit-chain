import { prisma } from '@/lib/prisma';
import type {
  CreateMobileCategoryInput,
  CreateWebCategoryInput,
  UpdateMobileCategoryInput,
  UpdateWebCategoryInput,
} from './category-domain.schemas';
import {
  CategoryDomainError,
  assertValidParentCategory,
  ensureUniqueCategoryName,
  normalizeCategoryName,
} from './category-domain.shared';

/**
 * Creates a category from web payload.
 */
export async function createWebCategory(userId: string, input: CreateWebCategoryInput) {
  const name = normalizeCategoryName(input.name);

  await ensureUniqueCategoryName(userId, name, input.type);

  if (input.parentId) {
    await assertValidParentCategory(userId, input.type, input.parentId);
  }

  return prisma.transactionCategory.create({
    data: {
      ...input,
      name,
      userId,
      parentId: input.parentId ?? null,
    },
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
  });
}

/**
 * Creates a category from mobile payload.
 */
export async function createMobileCategory(userId: string, input: CreateMobileCategoryInput) {
  const name = normalizeCategoryName(input.name);

  await ensureUniqueCategoryName(userId, name, input.type);

  const category = await prisma.transactionCategory.create({
    data: {
      userId,
      name,
      type: input.type,
      color: input.color,
      icon: input.icon ?? '',
      isDefault: false,
      isActive: true,
      isLoanRepayment: input.isLoanRepayment ?? false,
    },
    select: {
      id: true,
      name: true,
      type: true,
      color: true,
      icon: true,
      isDefault: true,
      isLoanRepayment: true,
    },
  });

  return {
    id: category.id,
    name: category.name,
    type: category.type as 'INCOME' | 'EXPENSE',
    color: category.color,
    icon: category.icon,
    isDefault: category.isDefault,
    isLoanRepayment: category.isLoanRepayment,
    transactionCount: 0,
  };
}

/**
 * Updates category from web payload.
 */
export async function updateWebCategory(userId: string, input: UpdateWebCategoryInput) {
  const existingCategory = await prisma.transactionCategory.findFirst({
    where: {
      id: input.id,
      userId,
    },
  });

  if (!existingCategory) {
    throw new CategoryDomainError('Category not found', 404, 'NOT_FOUND');
  }

  if (existingCategory.isDefault && (input.name || input.type)) {
    throw new CategoryDomainError(
      'Cannot modify name or type of default categories',
      400,
      'FORBIDDEN',
    );
  }

  const nextType = input.type ?? existingCategory.type;
  const nextName = input.name ? normalizeCategoryName(input.name) : existingCategory.name;

  if (nextName !== existingCategory.name || nextType !== existingCategory.type) {
    await ensureUniqueCategoryName(userId, nextName, nextType, existingCategory.id);
  }

  if (input.parentId) {
    await assertValidParentCategory(userId, nextType, input.parentId);
  }

  return prisma.transactionCategory.update({
    where: { id: existingCategory.id },
    data: {
      ...(input.name !== undefined && { name: nextName }),
      ...(input.type !== undefined && { type: input.type }),
      ...(input.parentId !== undefined && { parentId: input.parentId }),
      ...(input.color !== undefined && { color: input.color }),
      ...(input.icon !== undefined && { icon: input.icon }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
    },
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
  });
}

/**
 * Updates category from mobile payload.
 */
export async function updateMobileCategory(userId: string, input: UpdateMobileCategoryInput) {
  const existingCategory = await prisma.transactionCategory.findFirst({
    where: {
      id: input.id,
      userId,
    },
  });

  if (!existingCategory) {
    throw new CategoryDomainError('Category not found', 404, 'NOT_FOUND');
  }

  if (
    existingCategory.isDefault &&
    input.name &&
    normalizeCategoryName(input.name) !== existingCategory.name
  ) {
    throw new CategoryDomainError('Cannot rename default categories', 403, 'FORBIDDEN');
  }

  if (input.name && normalizeCategoryName(input.name) !== existingCategory.name) {
    await ensureUniqueCategoryName(
      userId,
      normalizeCategoryName(input.name),
      existingCategory.type,
      input.id,
    );
  }

  const updatedCategory = await prisma.transactionCategory.update({
    where: { id: input.id },
    data: {
      ...(input.name !== undefined && { name: normalizeCategoryName(input.name) }),
      ...(input.color !== undefined && { color: input.color }),
      ...(input.icon !== undefined && { icon: input.icon }),
      ...(input.isLoanRepayment !== undefined && { isLoanRepayment: input.isLoanRepayment }),
    },
    select: {
      id: true,
      name: true,
      type: true,
      color: true,
      icon: true,
      isDefault: true,
      isLoanRepayment: true,
      _count: { select: { transactions: true } },
    },
  });

  return {
    id: updatedCategory.id,
    name: updatedCategory.name,
    type: updatedCategory.type as 'INCOME' | 'EXPENSE',
    color: updatedCategory.color,
    icon: updatedCategory.icon,
    isDefault: updatedCategory.isDefault,
    isLoanRepayment: updatedCategory.isLoanRepayment,
    transactionCount: updatedCategory._count.transactions,
  };
}
