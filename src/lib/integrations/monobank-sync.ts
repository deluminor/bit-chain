import type { Prisma, PrismaClient } from '@/generated/prisma';
import {
  fetchMonobankClientInfo,
  fetchMonobankServerSync,
  fetchMonobankStatement,
  mapCurrencyCode,
  normalizeMonobankAmount,
} from '@/lib/integrations/monobank';
import { classifyMonobankStatement } from '@/lib/integrations/monobank-mapping';

const MAX_LOOKBACK_SECONDS = 2_682_000;
const OVERLAP_SECONDS = 120;
const MIN_SYNC_INTERVAL_MS = 60_000;

type IntegrationAccountShape = {
  id: string;
  providerAccountId: string;
  name: string;
  currency: string;
  balance: number;
  accountType: string;
  ownerType: 'PERSONAL' | 'FOP';
  iban: string | null;
  financeAccountId: string | null;
  lastSyncedAt: Date | null;
  importEnabled: boolean;
};

export type SyncPayload = {
  reason?: string | null;
  fromDate?: Date | null;
  force?: boolean;
  accountName?: string;
};

export type SyncResult = {
  syncedAt: string;
  importedCount: number;
  updatedAccounts: number;
  remainingAccounts: number;
  reason: string | null;
  fromDate: string | null;
  skipped?: boolean;
  skipReason?: 'rate_limit' | 'no_accounts';
  nextAllowedAt?: string;
};

type SyncContext = {
  prisma: PrismaClient;
  userId: string;
  token: string;
  payload?: SyncPayload;
  maxAccountsPerRun?: number;
  throttleMs?: number;
};

const normalizeText = (value: string) => value.toLowerCase();

const normalizeIban = (value?: string | null) => {
  if (!value) {
    return null;
  }

  return value.replace(/\s+/g, '').toUpperCase();
};

const getCurrencyHint = (text: string) => {
  if (text.includes('євр') || text.includes('eur')) {
    return 'EUR';
  }
  if (text.includes('долар') || text.includes('usd')) {
    return 'USD';
  }
  if (text.includes('грив') || text.includes('uah')) {
    return 'UAH';
  }

  return null;
};

const resolveTransferCounterAccount = (params: {
  text: string;
  counterIban?: string | null;
  operationCurrency: string;
  currentAccountId: string;
  accounts: IntegrationAccountShape[];
}) => {
  const normalizedIban = normalizeIban(params.counterIban ?? null);
  if (normalizedIban) {
    const ibanMatch = params.accounts.find(
      account =>
        normalizeIban(account.iban) === normalizedIban && account.id !== params.currentAccountId,
    );
    if (ibanMatch) {
      return ibanMatch;
    }
  }

  let candidates = params.accounts.filter(account => account.id !== params.currentAccountId);

  if (params.text.includes('фоп') || params.text.includes('fop')) {
    candidates = candidates.filter(account => account.ownerType === 'FOP');
  }

  const currencyHint = getCurrencyHint(params.text) ?? params.operationCurrency;
  if (currencyHint) {
    const filtered = candidates.filter(account => account.currency === currencyHint);
    if (filtered.length > 0) {
      candidates = filtered;
    }
  }

  return candidates[0] ?? null;
};

const buildTransferExternalId = (params: {
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
  currency: string;
  time: number;
}) => {
  const pair = [params.sourceAccountId, params.destinationAccountId].sort().join('-');
  return `transfer:${pair}:${params.time}:${params.amount}:${params.currency}`;
};

const buildFromTimestamp = (params: {
  nowSeconds: number;
  lastSyncedAt?: Date | null;
  fromDate?: Date | null;
}) => {
  const minimumSeconds = params.nowSeconds - MAX_LOOKBACK_SECONDS;
  const candidate = params.fromDate ?? params.lastSyncedAt ?? new Date(params.nowSeconds * 1000);
  const candidateSeconds = Math.floor(candidate.getTime() / 1000);
  const withOverlap = params.lastSyncedAt
    ? Math.max(candidateSeconds - OVERLAP_SECONDS, minimumSeconds)
    : candidateSeconds;

  return Math.max(withOverlap, minimumSeconds);
};

const buildTransactionDescription = (
  description?: string | null,
  comment?: string | null,
  counterName?: string | null,
) => {
  const cleanedDescription = description?.trim();
  const cleanedComment = comment?.trim();
  const cleanedCounter = counterName?.trim();

  return cleanedComment || cleanedDescription || cleanedCounter || 'Monobank transaction';
};

