import { prisma } from '@/lib/prisma';

export async function findOrCreateReportUser(email: string) {
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: { email, password: 'nextauth_user' },
    });
  }

  return user;
}

function buildDateFilter(dateFrom?: string, dateTo?: string) {
  if (!dateFrom && !dateTo) {
    return undefined;
  }

  const filter: { gte?: Date; lte?: Date } = {};
  if (dateFrom) {
    filter.gte = new Date(dateFrom);
  }
  if (dateTo) {
    filter.lte = new Date(dateTo);
  }

  return filter;
}

function buildBudgetDateFilter(dateFrom?: string, dateTo?: string) {
  if (!dateFrom && !dateTo) {
    return {};
  }

  const filter: Record<string, unknown> = {};
  if (dateTo) {
    filter.startDate = { lte: new Date(dateTo) };
  }
  if (dateFrom) {
    filter.endDate = { gte: new Date(dateFrom) };
  }

  return filter;
}

export async function fetchComprehensiveReportData(
  userId: string,
  dateFrom?: string,
  dateTo?: string,
) {
  const dateFilter = buildDateFilter(dateFrom, dateTo);
  const budgetDateFilter = buildBudgetDateFilter(dateFrom, dateTo);

  const [transactions, accounts, budgets, loans, goals] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        userId,
        isDemo: false,
        ...(dateFilter ? { date: dateFilter } : {}),
      },
      select: {
        id: true,
        type: true,
        amount: true,
        currency: true,
        description: true,
        date: true,
        tags: true,
        transferAmount: true,
        transferCurrency: true,
        account: { select: { id: true, name: true, type: true, currency: true } },
        category: {
          select: { id: true, name: true, type: true, parent: { select: { name: true } } },
        },
        transferTo: { select: { id: true, name: true, currency: true } },
      },
      orderBy: { date: 'asc' },
    }),
    prisma.financeAccount.findMany({
      where: { userId, isDemo: false },
      select: { id: true, name: true, type: true, currency: true, balance: true, isActive: true },
    }),
    prisma.budget.findMany({
      where: { userId, isDemo: false, isTemplate: false, ...budgetDateFilter },
      include: { categories: { include: { category: { select: { name: true, type: true } } } } },
    }),
    prisma.loan.findMany({ where: { userId } }),
    prisma.financialGoal.findMany({ where: { userId, isDemo: false } }),
  ]);

  return { transactions, accounts, budgets, loans, goals };
}

export type ComprehensiveReportRawData = Awaited<ReturnType<typeof fetchComprehensiveReportData>>;
