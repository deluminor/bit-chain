import type { FinanceAccount } from '@/features/finance/queries/accounts';

export interface BalanceDataPoint {
  date: string;
  [accountId: string]: number | string;
}

export interface AccountLineMeta {
  account: FinanceAccount;
  color: string;
}
