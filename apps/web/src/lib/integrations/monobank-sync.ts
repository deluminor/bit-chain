import { fetchMonobankServerSync } from '@/lib/integrations/monobank';
import { syncSingleMonobankAccount } from './monobank-sync-account.service';
import { buildSyncCategoryResolver } from './monobank-sync-categories.service';
import { delay } from './monobank-sync.helpers';
import { reconcileMonobankBalances } from './monobank-sync-reconciliation.service';
import {
  MIN_SYNC_INTERVAL_MS,
  type IntegrationAccountShape,
  type SyncContext,
  type SyncPayload,
  type SyncResult,
  type SyncableIntegrationAccount,
} from './monobank-sync.types';

export type { SyncContext, SyncPayload, SyncResult } from './monobank-sync.types';

const isSyncableIntegrationAccount = (
  account: IntegrationAccountShape,
): account is SyncableIntegrationAccount =>
  account.importEnabled && Boolean(account.financeAccountId);

const toFilteredSyncableAccounts = (
  accounts: readonly IntegrationAccountShape[],
  payload: SyncPayload,
): SyncableIntegrationAccount[] => {
  const accountNameFilter = payload.accountName?.toLowerCase();
  const syncableAccounts = accounts.filter(isSyncableIntegrationAccount);

  if (!accountNameFilter) {
    return syncableAccounts;
  }

  return syncableAccounts.filter(account => account.name.toLowerCase().includes(accountNameFilter));
};

const buildBaseResult = (payload: SyncPayload): Pick<SyncResult, 'reason' | 'fromDate'> => ({
  reason: payload.reason ?? null,
  fromDate: payload.fromDate?.toISOString() ?? null,
});

/**
 * Syncs Monobank transactions for enabled linked integration accounts.
 */
export async function syncMonobankAccounts({
  prisma,
  userId,
  token,
  payload,
  maxAccountsPerRun,
  throttleMs,
}: SyncContext): Promise<SyncResult> {
  const serverSync = await fetchMonobankServerSync().catch(() => null);
  const initialNow = new Date(serverSync?.serverTimeMsec ?? Date.now());
  const effectivePayload: SyncPayload = payload ?? {};
  const baseResult = buildBaseResult(effectivePayload);

  const integration = await prisma.integration.findUnique({
    where: {
      userId_provider: {
        userId,
        provider: 'MONOBANK',
      },
    },
    include: {
      accounts: true,
    },
  });

  if (!integration) {
    throw new Error('Integration not found');
  }

  if (
    !effectivePayload.force &&
    integration.lastSyncedAt &&
    initialNow.getTime() - integration.lastSyncedAt.getTime() < MIN_SYNC_INTERVAL_MS
  ) {
    return {
      syncedAt: integration.lastSyncedAt.toISOString(),
      importedCount: 0,
      updatedAccounts: 0,
      remainingAccounts: 0,
      ...baseResult,
      skipped: true,
      skipReason: 'rate_limit',
      nextAllowedAt: new Date(
        integration.lastSyncedAt.getTime() + MIN_SYNC_INTERVAL_MS,
      ).toISOString(),
    };
  }

  const integrationAccounts = integration.accounts as IntegrationAccountShape[];

  await reconcileMonobankBalances({
    prisma,
    token,
    accounts: integrationAccounts,
  });

  const enabledAccounts = toFilteredSyncableAccounts(integrationAccounts, effectivePayload);
  if (enabledAccounts.length === 0) {
    return {
      syncedAt: new Date().toISOString(),
      importedCount: 0,
      updatedAccounts: 0,
      remainingAccounts: 0,
      ...baseResult,
      skipped: true,
      skipReason: 'no_accounts',
    };
  }

  const sortedAccounts = [...enabledAccounts].sort((first, second) => {
    const firstSyncedAt = first.lastSyncedAt?.getTime() ?? 0;
    const secondSyncedAt = second.lastSyncedAt?.getTime() ?? 0;
    return firstSyncedAt - secondSyncedAt;
  });

  const rawLimit = maxAccountsPerRun ?? 1;
  const limit = Number.isFinite(rawLimit) ? Math.max(1, rawLimit) : sortedAccounts.length;
  const accountsToSync = sortedAccounts.slice(0, limit);
  const remainingAccounts = Math.max(sortedAccounts.length - accountsToSync.length, 0);
  const categories = await buildSyncCategoryResolver(prisma, userId);

  let importedCount = 0;
  let updatedAccounts = 0;

  for (const [index, account] of accountsToSync.entries()) {
    const accountResult = await syncSingleMonobankAccount({
      prisma,
      token,
      userId,
      account,
      integrationAccounts,
      categories,
      payload: effectivePayload,
      integrationLastSyncedAt: integration.lastSyncedAt,
      serverTimeMsec: serverSync?.serverTimeMsec,
    });

    if (accountResult.kind === 'rate_limit') {
      await prisma.integration.update({
        where: { id: integration.id },
        data: {
          status: 'ERROR',
          lastSyncedAt: accountResult.syncTime,
        },
      });

      const unprocessed = accountsToSync.length - index;

      return {
        syncedAt: accountResult.syncTime.toISOString(),
        importedCount,
        updatedAccounts,
        remainingAccounts: remainingAccounts + unprocessed,
        ...baseResult,
        skipped: true,
        skipReason: 'rate_limit',
        nextAllowedAt: accountResult.nextAllowedAt,
      };
    }

    importedCount += accountResult.importedCount;
    updatedAccounts += accountResult.updatedAccount ? 1 : 0;

    await prisma.integration.update({
      where: { id: integration.id },
      data: { lastSyncedAt: accountResult.syncTime, status: 'CONNECTED' },
    });

    if (throttleMs && index < accountsToSync.length - 1) {
      await delay(throttleMs);
    }
  }

  return {
    syncedAt: initialNow.toISOString(),
    importedCount,
    updatedAccounts,
    remainingAccounts,
    ...baseResult,
  };
}
