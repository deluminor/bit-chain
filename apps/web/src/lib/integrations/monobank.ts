const MONOBANK_API_URL = 'https://api.monobank.ua';

export interface MonobankAccount {
  id: string;
  sendId?: string;
  balance: number;
  creditLimit?: number;
  type: string;
  currencyCode: number;
  cashbackType?: string;
  maskedPan?: string[];
  iban?: string;
}

export interface MonobankManagedClient {
  clientId: string;
  tin?: number;
  name: string;
  accounts: MonobankAccount[];
}

export interface MonobankClientInfo {
  clientId: string;
  name: string;
  webHookUrl?: string;
  permissions?: string;
  accounts: MonobankAccount[];
  managedClients?: MonobankManagedClient[];
}

export interface MonobankStatementItem {
  id: string;
  time: number;
  description?: string;
  comment?: string;
  mcc?: number;
  originalMcc?: number;
  hold?: boolean;
  amount: number;
  operationAmount?: number;
  currencyCode: number;
  commissionRate?: number;
  cashbackAmount?: number;
  balance: number;
  receiptId?: string;
  invoiceId?: string;
  counterEdrpou?: string;
  counterIban?: string;
  counterName?: string;
}

export interface MonobankServerSync {
  serverKeyId: string;
  serverPubKey: string;
  serverTimeMsec: number;
}

const CURRENCY_CODE_MAP: Record<number, string> = {
  980: 'UAH',
  840: 'USD',
  978: 'EUR',
  985: 'PLN',
  826: 'GBP',
  392: 'JPY',
  348: 'HUF',
  124: 'CAD',
  756: 'CHF',
  203: 'CZK',
};

const CURRENCY_DECIMALS: Record<string, number> = {
  JPY: 0,
  HUF: 0,
};

export const MONOBANK_ACCOUNT_TYPE_MAP: Record<
  string,
  'BANK_CARD' | 'SAVINGS' | 'CASH' | 'INVESTMENT'
> = {
  black: 'BANK_CARD',
  white: 'BANK_CARD',
  platinum: 'BANK_CARD',
  iron: 'BANK_CARD',
  fop: 'BANK_CARD',
  eAid: 'BANK_CARD',
  mono: 'BANK_CARD',
};

const createMonobankError = (message: string, status?: number) => {
  const error = new Error(message) as Error & { status?: number };
  if (status) {
    error.status = status;
  }
  return error;
};

const fetchMonobank = async <T>(path: string, token: string): Promise<T> => {
  const response = await fetch(`${MONOBANK_API_URL}${path}`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      'X-Token': token,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw createMonobankError(`Monobank API error (${response.status}): ${body}`, response.status);
  }

  return (await response.json()) as T;
};

export const mapCurrencyCode = (code?: number, fallback = 'UAH') => {
  if (!code) {
    return fallback;
  }
  return CURRENCY_CODE_MAP[code] ?? fallback;
};

export const normalizeMonobankAmount = (amountMinor: number, currency: string) => {
  const decimals = CURRENCY_DECIMALS[currency] ?? 2;
  return amountMinor / Math.pow(10, decimals);
};

export const mapMonobankAccountType = (type: string) => {
  return MONOBANK_ACCOUNT_TYPE_MAP[type] ?? 'BANK_CARD';
};

export const fetchMonobankClientInfo = (token: string) => {
  return fetchMonobank<MonobankClientInfo>('/personal/client-info', token);
};

export const fetchMonobankStatement = (
  token: string,
  accountId: string,
  from: number,
  to?: number,
) => {
  const toSegment = to ? `/${to}` : '';
  return fetchMonobank<MonobankStatementItem[]>(
    `/personal/statement/${accountId}/${from}${toSegment}`,
    token,
  );
};

export const fetchMonobankServerSync = async () => {
  const response = await fetch(`${MONOBANK_API_URL}/bank/sync`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw createMonobankError(`Monobank sync error (${response.status}): ${body}`, response.status);
  }

  return (await response.json()) as MonobankServerSync;
};
