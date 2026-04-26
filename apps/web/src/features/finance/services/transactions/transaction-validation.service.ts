import type { Prisma } from '@/generated/prisma';
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

export async function resolveLoanIdForExpense(
  userId: string,
  categoryId: string,
  loanIdInput: string | null | undefined,
): Promise<string | null> {
  const category = await prisma.transactionCategory.findFirst({
    where: { id: categoryId, userId, isActive: true },
    select: { isLoanRepayment: true },
  });

  if (!category) {
    throw new TransactionDomainError('Category not found', 400);
  }

  if (category.isLoanRepayment) {
    if (!loanIdInput) {
      throw new TransactionDomainError('Select which loan this repayment applies to', 400);
    }

    return loanIdInput;
  }

  return null;
}

export async function validateLoanForRepayment(
  userId: string,
  loanId: string | undefined | null,
  amount: number,
): Promise<void> {
  if (!loanId) return;

  const loan = await prisma.loan.findFirst({
    where: { id: loanId, userId },
    select: { id: true, totalAmount: true, paidAmount: true },
  });

  if (!loan) {
    throw new TransactionDomainError('Loan not found', 400);
  }

  const remaining = loan.totalAmount - loan.paidAmount;
  if (amount > remaining) {
    throw new TransactionDomainError(
      `Repayment amount exceeds remaining balance (${remaining} left)`,
      400,
    );
  }
}

type LoanRow = { id: string; totalAmount: number; paidAmount: number };

/**
 * Validates loan for repayment inside a transaction with row lock (FOR UPDATE).
 * Prevents race conditions when multiple repayments are created concurrently.
 *
 * @param tx - Prisma transaction client
 * @param userId - Authenticated user ID
 * @param loanId - Loan to validate
 * @param amount - Repayment amount
 */
export async function validateLoanForRepaymentWithLock(
  tx: Omit<Prisma.TransactionClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>,
  userId: string,
  loanId: string | undefined | null,
  amount: number,
): Promise<void> {
  if (!loanId) return;

  const rows = await tx.$queryRaw<LoanRow[]>`
    SELECT id, "totalAmount", "paidAmount" FROM "Loan"
    WHERE id = ${loanId} AND "userId" = ${userId}
    FOR UPDATE
  `;

  const loan = rows[0];
  if (!loan) {
    throw new TransactionDomainError('Loan not found', 400);
  }

  const remaining = loan.totalAmount - loan.paidAmount;
  if (amount > remaining) {
    throw new TransactionDomainError(
      `Repayment amount exceeds remaining balance (${remaining} left)`,
      400,
    );
  }
}

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
