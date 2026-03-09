import type { Prisma } from '@/generated/prisma';
import type { BalanceEffectTransaction, TransactionType } from './transaction-domain.shared';

const MONOBANK_PROVIDER = 'MONOBANK' as const;
const CONNECTED_STATUS = 'CONNECTED' as const;

async function isIntegratedAccount(
  tx: Prisma.TransactionClient,
  accountId: string,
): Promise<boolean> {
  const linkedIntegrationAccount = await tx.integrationAccount.findFirst({
    where: {
      financeAccountId: accountId,
      importEnabled: true,
      integration: {
        provider: MONOBANK_PROVIDER,
        status: CONNECTED_STATUS,
      },
    },
    select: { id: true },
  });

  return Boolean(linkedIntegrationAccount);
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
  switch (transaction.type) {
    case 'INCOME': {
      const sourceIntegrated = await isIntegratedAccount(tx, transaction.accountId);
      if (sourceIntegrated) return;

      await tx.financeAccount.update({
        where: { id: transaction.accountId },
        data: { balance: { increment: transaction.amount } },
      });
      return;
    }

    case 'EXPENSE': {
      const sourceIntegrated = await isIntegratedAccount(tx, transaction.accountId);
      if (sourceIntegrated) return;

      await tx.financeAccount.update({
        where: { id: transaction.accountId },
        data: { balance: { decrement: transaction.amount } },
      });
      return;
    }

    case 'TRANSFER': {
      if (!transaction.transferToId) return;

      const sourceIntegrated = await isIntegratedAccount(tx, transaction.accountId);
      if (!sourceIntegrated) {
        await tx.financeAccount.update({
          where: { id: transaction.accountId },
          data: { balance: { decrement: transaction.amount } },
        });
      }

      const destinationIntegrated = await isIntegratedAccount(tx, transaction.transferToId);
      if (destinationIntegrated) return;

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
  switch (transaction.type) {
    case 'INCOME': {
      const sourceIntegrated = await isIntegratedAccount(tx, transaction.accountId);
      if (sourceIntegrated) {
        return;
      }

      await tx.financeAccount.update({
        where: { id: transaction.accountId },
        data: { balance: { decrement: transaction.amount } },
      });
      return;
    }

    case 'EXPENSE': {
      const sourceIntegrated = await isIntegratedAccount(tx, transaction.accountId);
      if (sourceIntegrated) {
        return;
      }

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

      const sourceIntegrated = await isIntegratedAccount(tx, transaction.accountId);
      if (!sourceIntegrated) {
        await tx.financeAccount.update({
          where: { id: transaction.accountId },
          data: { balance: { increment: transaction.amount } },
        });
      }

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
