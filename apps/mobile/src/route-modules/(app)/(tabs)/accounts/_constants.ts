import type { FilterKey } from './_types';

export const ACCOUNT_FILTERS: ReadonlyArray<{ key: FilterKey; label: string }> = [
  { key: 'ALL', label: 'All' },
  { key: 'BANK_CARD', label: 'Bank' },
  { key: 'CASH', label: 'Cash' },
  { key: 'INVESTMENT', label: 'Investment' },
  { key: 'CRYPTO', label: 'Crypto' },
  { key: 'SAVINGS', label: 'Savings' },
];
