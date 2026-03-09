import { prisma } from '@/lib/prisma';
import { applyBalanceEffects, revertBalanceEffects } from './transaction-balance.service';
import {
  balanceEffectSelect,
  type TransactionDetails,
  transactionDetailsSelect,
  TransactionDomainError,
} from './transaction-domain.shared';
import {
  requireActiveAccount,
  resolveCategoryForType,
  validateTransferDestination,
} from './transaction-validation.service';
import type { CreateTransactionInput, UpdateTransactionInput } from './transaction.schemas';

export async function createTransaction(
  userId: string,
  input: CreateTransactionInput,
): Promise<TransactionDetails> {
  const account = await requireActiveAccount(userId, input.accountId);
  const categoryId = await resolveCategoryForType(userId, input.categoryId, input.type);

  if (input.type === 'TRANSFER') {
    await validateTransferDestination(userId, input.accountId, input.transferToId);
  }

  const transactionCurrency = input.currency ?? account.currency;

  return prisma.$transaction(async tx => {
    const transaction = await tx.transaction.create({
      data: {
        ...input,
        categoryId,
        userId,
        date: input.date || new Date(),
        currency: transactionCurrency,
      },
      select: transactionDetailsSelect,
    });

    await applyBalanceEffects(tx, {
      type: input.type,
      accountId: input.accountId,
      amount: input.amount,
      transferToId: input.transferToId ?? null,
      transferAmount: input.transferAmount,
    });

    return transaction;
  });
}

/**
 * Update transaction and atomically re-apply account balance effects.
 */
export async function updateTransaction(
  userId: string,
  input: UpdateTransactionInput,
): Promise<TransactionDetails> {
  const { id, ...updateData } = input;

  const existingTransaction = await prisma.transaction.findFirst({
    where: {
      id,
      userId,
    },
    select: balanceEffectSelect,
  });

  if (!existingTransaction) {
    throw new TransactionDomainError('Transaction not found', 404);
  }

  const nextType = updateData.type ?? existingTransaction.type;
  const nextAccountId = updateData.accountId ?? existingTransaction.accountId;
  const nextTransferToId = updateData.transferToId ?? existingTransaction.transferToId;
  const nextCategoryInput = updateData.categoryId ?? existingTransaction.categoryId;

  await requireActiveAccount(userId, nextAccountId);
  const categoryId = await resolveCategoryForType(userId, nextCategoryInput, nextType);

  if (nextType === 'TRANSFER') {
    await validateTransferDestination(userId, nextAccountId, nextTransferToId ?? undefined);
  }

  const normalizedUpdateData = {
    ...updateData,
    categoryId,
    ...(nextType !== 'TRANSFER'
      ? {
          transferToId: null,
          transferAmount: null,
          transferCurrency: null,
        }
      : {}),
  };

  return prisma.$transaction(async tx => {
    await revertBalanceEffects(tx, existingTransaction);

    const updatedTransaction = await tx.transaction.update({
      where: { id },
      data: normalizedUpdateData,
      select: transactionDetailsSelect,
    });

    const newType = nextType;
    const newAmount = updateData.amount ?? existingTransaction.amount;
    const newAccountId = nextAccountId;
    const newTransferToId = nextTransferToId;

    const nextTransferAmount =
      updateData.transferAmount !== undefined
        ? updateData.transferAmount
        : updatedTransaction.transferAmount || newAmount;

    await applyBalanceEffects(tx, {
      type: newType,
      accountId: newAccountId,
      amount: newAmount,
      transferToId: newTransferToId,
      transferAmount: nextTransferAmount,
    });

    return updatedTransaction;
  });
}

/**
 * Delete transaction and atomically revert account balance effects.
 */
export async function deleteTransaction(userId: string, transactionId: string): Promise<void> {
  const existingTransaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      userId,
    },
    select: balanceEffectSelect,
  });

  if (!existingTransaction) {
    throw new TransactionDomainError('Transaction not found', 404);
  }

  await prisma.$transaction(async tx => {
    await revertBalanceEffects(tx, existingTransaction);

    await tx.transaction.delete({
      where: { id: transactionId },
    });
  });
}
