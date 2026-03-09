import { BASE_CURRENCY, convertToBaseCurrencySafe } from '@/lib/currency';
import { getMobileUser } from '@/lib/mobile-auth';
import { prisma } from '@/lib/prisma';
import { err, ok, type ReportResponse } from '@bit-chain/api-contracts';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/mobile/reports?dateFrom=&dateTo=
 *
 * Generates a financial report for the given period:
 * - Summary stats (income, expenses, net flow)
 * - Breakdown by category
 * - Top 10 transactions by amount
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

    // Default to current month if no dates provided
    const now = new Date();
    const defaultFrom = new Date(now.getFullYear(), now.getMonth(), 1);
    const defaultTo = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const dateFrom = searchParams.get('dateFrom')
      ? new Date(searchParams.get('dateFrom')!)
      : defaultFrom;
    const dateTo = searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')!) : defaultTo;

    const whereBase = {
      userId: user.id,
      isDemo: false,
      date: { gte: dateFrom, lte: dateTo },
      type: { in: ['INCOME', 'EXPENSE'] as ('INCOME' | 'EXPENSE')[] },
    };

    // Fetch all transactions in range with category info
    const rawTransactions = await prisma.transaction.findMany({
      where: whereBase,
      include: {
        category: { select: { name: true, color: true } },
        account: { select: { name: true } },
      },
      orderBy: { amount: 'desc' },
    });

    // Convert each transaction amount to base currency (EUR) for consistent aggregation
    const transactions = await Promise.all(
      rawTransactions.map(async tx => ({
        ...tx,
        amountBase: await convertToBaseCurrencySafe(tx.amount, tx.currency),
      })),
    );

    // Summary totals — all values in BASE_CURRENCY
    const totalIncome = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amountBase, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amountBase, 0);

    // Category breakdown (amounts in BASE_CURRENCY)
    const categoryMap = new Map<
      string,
      { name: string; type: string; total: number; count: number; color: string | null }
    >();

    for (const tx of transactions) {
      const catName = tx.category?.name ?? 'Uncategorized';
      const key = `${catName}:${tx.type}`;
      const existing = categoryMap.get(key);
      if (existing) {
        existing.total += tx.amountBase;
        existing.count += 1;
      } else {
        categoryMap.set(key, {
          name: catName,
          type: tx.type,
          total: tx.amountBase,
          count: 1,
          color: tx.category?.color ?? null,
        });
      }
    }

    const baseTotals = { INCOME: totalIncome, EXPENSE: totalExpenses };
    const byCategory = Array.from(categoryMap.values())
      .map(item => ({
        name: item.name,
        type: item.type as 'INCOME' | 'EXPENSE',
        total: Math.round(item.total * 100) / 100,
        count: item.count,
        percentage:
          baseTotals[item.type as 'INCOME' | 'EXPENSE'] > 0
            ? (item.total / baseTotals[item.type as 'INCOME' | 'EXPENSE']) * 100
            : 0,
        color: item.color,
      }))
      .sort((a, b) => b.total - a.total);

    // Top 10 transactions by converted amount (includes both native + base amounts)
    const topTransactions = transactions.slice(0, 10).map(tx => ({
      id: tx.id,
      date: tx.date.toISOString(),
      amount: tx.amount,
      currency: tx.currency,
      amountBase: Math.round(tx.amountBase * 100) / 100,
      type: tx.type as 'INCOME' | 'EXPENSE' | 'TRANSFER',
      description: tx.description,
      categoryName: tx.category?.name ?? null,
      accountName: tx.account.name,
    }));

    const payload: ReportResponse = {
      dateFrom: dateFrom.toISOString(),
      dateTo: dateTo.toISOString(),
      baseCurrency: BASE_CURRENCY,
      totalIncome: Math.round(totalIncome * 100) / 100,
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      netFlow: Math.round((totalIncome - totalExpenses) * 100) / 100,
      transactionCount: transactions.length,
      byCategory,
      topTransactions,
    };

    return NextResponse.json(ok(payload), { status: 200 });
  } catch (error) {
    console.error('[mobile/reports] GET error:', error);
    return NextResponse.json(err('INTERNAL_ERROR', 'Failed to generate report'), { status: 500 });
  }
}
