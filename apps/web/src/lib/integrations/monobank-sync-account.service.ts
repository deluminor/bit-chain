import type { PrismaClient } from '@/generated/prisma';
import {
  fetchMonobankStatement,
  mapCurrencyCode,
  normalizeMonobankAmount,
} from '@/lib/integrations/monobank';
import { buildFromTimestamp, getErrorStatus } from './monobank-sync.helpers';
import { mapMonobankStatementsToTransactions } from './monobank-sync-transaction-mapper';
import { MIN_SYNC_INTERVAL_MS, type SyncAccountResult } from './monobank-sync.types';
import type {
  IntegrationAccountShape,
  SyncCategoryResolver,
  SyncPayload,
  SyncableIntegrationAccount,
} from './monobank-sync.types';

type SyncSingleAccountParams = {
  prisma: PrismaClient;
  token: string;
  userId: string;
  account: SyncableIntegrationAccount;
  integrationAccounts: readonly IntegrationAccountShape[];
  categories: SyncCategoryResolver;
  payload: SyncPayload;
  integrationLastSyncedAt: Date | null;
  serverTimeMsec?: number | null;
};

/**
 * Syncs one integration account and returns import stats or rate-limit signal.
 */
export async function syncSingleMonobankAccount({
  prisma,
  token,
  userId,
  account,
  integrationAccounts,
  categories,
  payload,
  integrationLastSyncedAt,
  serverTimeMsec,
}: SyncSingleAccountParams): Promise<SyncAccountResult> {
  const syncTime = new Date(serverTimeMsec ?? Date.now());
  const nowSeconds = Math.floor(syncTime.getTime() / 1000);
  const fromTimestamp = buildFromTimestamp({
    nowSeconds,
    lastSyncedAt: account.lastSyncedAt ?? integrationLastSyncedAt,
    fromDate: payload.fromDate,
  });

  const toTimestamp = nowSeconds;

  let statements = [] as Awaited<ReturnType<typeof fetchMonobankStatement>>;

  try {
    statements = await fetchMonobankStatement(
      token,
      account.providerAccountId,
      fromTimestamp,
      toTimestamp,
    );
  } catch (error) {
    const status = getErrorStatus(error);
    if (status === 429) {
      return {
        kind: 'rate_limit',
        syncTime,
        nextAllowedAt: new Date(syncTime.getTime() + MIN_SYNC_INTERVAL_MS).toISOString(),
      };
    }

    throw error;
  }

  if (statements.length === 0) {
    await prisma.integrationAccount.update({
      where: { id: account.id },
      data: { lastSyncedAt: syncTime },
    });

    return {
      kind: 'ok',
      syncTime,
      importedCount: 0,
      updatedAccount: false,
    };
  }

  const transactionData = mapMonobankStatementsToTransactions({
    userId,
    account,
    integrationAccounts,
    statements,
    categories,
  });

  let importedCount = 0;
  if (transactionData.length > 0) {
    const result = await prisma.transaction.createMany({
      data: transactionData,
      skipDuplicates: true,
    });
    importedCount = result.count;
  }

  const latestStatement = statements.reduce((latest, statement) =>
    statement.time > latest.time ? statement : latest,
  );
  const latestCurrency = mapCurrencyCode(latestStatement.currencyCode, account.currency);
  const latestBalance = normalizeMonobankAmount(latestStatement.balance, latestCurrency);

  await prisma.financeAccount.update({
    where: { id: account.financeAccountId },
    data: { balance: latestBalance },
  });

  await prisma.integrationAccount.update({
    where: { id: account.id },
    data: {
      balance: latestBalance,
      lastSyncedAt: syncTime,
    },
  });

  return {
    kind: 'ok',
    syncTime,
    importedCount,
    updatedAccount: true,
  };
}
