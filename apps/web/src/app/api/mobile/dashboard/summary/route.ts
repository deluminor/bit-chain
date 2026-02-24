import { getMobileUser } from '@/lib/mobile-auth';
import { prisma } from '@/lib/prisma';
import { err, ok, type DashboardSummary } from '@bit-chain/api-contracts';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/mobile/dashboard/summary
 *
 * Aggregated dashboard endpoint that replaces ≥10 separate web requests
 * with a single optimized call for the mobile client.
 *
 * Returns:
 * - Balance totals grouped by currency
 * - Total active account count
 * - Last 5 transactions across all accounts
 * - Monobank integration quick status
 * - Period stats for the requested date range (defaults to current month)
 *
 * @query dateFrom - ISO datetime lower bound for period stats (optional)
 * @query dateTo   - ISO datetime upper bound for period stats (optional)
 *
 * @returns 200 DashboardSummary
 * @returns 401 UNAUTHORIZED if access token is invalid
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  let user: { id: string; email: string };

  try {
    user = await getMobileUser(request);
  } catch {
    return NextResponse.json(err('UNAUTHORIZED', 'Invalid or missing access token'), {
      status: 401,
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const dateFromParam = searchParams.get('dateFrom');
    const dateToParam = searchParams.get('dateTo');

    // Resolve period date filter:
    // - If caller provides dateFrom/dateTo → use them as-is.
    // - If only partially provided → use what's given.
    // - If nothing provided → fall back to current-month start (legacy behaviour).
    let periodDateFilter: { gte?: Date; lte?: Date };

    if (dateFromParam || dateToParam) {
      periodDateFilter = {
        ...(dateFromParam && { gte: new Date(dateFromParam) }),
        ...(dateToParam && { lte: new Date(dateToParam) }),
      };
    } else {
      // Default: current calendar month
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      periodDateFilter = { gte: monthStart };
    }

    // Parallel fetch: accounts + recent transactions + monobank status + period stats
    const [accounts, recentTransactions, monobank, periodAggregates] = await Promise.all([
      prisma.financeAccount.findMany({
        where: { userId: user.id, isActive: true, isDemo: false },
        select: { currency: true, balance: true },
      }),

      prisma.transaction.findMany({
        where: { userId: user.id, isDemo: false },
        orderBy: { date: 'desc' },
        take: 5,
        select: {
          id: true,
          amount: true,
          type: true,
          description: true,
          date: true,
          currency: true,
          account: { select: { name: true } },
          category: { select: { name: true } },
        },
      }),

      prisma.integration.findUnique({
        where: { userId_provider: { userId: user.id, provider: 'MONOBANK' } },
        select: {
          status: true,
          lastSyncedAt: true,
          accounts: {
            where: { importEnabled: true },
            select: { id: true },
          },
        },
      }),

      // Period income/expense aggregation (respects dateFrom/dateTo).
      // Grouped by type + currency to avoid summing different currencies together.
      prisma.transaction.groupBy({
        by: ['type', 'currency'],
        where: {
          userId: user.id,
          isDemo: false,
          type: { in: ['INCOME', 'EXPENSE'] },
          date: periodDateFilter,
        },
        _sum: { amount: true },
      }),
    ]);

    // Aggregate balances by currency
    const balanceMap = new Map<string, number>();
    const countMap = new Map<string, number>();

    for (const account of accounts) {
      balanceMap.set(account.currency, (balanceMap.get(account.currency) ?? 0) + account.balance);
      countMap.set(account.currency, (countMap.get(account.currency) ?? 0) + 1);
    }

    const balances = Array.from(balanceMap.entries()).map(([currency, totalBalance]) => ({
      currency,
      totalBalance,
      accountCount: countMap.get(currency) ?? 0,
    }));

    // Build period stats from aggregation. Group by currency.
    const statsByCurrency = new Map<
      string,
      { income: number; expenses: number; netFlow: number }
    >();

    for (const g of periodAggregates) {
      const currency = g.currency;
      if (!statsByCurrency.has(currency)) {
        statsByCurrency.set(currency, { income: 0, expenses: 0, netFlow: 0 });
      }

      const stats = statsByCurrency.get(currency)!;
      const amount = g._sum.amount ?? 0;

      if (g.type === 'INCOME') stats.income += amount;
      if (g.type === 'EXPENSE') stats.expenses += amount;
      stats.netFlow = stats.income - stats.expenses;
    }

    const periodStats = Array.from(statsByCurrency.entries()).map(([currency, data]) => ({
      currency,
      income: data.income,
      expenses: data.expenses,
      netFlow: data.netFlow,
    }));

    // Fallback to UAH if there are no stats (e.g. empty period)
    if (periodStats.length === 0) {
      periodStats.push({ currency: 'UAH', income: 0, expenses: 0, netFlow: 0 });
    }

    const summary: DashboardSummary = {
      balances,
      totalAccounts: accounts.length,
      recentTransactions: recentTransactions.map(tx => ({
        id: tx.id,
        amount: tx.amount,
        type: tx.type,
        description: tx.description,
        date: tx.date.toISOString(),
        currency: tx.currency,
        accountName: tx.account.name,
        categoryName: tx.category?.name ?? null,
      })),
      monobank: {
        connected: monobank?.status === 'CONNECTED',
        lastSyncAt: monobank?.lastSyncedAt?.toISOString() ?? null,
        enabledAccountCount: monobank?.accounts.length ?? 0,
      },
      periodStats,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(ok(summary), { status: 200 });
  } catch (error) {
    console.error('[mobile/dashboard/summary] Error:', error);
    return NextResponse.json(err('INTERNAL_ERROR', 'Failed to fetch dashboard data'), {
      status: 500,
    });
  }
}
