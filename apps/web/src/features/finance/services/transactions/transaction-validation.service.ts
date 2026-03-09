import { prisma } from '@/lib/prisma';
import { TransactionDomainError, type TransactionType } from './transaction-domain.shared';

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
