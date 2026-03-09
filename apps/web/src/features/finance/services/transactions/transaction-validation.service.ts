import { prisma } from '@/lib/prisma';
import { TransactionDomainError, type TransactionType } from './transaction-domain.shared';

const TRANSFER_CATEGORY_FALLBACK = {
  name: 'Transfer',
  color: '#3B82F6',
  icon: 'ArrowRightLeft',
} as const;

/**
 * Validates account ownership and active status.
 */
export async function requireActiveAccount(userId: string, accountId: string) {
  const account = await prisma.financeAccount.findFirst({
    where: {
      id: accountId,
      userId,
      isActive: true,
    },
  });

  if (!account) {
    throw new TransactionDomainError('Account not found or inactive', 400);
  }

  return account;
}

/**
 * Validates category ownership, type, and active status.
 */
export async function requireCategoryForType(
  userId: string,
  categoryId: string,
  type: TransactionType,
): Promise<void> {
  const category = await prisma.transactionCategory.findFirst({
    where: {
      id: categoryId,
      userId,
      type,
      isActive: true,
    },
    select: {
      id: true,
      type: true,
    },
  });

  if (!category) {
    throw new TransactionDomainError('Category not found, inactive, or type mismatch', 400);
  }
}

/**
 * Resolves a category id for transaction type.
 * For transfers, auto-selects or creates a default transfer category.
 */
export async function resolveCategoryForType(
  userId: string,
  categoryId: string | undefined,
  type: TransactionType,
): Promise<string> {
  if (type !== 'TRANSFER') {
    if (!categoryId) {
      throw new TransactionDomainError('Category is required', 400);
    }

    await requireCategoryForType(userId, categoryId, type);
    return categoryId;
  }

  if (categoryId) {
    const providedTransferCategory = await prisma.transactionCategory.findFirst({
      where: {
        id: categoryId,
        userId,
        type: 'TRANSFER',
        isActive: true,
      },
      select: { id: true },
    });

    if (providedTransferCategory) {
      return providedTransferCategory.id;
    }
  }

  const activeTransferCategory = await prisma.transactionCategory.findFirst({
    where: {
      userId,
      type: 'TRANSFER',
      isActive: true,
    },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
    select: { id: true },
  });

  if (activeTransferCategory) {
    return activeTransferCategory.id;
  }

  const transferByName = await prisma.transactionCategory.findFirst({
    where: {
      userId,
      type: 'TRANSFER',
      name: TRANSFER_CATEGORY_FALLBACK.name,
    },
    select: { id: true, isActive: true },
  });

  if (transferByName) {
    if (!transferByName.isActive) {
      await prisma.transactionCategory.update({
        where: { id: transferByName.id },
        data: { isActive: true },
      });
    }
    return transferByName.id;
  }

  try {
    const createdCategory = await prisma.transactionCategory.create({
      data: {
        userId,
        name: TRANSFER_CATEGORY_FALLBACK.name,
        type: 'TRANSFER',
        color: TRANSFER_CATEGORY_FALLBACK.color,
        icon: TRANSFER_CATEGORY_FALLBACK.icon,
        isDefault: true,
      },
      select: { id: true },
    });

    return createdCategory.id;
  } catch {
    const fallbackCategory = await prisma.transactionCategory.findFirst({
      where: {
        userId,
        type: 'TRANSFER',
      },
      orderBy: { createdAt: 'asc' },
      select: { id: true, isActive: true },
    });

    if (!fallbackCategory) {
      throw new TransactionDomainError('Unable to resolve transfer category', 400);
    }

    if (!fallbackCategory.isActive) {
      await prisma.transactionCategory.update({
        where: { id: fallbackCategory.id },
        data: { isActive: true },
      });
    }

    return fallbackCategory.id;
  }
}

/**
 * Validates transfer destination ownership and consistency.
 */
export async function validateTransferDestination(
  userId: string,
  sourceAccountId: string,
  transferToId: string | undefined,
): Promise<void> {
  if (!transferToId) {
    return;
  }

  const transferToAccount = await prisma.financeAccount.findFirst({
    where: {
      id: transferToId,
      userId,
      isActive: true,
    },
  });

  if (!transferToAccount) {
    throw new TransactionDomainError('Transfer destination account not found or inactive', 400);
  }

  if (sourceAccountId === transferToId) {
    throw new TransactionDomainError('Cannot transfer to the same account', 400);
  }
}
