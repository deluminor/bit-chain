import { prisma } from '@/lib/prisma';
import type { CreateTransactionInput, UpdateTransactionInput } from './transaction.schemas';
import {
  balanceEffectSelect,
  type TransactionDetails,
  transactionDetailsSelect,
  TransactionDomainError,
} from './transaction-domain.shared';
import { applyBalanceEffects, revertBalanceEffects } from './transaction-balance.service';
import {
  requireActiveAccount,
  requireCategoryForType,
  validateTransferDestination,
} from './transaction-validation.service';

/**
 * Create transaction and atomically apply account balance effects.
 */
export async function createTransaction(
  userId: string,
  input: CreateTransactionInput,
): Promise<TransactionDetails> {
  const account = await requireActiveAccount(userId, input.accountId);
  await requireCategoryForType(userId, input.categoryId, input.type);

  if (input.type === 'TRANSFER') {
    await validateTransferDestination(userId, input.accountId, input.transferToId);
  }

  const transactionCurrency = input.currency ?? account.currency;

  return prisma.$transaction(async tx => {
    const transaction = await tx.transaction.create({
      data: {
        ...input,
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

  return prisma.$transaction(async tx => {
    await revertBalanceEffects(tx, existingTransaction);

    const updatedTransaction = await tx.transaction.update({
      where: { id },
      data: updateData,
      select: transactionDetailsSelect,
    });

    const newType = updateData.type ?? existingTransaction.type;
    const newAmount = updateData.amount ?? existingTransaction.amount;
    const newAccountId = updateData.accountId ?? existingTransaction.accountId;
    const newTransferToId = updateData.transferToId ?? existingTransaction.transferToId;

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
