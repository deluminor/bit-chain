import type { Prisma } from '@/generated/prisma';

export const transactionDetailsSelect = {
  id: true,
  type: true,
  amount: true,
  currency: true,
  amountInAccountCurrency: true,
  description: true,
  date: true,
  tags: true,
  transferToId: true,
  transferAmount: true,
  transferCurrency: true,
  loanId: true,
  loan: { select: { name: true } },
  createdAt: true,
  updatedAt: true,
  account: {
    select: {
      id: true,
      name: true,
      type: true,
      currency: true,
      color: true,
      icon: true,
    },
  },
  category: {
    select: {
      id: true,
      name: true,
      color: true,
      icon: true,
      type: true,
    },
  },
  transferTo: {
    select: {
      id: true,
      name: true,
      type: true,
      currency: true,
    },
  },
} satisfies Prisma.TransactionSelect;

export const transactionSummarySelect = {
  type: true,
  amount: true,
  currency: true,
  account: {
    select: {
      currency: true,
    },
  },
} satisfies Prisma.TransactionSelect;

export const balanceEffectSelect = {
  id: true,
  type: true,
  amount: true,
  accountId: true,
  categoryId: true,
  transferToId: true,
  transferAmount: true,
  loanId: true,
} satisfies Prisma.TransactionSelect;

export type TransactionDetails = Prisma.TransactionGetPayload<{
  select: typeof transactionDetailsSelect;
}>;
export type SummaryTransaction = Prisma.TransactionGetPayload<{
  select: typeof transactionSummarySelect;
}>;
export type BalanceEffectTransaction = Prisma.TransactionGetPayload<{
  select: typeof balanceEffectSelect;
}>;
export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export class TransactionDomainError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'TransactionDomainError';
    this.status = status;
    this.details = details;
  }
}