const ensureFallbackCategory = async (
  prisma: PrismaClient,
  userId: string,
  type: 'INCOME' | 'EXPENSE',
) => {
  const existing = await prisma.transactionCategory.findFirst({
    where: {
      userId,
      type,
      isDefault: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  if (existing) {
    return existing;
  }

  const fallbackName = type === 'INCOME' ? 'Other Income' : 'Other Expenses';
  const fallbackColor = type === 'INCOME' ? '#10B981' : '#EF4444';
  const fallbackIcon = 'MoreHorizontal';

  return prisma.transactionCategory.create({
    data: {
      userId,
      name: fallbackName,
      type,
      color: fallbackColor,
      icon: fallbackIcon,
      isDefault: true,
    },
  });
};

const ensureTransferCategory = async (prisma: PrismaClient, userId: string) => {
  const existing = await prisma.transactionCategory.findFirst({
    where: {
      userId,
      type: 'TRANSFER',
      isDefault: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  if (existing) {
    return existing;
  }

  return prisma.transactionCategory.create({
    data: {
      userId,
      name: 'Transfer',
      type: 'TRANSFER',
      color: '#3B82F6',
      icon: 'ArrowRightLeft',
      isDefault: true,
    },
  });
};

const getErrorStatus = (error: unknown) => {
  if (error && typeof error === 'object' && 'status' in error) {
    const status = (error as { status?: number }).status;
    return typeof status === 'number' ? status : null;
  }
  return null;
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function syncMonobankAccounts({
  prisma,
  userId,
  token,
  payload,
  maxAccountsPerRun,
  throttleMs,
}: SyncContext) {
  const serverSync = await fetchMonobankServerSync().catch(() => null);
  const initialNow = new Date(serverSync?.serverTimeMsec ?? Date.now());

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

  const effectivePayload = payload ?? {};

  if (
    !effectivePayload.force &&
    integration.lastSyncedAt &&
    initialNow.getTime() - integration.lastSyncedAt.getTime() < MIN_SYNC_INTERVAL_MS
  ) {
    const nextAllowedAt = new Date(
      integration.lastSyncedAt.getTime() + MIN_SYNC_INTERVAL_MS,
    ).toISOString();
    return {
      syncedAt: integration.lastSyncedAt.toISOString(),
      importedCount: 0,
      updatedAccounts: 0,
      remainingAccounts: 0,
      reason: effectivePayload.reason ?? null,
      fromDate: effectivePayload.fromDate?.toISOString() ?? null,
      skipped: true,
      skipReason: 'rate_limit',
      nextAllowedAt,
    } satisfies SyncResult;
  }

  // Always perform balance reconciliation
  try {
    const clientInfo = await fetchMonobankClientInfo(token);

    const balanceMap = new Map<string, number>();

    const processAccount = (acc: { id: string; currencyCode: number; balance: number }) => {
      const currency = mapCurrencyCode(acc.currencyCode);
      const normalized = normalizeMonobankAmount(acc.balance, currency);
      balanceMap.set(acc.id, normalized);
    };

    clientInfo.accounts.forEach(processAccount);
    clientInfo.managedClients?.forEach(client => client.accounts.forEach(processAccount));

    for (const account of integration.accounts) {
      const correctBalance = balanceMap.get(account.providerAccountId);
      if (correctBalance !== undefined) {
        // Update both integration and finance accounts directly
        await prisma.integrationAccount.update({
          where: { id: account.id },
          data: { balance: correctBalance },
        });

        if (account.financeAccountId) {
          await prisma.financeAccount.update({
            where: { id: account.financeAccountId },
            data: { balance: correctBalance },
          });
        }
      }
    }
  } catch (error) {
    console.error('Failed to perform balance reconciliation:', error);
    // Continue with normal sync even if this fails
  }

  const integrationAccounts = integration.accounts as IntegrationAccountShape[];
  const enabledAccounts = integrationAccounts.filter(
    account =>
      account.importEnabled &&
      account.financeAccountId &&
      (!effectivePayload.accountName ||
        account.name.toLowerCase().includes(effectivePayload.accountName.toLowerCase())),
  );

  if (enabledAccounts.length === 0) {
    return {
      syncedAt: new Date().toISOString(),
      importedCount: 0,
      updatedAccounts: 0,
      remainingAccounts: 0,
      reason: effectivePayload.reason ?? null,
      fromDate: effectivePayload.fromDate?.toISOString() ?? null,
      skipped: true,
      skipReason: 'no_accounts',
    } satisfies SyncResult;
  }

  const sortedAccounts = [...enabledAccounts].sort((first, second) => {
    const firstSync = first.lastSyncedAt ? first.lastSyncedAt.getTime() : 0;
    const secondSync = second.lastSyncedAt ? second.lastSyncedAt.getTime() : 0;
    return firstSync - secondSync;
  });

  const rawLimit = maxAccountsPerRun ?? 1;
  const limit = Number.isFinite(rawLimit) ? Math.max(1, rawLimit) : sortedAccounts.length;
  const accountsToSync = sortedAccounts.slice(0, limit);
  const remainingAccounts = Math.max(sortedAccounts.length - accountsToSync.length, 0);

  const [incomeCategory, expenseCategory, transferCategory, categories] = await Promise.all([
    ensureFallbackCategory(prisma, userId, 'INCOME'),
    ensureFallbackCategory(prisma, userId, 'EXPENSE'),
    ensureTransferCategory(prisma, userId),
    prisma.transactionCategory.findMany({
      where: { userId, isActive: true },
      select: { id: true, name: true, type: true },
    }),
  ]);

  const categoryMap = new Map<string, string>();
  for (const category of categories) {
    categoryMap.set(`${category.type}:${category.name.toLowerCase()}`, category.id);
  }

  const resolveCategoryId = (
    type: 'INCOME' | 'EXPENSE' | 'TRANSFER',
    names: string[],
    fallbackId: string,
  ) => {
    for (const name of names) {
      const key = `${type}:${name.toLowerCase()}`;
      const match = categoryMap.get(key);
      if (match) {
        return match;
      }
    }

    return fallbackId;
  };

  let createdCount = 0;
  let updatedAccounts = 0;
  for (const [index, account] of accountsToSync.entries()) {
    const syncTime = new Date(serverSync?.serverTimeMsec ?? Date.now());
    const nowSeconds = Math.floor(syncTime.getTime() / 1000);
    const fromTimestamp = buildFromTimestamp({
      nowSeconds,
      lastSyncedAt: account.lastSyncedAt ?? integration.lastSyncedAt,
      fromDate: effectivePayload.fromDate,
    });
    const toTimestamp = nowSeconds;

    let statements = [] as Awaited<ReturnType<typeof fetchMonobankStatement>>;

    try {
      console.log(`[MonobankSync] Fetching statement for account ${account.name} (${account.id})`, {
        fromTimestamp,
        toTimestamp,
        fromDate: new Date(fromTimestamp * 1000).toISOString(),
      });

      statements = await fetchMonobankStatement(
        token,
        account.providerAccountId,
        fromTimestamp,
        toTimestamp,
      );

      console.log(
        `[MonobankSync] Received ${statements.length} items for ${account.name}`,
        statements.length > 0
          ? {
              first: statements[0],
              last: statements[statements.length - 1],
            }
          : 'No items',
      );
    } catch (error) {
      const status = getErrorStatus(error);
      if (status === 429) {
        const nextAllowedAt = new Date(syncTime.getTime() + MIN_SYNC_INTERVAL_MS).toISOString();

        await prisma.integration.update({
          where: { id: integration.id },
          data: {
            status: 'ERROR',
            lastSyncedAt: syncTime,
          },
        });

        const unprocessed = accountsToSync.length - index;

        return {
          syncedAt: syncTime.toISOString(),
          importedCount: createdCount,
          updatedAccounts,
          remainingAccounts: remainingAccounts + unprocessed,
          reason: effectivePayload.reason ?? null,
          fromDate: effectivePayload.fromDate?.toISOString() ?? null,
          skipped: true,
          skipReason: 'rate_limit',
          nextAllowedAt,
        } satisfies SyncResult;
      }

      throw error;
    }

    if (statements.length > 0) {
      const transactionData = statements
        // .filter(item => !item.hold) // Allow pending transactions
        .map(item => {
          const accountCurrency = account.currency;
          const operationCurrency = mapCurrencyCode(item.currencyCode, accountCurrency);
          const absoluteAmount = Math.abs(item.amount);
          const amount = normalizeMonobankAmount(absoluteAmount, accountCurrency);
          const operationAmountRaw = item.operationAmount ?? null;
          const operationAmount =
            operationAmountRaw != null
              ? normalizeMonobankAmount(Math.abs(operationAmountRaw), operationCurrency)
              : null;
          const classification = classifyMonobankStatement({
            amount: item.amount,
            mcc: item.mcc ?? item.originalMcc ?? null,
            description: item.description,
            comment: item.comment,
            counterName: item.counterName,
          });
          const fallbackId =
            classification.type === 'INCOME'
              ? incomeCategory.id
              : classification.type === 'TRANSFER'
                ? transferCategory.id
                : expenseCategory.id;
          const categoryId = resolveCategoryId(
            classification.type,
            classification.categoryNames,
            fallbackId,
          );

          const baseDescription = buildTransactionDescription(
            item.description,
            item.comment,
            item.counterName,
          );

          const normalizedText = normalizeText(baseDescription);

          if (classification.type === 'TRANSFER') {
            const counterAccount = resolveTransferCounterAccount({
              text: normalizedText,
              counterIban: item.counterIban ?? null,
              operationCurrency,
              currentAccountId: account.id,
              accounts: integrationAccounts,
            });
            const isIncoming = item.amount > 0;
            const sourceAccount = isIncoming ? counterAccount : account;
            const destinationAccount = isIncoming ? account : counterAccount;
            const resolvedSourceAccount = sourceAccount?.financeAccountId ? sourceAccount : account;
            const resolvedDestinationAccount = destinationAccount?.financeAccountId
              ? destinationAccount
              : null;

            const sourceCurrency = resolvedSourceAccount.currency ?? accountCurrency;
            const destinationCurrency = resolvedDestinationAccount?.currency ?? accountCurrency;
            const sourceAmount =
              resolvedSourceAccount.id === account.id ? amount : (operationAmount ?? amount);
            const destinationAmount =
              resolvedDestinationAccount?.id === account.id ? amount : (operationAmount ?? amount);

            const descriptionParts = [baseDescription];
            if (resolvedSourceAccount && resolvedDestinationAccount) {
              descriptionParts.push(
                `Transfer ${resolvedSourceAccount.name} -> ${resolvedDestinationAccount.name}`,
              );
            } else if (resolvedDestinationAccount) {
              descriptionParts.push(`Transfer to ${resolvedDestinationAccount.name}`);
            } else if (resolvedSourceAccount) {
              descriptionParts.push(`Transfer from ${resolvedSourceAccount.name}`);
            }

            const transferExternalId =
              resolvedSourceAccount && resolvedDestinationAccount
                ? buildTransferExternalId({
                    sourceAccountId: resolvedSourceAccount.id,
                    destinationAccountId: resolvedDestinationAccount.id,
                    amount: sourceAmount,
                    currency: sourceCurrency,
                    time: item.time,
                  })
                : item.id;

            const isSameAccount = resolvedDestinationAccount?.id === resolvedSourceAccount.id;

            return {
              userId,
              accountId: resolvedSourceAccount.financeAccountId as string,
              categoryId,
              type: 'TRANSFER' as const,
              amount: sourceAmount,
              currency: sourceCurrency,
              description: descriptionParts.join(' | '),
              date: new Date(item.time * 1000),
              tags: [] as string[],
              isRecurring: false,
              source: 'MONOBANK' as const,
              externalId: transferExternalId,
              integrationAccountId: account.id,
              transferToId: isSameAccount
                ? null
                : (resolvedDestinationAccount?.financeAccountId ?? null),
              transferAmount: isSameAccount ? null : destinationAmount,
              transferCurrency: isSameAccount ? null : destinationCurrency,
            } satisfies Prisma.TransactionCreateManyInput;
          }

          const description =
            operationAmount != null && operationCurrency !== accountCurrency
              ? `${baseDescription} (${operationCurrency} ${operationAmount})`
              : baseDescription;

          return {
            userId,
            accountId: account.financeAccountId as string,
            categoryId,
            type: classification.type,
            amount,
            currency: accountCurrency,
            description,
            date: new Date(item.time * 1000),
            tags: [] as string[],
            isRecurring: false,
            source: 'MONOBANK' as const,
            externalId: item.id,
            integrationAccountId: account.id,
          } satisfies Prisma.TransactionCreateManyInput;
        })
        .filter(item => item.amount > 0);

      if (transactionData.length > 0) {
        const result = await prisma.transaction.createMany({
          data: transactionData,
          skipDuplicates: true,
        });
        createdCount += result.count;
      }

      const latestStatement = statements.reduce((latest, item) =>
        item.time > latest.time ? item : latest,
      );
      const latestCurrency = mapCurrencyCode(latestStatement.currencyCode, account.currency);
      const latestBalance = normalizeMonobankAmount(latestStatement.balance, latestCurrency);

      await prisma.financeAccount.update({
        where: { id: account.financeAccountId as string },
        data: { balance: latestBalance },
      });

      await prisma.integrationAccount.update({
        where: { id: account.id },
        data: {
          balance: latestBalance,
          lastSyncedAt: syncTime,
        },
      });

      updatedAccounts += 1;
    } else {
      await prisma.integrationAccount.update({
        where: { id: account.id },
        data: { lastSyncedAt: syncTime },
      });
    }

    await prisma.integration.update({
      where: { id: integration.id },
      data: { lastSyncedAt: syncTime, status: 'CONNECTED' },
    });

    if (throttleMs && index < accountsToSync.length - 1) {
      await delay(throttleMs);
    }
  }

  return {
    syncedAt: initialNow.toISOString(),
    importedCount: createdCount,
    updatedAccounts,
    remainingAccounts,
    reason: effectivePayload.reason ?? null,
    fromDate: effectivePayload.fromDate?.toISOString() ?? null,
  } satisfies SyncResult;
}
