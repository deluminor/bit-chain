import type { Prisma } from '@/generated/prisma';
import type { TransactionsListResponse } from '@bit-chain/api-contracts';
import { prisma } from '@/lib/prisma';
import type { MobileTransactionsQuery } from './transaction-query.params';

/**
 * Return mobile transactions list with per-currency stats.
 */
export async function listMobileTransactions(
  userId: string,
  query: MobileTransactionsQuery,
): Promise<TransactionsListResponse> {
  const sharedConditions: Prisma.TransactionWhereInput = {
    userId,
    isDemo: false,
    ...(query.accountId && { accountId: query.accountId }),
    ...(query.categoryId && { categoryId: query.categoryId }),
    ...((query.dateFrom || query.dateTo) && {
      date: {
        ...(query.dateFrom && { gte: new Date(query.dateFrom) }),
        ...(query.dateTo && { lte: new Date(query.dateTo) }),
      },
    }),
  };

  const listWhere: Prisma.TransactionWhereInput = {
    ...sharedConditions,
    ...(query.search && { description: { contains: query.search, mode: 'insensitive' } }),
    ...(query.type && { type: query.type }),
  };

  const statsWhere: Prisma.TransactionWhereInput = {
    ...sharedConditions,
    type: { in: ['INCOME', 'EXPENSE'] },
  };

  const skip = (query.page - 1) * query.pageSize;

  const [transactions, total, aggregates] = await Promise.all([
    prisma.transaction.findMany({
      where: listWhere,
      select: {
        id: true,
        amount: true,
        type: true,
        description: true,
        date: true,
        currency: true,
        accountId: true,
        transferToId: true,
        transferAmount: true,
        transferCurrency: true,
        account: { select: { name: true } },
        categoryId: true,
        category: { select: { name: true, color: true } },
        transferTo: { select: { name: true } },
      },
      orderBy: { date: 'desc' },
      skip,
      take: query.pageSize,
    }),
    prisma.transaction.count({ where: listWhere }),
    prisma.transaction.groupBy({
      by: ['type', 'currency'],
      where: statsWhere,
      _sum: { amount: true },
      _count: { id: true },
    }),
  ]);

  const statsByCurrency = new Map<string, { income: number; expenses: number; netFlow: number }>();

  for (const group of aggregates) {
    const currency = group.currency;
    if (!statsByCurrency.has(currency)) {
      statsByCurrency.set(currency, { income: 0, expenses: 0, netFlow: 0 });
    }

    const stats = statsByCurrency.get(currency);
    if (!stats) {
      continue;
    }

    const amount = Number(group._sum.amount ?? 0);
    if (!Number.isFinite(amount)) {
      continue;
    }

    if (group.type === 'INCOME') {
      stats.income += amount;
    }

    if (group.type === 'EXPENSE') {
      stats.expenses += amount;
    }

    stats.netFlow = stats.income - stats.expenses;
  }

  const stats = Array.from(statsByCurrency.entries()).map(([currency, data]) => ({
    currency,
    income: data.income,
    expenses: data.expenses,
    netFlow: data.netFlow,
  }));

  if (stats.length === 0) {
    stats.push({ currency: 'UAH', income: 0, expenses: 0, netFlow: 0 });
  }

  const transactionCount = aggregates.reduce((acc, group) => acc + (group._count.id ?? 0), 0);

  return {
    transactions: transactions.map(transaction => ({
      id: transaction.id,
      amount: transaction.amount,
      type: transaction.type,
      description: transaction.description,
      date: transaction.date.toISOString(),
      currency: transaction.currency,
      accountId: transaction.accountId,
      accountName: transaction.account.name,
      categoryId: transaction.categoryId,
      categoryName: transaction.category?.name ?? null,
      categoryColor: transaction.category?.color ?? null,
      transferToId: transaction.transferToId,
      transferToAccountName: transaction.transferTo?.name ?? null,
      transferAmount: transaction.transferAmount,
      transferCurrency: transaction.transferCurrency,
    })),
    stats,
    transactionCount,
    total,
    page: query.page,
    pageSize: query.pageSize,
    hasMore: skip + transactions.length < total,
  };
}
