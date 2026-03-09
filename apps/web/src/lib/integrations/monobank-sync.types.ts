import type { PrismaClient } from '@/generated/prisma';
import type { TransactionType } from '@/lib/integrations/monobank-mapping';

export const MAX_LOOKBACK_SECONDS = 2_682_000;
export const OVERLAP_SECONDS = 120;
export const MIN_SYNC_INTERVAL_MS = 60_000;

export type IntegrationAccountShape = {
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

export type SyncableIntegrationAccount = IntegrationAccountShape & {
  financeAccountId: string;
};

export type CategoryType = TransactionType;

export type SyncCategoryResolver = {
  incomeCategoryId: string;
  expenseCategoryId: string;
  transferCategoryId: string;
  resolveCategoryId: (type: CategoryType, names: readonly string[]) => string;
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

export type SyncContext = {
  prisma: PrismaClient;
  userId: string;
  token: string;
  payload?: SyncPayload;
  maxAccountsPerRun?: number;
  throttleMs?: number;
};

export type SyncAccountOkResult = {
  kind: 'ok';
  syncTime: Date;
  importedCount: number;
  updatedAccount: boolean;
};

export type SyncAccountRateLimitResult = {
  kind: 'rate_limit';
  syncTime: Date;
  nextAllowedAt: string;
};

export type SyncAccountResult = SyncAccountOkResult | SyncAccountRateLimitResult;
