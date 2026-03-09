import type { Prisma } from '@/generated/prisma';
import type { BalanceEffectTransaction, TransactionType } from './transaction-domain.shared';

async function isIntegratedAccount(
  tx: Prisma.TransactionClient,
  accountId: string,
): Promise<boolean> {
  const account = await tx.financeAccount.findUnique({
    where: { id: accountId },
    include: { integrationAccounts: true },
  });

  return (account?.integrationAccounts.length ?? 0) > 0;
}

function resolveTransferAmount(amount: number, transferAmount: number | null | undefined): number {
  return transferAmount || amount;
}

/**
 * Applies balance changes for created/updated transaction.
 */
export async function applyBalanceEffects(
  tx: Prisma.TransactionClient,
  transaction: {
    type: TransactionType;
    accountId: string;
    amount: number;
    transferToId: string | null;
    transferAmount: number | null | undefined;
  },
): Promise<void> {
  const sourceIntegrated = await isIntegratedAccount(tx, transaction.accountId);

  if (sourceIntegrated) {
    return;
  }

  switch (transaction.type) {
    case 'INCOME': {
      await tx.financeAccount.update({
        where: { id: transaction.accountId },
        data: { balance: { increment: transaction.amount } },
      });
      return;
    }

    case 'EXPENSE': {
      await tx.financeAccount.update({
        where: { id: transaction.accountId },
        data: { balance: { decrement: transaction.amount } },
      });
      return;
    }

    case 'TRANSFER': {
      if (!transaction.transferToId) {
        return;
      }

      await tx.financeAccount.update({
        where: { id: transaction.accountId },
        data: { balance: { decrement: transaction.amount } },
      });

      const destinationIntegrated = await isIntegratedAccount(tx, transaction.transferToId);
      if (destinationIntegrated) {
        return;
      }

      await tx.financeAccount.update({
        where: { id: transaction.transferToId },
        data: {
          balance: {
            increment: resolveTransferAmount(transaction.amount, transaction.transferAmount),
          },
        },
      });
      return;
    }
  }
}

/**
 * Reverts balance changes for deleted/updated transaction.
 */
export async function revertBalanceEffects(
  tx: Prisma.TransactionClient,
  transaction: BalanceEffectTransaction,
): Promise<void> {
  const sourceIntegrated = await isIntegratedAccount(tx, transaction.accountId);

  if (sourceIntegrated) {
    return;
  }

  switch (transaction.type) {
    case 'INCOME': {
      await tx.financeAccount.update({
        where: { id: transaction.accountId },
        data: { balance: { decrement: transaction.amount } },
      });
      return;
    }

    case 'EXPENSE': {
      await tx.financeAccount.update({
        where: { id: transaction.accountId },
        data: { balance: { increment: transaction.amount } },
      });
      return;
    }

    case 'TRANSFER': {
      if (!transaction.transferToId) {
        return;
      }

      await tx.financeAccount.update({
        where: { id: transaction.accountId },
        data: { balance: { increment: transaction.amount } },
      });

      const destinationIntegrated = await isIntegratedAccount(tx, transaction.transferToId);
      if (destinationIntegrated) {
        return;
      }

      await tx.financeAccount.update({
        where: { id: transaction.transferToId },
        data: {
          balance: {
            decrement: resolveTransferAmount(transaction.amount, transaction.transferAmount),
          },
        },
      });
      return;
    }
  }
}
