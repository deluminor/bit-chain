import type { Prisma } from '@/generated/prisma';
import { convertToBaseCurrencySafe } from '@/lib/currency';
import { prisma } from '@/lib/prisma';
import {
  type SummaryTransaction,
  type TransactionDetails,
  transactionDetailsSelect,
  transactionSummarySelect,
} from './transaction-domain.shared';
import type { WebTransactionsQuery } from './transaction-query.params';

export interface WebTransactionsListResult {
  transactions: TransactionDetails[];
  summary: {
    income: number;
    expenses: number;
    transfers: number;
    incomeCount: number;
    expenseCount: number;
    transferCount: number;
    maxIncome: number;
    maxExpense: number;
    totalTransactions: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

function normalizeDate(value: string, boundary: 'start' | 'end'): Date | null {
  const hasTime = value.includes('T');
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  if (!hasTime) {
    if (boundary === 'end') {
      date.setHours(23, 59, 59, 999);
    } else {
      date.setHours(0, 0, 0, 0);
    }
  }

  return date;
}

function createOrderBy(
  sortBy: string,
  sortOrder: Prisma.SortOrder,
): Prisma.TransactionOrderByWithRelationInput {
  switch (sortBy) {
    case 'amount':
      return { amount: sortOrder };
    case 'createdAt':
      return { createdAt: sortOrder };
    case 'updatedAt':
      return { updatedAt: sortOrder };
    case 'type':
      return { type: sortOrder };
    case 'description':
      return { description: sortOrder };
    case 'currency':
      return { currency: sortOrder };
    default:
      return { date: sortOrder };
  }
}

async function calculateSummary(transactions: SummaryTransaction[]) {
  let income = 0;
  let expenses = 0;
  let transfers = 0;
  let incomeCount = 0;
  let expenseCount = 0;
  let transferCount = 0;
  let maxIncome = 0;
  let maxExpense = 0;

  for (const transaction of transactions) {
    const currency = transaction.currency || transaction.account?.currency;
    const amountInBase = await convertToBaseCurrencySafe(transaction.amount, currency ?? undefined);

    if (transaction.type === 'INCOME') {
      income += amountInBase;
      incomeCount += 1;
      maxIncome = Math.max(maxIncome, amountInBase);
      continue;
    }

    if (transaction.type === 'EXPENSE') {
      expenses += amountInBase;
      expenseCount += 1;
      maxExpense = Math.max(maxExpense, amountInBase);
      continue;
    }

    transfers += amountInBase;
    transferCount += 1;
  }

  return {
    income,
    expenses,
    transfers,
    incomeCount,
    expenseCount,
    transferCount,
    maxIncome,
    maxExpense,
  };
}

/**
 * Return web transactions list with pagination and base-currency summary.
 */
export async function listWebTransactions(
  userId: string,
  query: WebTransactionsQuery,
): Promise<WebTransactionsListResult> {
  const skip = (query.page - 1) * query.limit;

  const dateFromValue = query.dateFrom ? normalizeDate(query.dateFrom, 'start') : null;
  const dateToValue = query.dateTo ? normalizeDate(query.dateTo, 'end') : null;

  const where: Prisma.TransactionWhereInput = {
    userId,
    ...(query.type && { type: query.type }),
    ...(query.categoryId && { categoryId: query.categoryId }),
    ...((query.dateFrom || query.dateTo) && {
      date: {
        ...(dateFromValue && { gte: dateFromValue }),
        ...(dateToValue && { lte: dateToValue }),
      },
    }),
  };

  const andConditions: Prisma.TransactionWhereInput[] = [];

  if (query.search) {
    andConditions.push({
      OR: [
        { description: { contains: query.search, mode: 'insensitive' } },
        { tags: { hasSome: [query.search] } },
      ],
    });
  }

  if (query.accountId) {
    andConditions.push({
      OR: [{ accountId: query.accountId }, { transferToId: query.accountId }],
    });
  }

  if (andConditions.length > 0) {
    where.AND = andConditions;
  }

  const [transactions, totalCount, summaryTransactions] = await Promise.all([
    prisma.transaction.findMany({
      where,
      select: transactionDetailsSelect,
      orderBy: createOrderBy(query.sortBy, query.sortOrder),
      skip,
      take: query.limit,
    }),
    prisma.transaction.count({ where }),
    prisma.transaction.findMany({
      where,
      select: transactionSummarySelect,
    }),
  ]);

  const summaryTotals = await calculateSummary(summaryTransactions);

  return {
    transactions,
    summary: {
      ...summaryTotals,
      totalTransactions: totalCount,
    },
    pagination: {
      page: query.page,
      limit: query.limit,
      total: totalCount,
      pages: Math.ceil(totalCount / query.limit),
    },
  };
}
