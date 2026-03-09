import {
  MAX_LOOKBACK_SECONDS,
  OVERLAP_SECONDS,
  type IntegrationAccountShape,
} from './monobank-sync.types';

type TransferCounterAccountParams = {
  text: string;
  counterIban?: string | null;
  operationCurrency: string;
  currentAccountId: string;
  accounts: readonly IntegrationAccountShape[];
};

type IntermediateTransferParams = {
  text: string;
  sourceAccount: IntegrationAccountShape;
  destinationAccount: IntegrationAccountShape | null;
};

export const normalizeText = (value: string): string => value.toLowerCase();

const normalizeIban = (value?: string | null): string | null => {
  if (!value) {
    return null;
  }

  return value.replace(/\s+/g, '').toUpperCase();
};

const getCurrencyHint = (text: string): string | null => {
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

const getAccountNameHint = (text: string): string | null => {
  if (
    text.includes('на чорну картку') ||
    text.includes('чорну картку') ||
    text.includes('на чорну')
  ) {
    return 'black';
  }

  if (text.includes('на білу картку') || text.includes('білу картку') || text.includes('на білу')) {
    return 'white';
  }

  if (
    text.includes('на жовту картку') ||
    text.includes('жовту картку') ||
    text.includes('на жовту')
  ) {
    return 'yellow';
  }

  if (text.includes('to black card') || text.includes('black card')) {
    return 'black';
  }

  if (text.includes('to white card') || text.includes('white card')) {
    return 'white';
  }

  if (text.includes('to yellow card') || text.includes('yellow card')) {
    return 'yellow';
  }

  return null;
};

export const isIntermediateTransfer = (params: IntermediateTransferParams): boolean => {
  const { text, sourceAccount, destinationAccount } = params;

  if (!destinationAccount) {
    return false;
  }

  const isEurToUah =
    sourceAccount.currency === 'EUR' &&
    destinationAccount.currency === 'UAH' &&
    sourceAccount.ownerType === 'FOP' &&
    destinationAccount.ownerType === 'FOP';

  const hasCardTransferKeywords =
    text.includes('для переказу на картку') ||
    text.includes('для переказу') ||
    text.includes('переказу на картку');

  return isEurToUah && hasCardTransferKeywords;
};

export const resolveTransferCounterAccount = (
  params: TransferCounterAccountParams,
): IntegrationAccountShape | null => {
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
  const accountNameHint = getAccountNameHint(params.text);

  if (accountNameHint) {
    const nameMatch = candidates.find(account =>
      account.name.toLowerCase().includes(accountNameHint),
    );
    if (nameMatch) {
      return nameMatch;
    }
  }

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

type TransferExternalIdParams = {
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
  currency: string;
  time: number;
  destinationCurrency?: string;
};

export const buildTransferExternalId = (params: TransferExternalIdParams): string => {
  const pair = [params.sourceAccountId, params.destinationAccountId].sort().join('-');

  if (params.destinationCurrency && params.destinationCurrency !== params.currency) {
    return `transfer:${pair}:${params.time}`;
  }

  return `transfer:${pair}:${params.time}:${params.amount}:${params.currency}`;
};

type FromTimestampParams = {
  nowSeconds: number;
  lastSyncedAt?: Date | null;
  fromDate?: Date | null;
};

export const buildFromTimestamp = (params: FromTimestampParams): number => {
  const minimumSeconds = params.nowSeconds - MAX_LOOKBACK_SECONDS;
  const candidate = params.fromDate ?? params.lastSyncedAt ?? new Date(params.nowSeconds * 1000);
  const candidateSeconds = Math.floor(candidate.getTime() / 1000);

  const withOverlap = params.lastSyncedAt
    ? Math.max(candidateSeconds - OVERLAP_SECONDS, minimumSeconds)
    : candidateSeconds;

  return Math.max(withOverlap, minimumSeconds);
};

export const buildTransactionDescription = (
  description?: string | null,
  comment?: string | null,
  counterName?: string | null,
): string => {
  const cleanedDescription = description?.trim();
  const cleanedComment = comment?.trim();
  const cleanedCounter = counterName?.trim();

  return cleanedComment || cleanedDescription || cleanedCounter || 'Monobank transaction';
};

export const getErrorStatus = (error: unknown): number | null => {
  if (error && typeof error === 'object' && 'status' in error) {
    const status = (error as { status?: number }).status;
    return typeof status === 'number' ? status : null;
  }

  return null;
};

export const delay = async (ms: number): Promise<void> => {
  await new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });
};
