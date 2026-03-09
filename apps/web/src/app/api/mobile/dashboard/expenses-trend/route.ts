import { convertToBaseCurrencySafe } from '@/lib/currency';
import { getMobileUser } from '@/lib/mobile-auth';
import { prisma } from '@/lib/prisma';
import { err, ok, type DashboardExpensesTrendResponse } from '@bit-chain/api-contracts';
import { NextRequest, NextResponse } from 'next/server';

interface DailyExpenseTotals {
  current: Map<number, number>;
  previous: Map<number, number>;
}

function toMonthLabel(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function startOfUtcMonth(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0, 0, 0, 0));
}

function startOfNextUtcMonth(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1, 0, 0, 0, 0));
}

function getUtcMonthDays(date: Date): number {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
}

function buildDailyExpenseTotals(
  transactions: ReadonlyArray<{ amountEUR: number; date: Date }>,
  now: Date,
): DailyExpenseTotals {
  const current = new Map<number, number>();
  const previous = new Map<number, number>();

  const currentYear = now.getUTCFullYear();
  const currentMonth = now.getUTCMonth();
  const previousMonthDate = new Date(Date.UTC(currentYear, currentMonth - 1, 1));
  const previousYear = previousMonthDate.getUTCFullYear();
  const previousMonth = previousMonthDate.getUTCMonth();

  for (const transaction of transactions) {
    const txDate = transaction.date;
    const day = txDate.getUTCDate();
    const amountEUR = Number.isFinite(transaction.amountEUR) ? transaction.amountEUR : 0;

    if (txDate.getUTCFullYear() === currentYear && txDate.getUTCMonth() === currentMonth) {
      current.set(day, (current.get(day) ?? 0) + amountEUR);
      continue;
    }

    if (txDate.getUTCFullYear() === previousYear && txDate.getUTCMonth() === previousMonth) {
      previous.set(day, (previous.get(day) ?? 0) + amountEUR);
    }
  }

  return { current, previous };
}

/**
 * GET /api/mobile/dashboard/expenses-trend
 *
 * Returns cumulative expense trend for:
 * - current month (solid line)
 * - previous month (reference dashed line)
 *
 * All values are normalized to EUR for stable cross-currency comparison.
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
    const now = new Date();
    const currentMonthStart = startOfUtcMonth(now);
    const previousMonthStart = startOfUtcMonth(
      new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)),
    );
    const currentMonthEndExclusive = startOfNextUtcMonth(now);

    const expenseTransactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        isDemo: false,
        type: 'EXPENSE',
        date: {
          gte: previousMonthStart,
          lt: currentMonthEndExclusive,
        },
      },
      select: {
        amount: true,
        currency: true,
        date: true,
      },
    });

    const transactionsInEUR = await Promise.all(
      expenseTransactions.map(async transaction => ({
        date: transaction.date,
        amountEUR: await convertToBaseCurrencySafe(transaction.amount, transaction.currency),
      })),
    );

    const daily = buildDailyExpenseTotals(transactionsInEUR, now);
    const currentMonthDays = getUtcMonthDays(currentMonthStart);
    const previousMonthDays = getUtcMonthDays(previousMonthStart);
    const comparedDays = Math.max(currentMonthDays, previousMonthDays);

    const points: DashboardExpensesTrendResponse['points'] = [];
    let currentCumulative = 0;
    let previousCumulative = 0;

    for (let day = 1; day <= comparedDays; day += 1) {
      currentCumulative += daily.current.get(day) ?? 0;
      previousCumulative += daily.previous.get(day) ?? 0;

      points.push({
        day,
        label: String(day),
        currentExpenseEUR: Math.round(currentCumulative * 100) / 100,
        previousExpenseEUR: Math.round(previousCumulative * 100) / 100,
      });
    }

    const response: DashboardExpensesTrendResponse = {
      points,
      currentMonthLabel: toMonthLabel(currentMonthStart),
      previousMonthLabel: toMonthLabel(previousMonthStart),
      comparedDays,
      generatedAt: now.toISOString(),
    };

    return NextResponse.json(ok(response), { status: 200 });
  } catch (error) {
    console.error('[mobile/dashboard/expenses-trend] Error:', error);
    return NextResponse.json(err('INTERNAL_ERROR', 'Failed to fetch expenses trend'), {
      status: 500,
    });
  }
}
