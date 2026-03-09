import type { AccountType, TransactionType } from '@/generated/prisma';

export interface DemoAccountSeed {
  name: string;
  type: AccountType;
  currency: string;
  balance: number;
  color: string;
  icon: string;
}

export interface DemoFinanceAccountRef {
  id: string;
  name: string;
  currency: string;
}

export interface DemoFinanceCategoryRef {
  id: string;
  name: string;
  type: TransactionType;
}
