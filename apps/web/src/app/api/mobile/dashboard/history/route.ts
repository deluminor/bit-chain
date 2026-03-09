import {
  scopeBreakpointsToPeriod,
  totalInEURFromAccounts,
  type BalanceBreakpoint,
} from '@/features/finance/services/dashboard/dashboard-history.helpers';
import { getMobileUser } from '@/lib/mobile-auth';
import { prisma } from '@/lib/prisma';
import { err, ok, type DashboardHistoryResponse } from '@bit-chain/api-contracts';
import { NextRequest, NextResponse } from 'next/server';

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

    const isPeriodMode = Boolean(dateFromParam && dateToParam);
    const periodFrom = dateFromParam ? new Date(dateFromParam) : null;
    const periodTo = dateToParam ? new Date(dateToParam) : null;

    const accounts = await prisma.financeAccount.findMany({
      where: { userId: user.id, isActive: true, isDemo: false },
      select: { id: true, currency: true, balance: true },
    });

    // accountId → current balance (ground truth for the backwards walk)
    const currentBalances: Record<string, number> = {};
    // accountId → currency (needed to convert running totals to EUR)
    const accountCurrency: Record<string, string> = {};

    for (const acc of accounts) {
      currentBalances[acc.id] = acc.balance;
      accountCurrency[acc.id] = acc.currency;
    }

    const trackedIds = accounts.map(a => a.id);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        isDemo: false,
        accountId: { in: trackedIds },
      },
      orderBy: { date: 'desc' },
      select: {
        id: true,
        type: true,
        amount: true,
        date: true,
        accountId: true,
        transferToId: true,
        transferAmount: true,
      },
    });

    // ── 3. Build transaction-day breakpoints ─────────────────────────────────
    const now = new Date();

    const rawBreakpoints: BalanceBreakpoint[] = [
      { date: now.toISOString(), balances: { ...currentBalances } },
    ];

    if (transactions.length > 0) {
      // Group by calendar date (YYYY-MM-DD)
      const txByDate = new Map<string, typeof transactions>();
      for (const tx of transactions) {
        const dStr = tx.date.toISOString().split('T')[0] as string;
        if (!txByDate.has(dStr)) txByDate.set(dStr, []);
        txByDate.get(dStr)!.push(tx);
      }

      const sortedDates = [...txByDate.keys()].sort().reverse();

      // Running per-account balances (start from today, walk backwards)
      const running = { ...currentBalances };

      for (const dStr of sortedDates) {
        const dayTxs = txByDate.get(dStr)!;
        const snapshotAfterDayActivity = { ...running };
        const dayLatestTimestampMs = dayTxs.reduce((latest, tx) => {
          const ms = tx.date.getTime();
          return ms > latest ? ms : latest;
        }, Number.NEGATIVE_INFINITY);

        const dayAmountGroups = new Map<number, typeof dayTxs>();
        for (const tx of dayTxs) {
          if (!dayAmountGroups.has(tx.amount)) dayAmountGroups.set(tx.amount, []);
          dayAmountGroups.get(tx.amount)!.push(tx);
        }

        const skipDuplicateIds = new Set<string>();

        for (const [_amount, txs] of dayAmountGroups.entries()) {
          if (txs.length > 1) {
            const resolvedTransfers = txs.filter(
              t => t.type === 'TRANSFER' && t.transferToId && accountCurrency[t.transferToId],
            );
            const partialTransfers = txs.filter(
              t => t.type === 'TRANSFER' && (!t.transferToId || !accountCurrency[t.transferToId]),
            );
            if (resolvedTransfers.length > 0) {
              const mainTx = resolvedTransfers[0]!;

              for (const t of txs) {
                if (t.id === mainTx.id) continue;
                // If it involves the same accounts, skip it
                if (t.accountId === mainTx.accountId || t.accountId === mainTx.transferToId) {
                  skipDuplicateIds.add(t.id);
                }
              }
            } else if (partialTransfers.length > 1) {
              for (let i = 1; i < partialTransfers.length; i++) {
                skipDuplicateIds.add(partialTransfers[i]!.id);
              }
            }
          }
        }

        for (const tx of dayTxs) {
          if (skipDuplicateIds.has(tx.id)) continue;

          if (tx.type === 'INCOME') {
            running[tx.accountId] = (running[tx.accountId] ?? 0) - tx.amount;
          } else if (tx.type === 'EXPENSE') {
            running[tx.accountId] = (running[tx.accountId] ?? 0) + tx.amount;

            if (tx.transferToId && accountCurrency[tx.transferToId] !== undefined) {
              const destAmount = tx.transferAmount ?? tx.amount;
              running[tx.transferToId] = (running[tx.transferToId] ?? 0) - destAmount;
            }
          } else if (tx.type === 'TRANSFER') {
            running[tx.accountId] = (running[tx.accountId] ?? 0) + tx.amount;

            if (tx.transferToId && accountCurrency[tx.transferToId] !== undefined) {
              const destAmount = tx.transferAmount ?? tx.amount;
              running[tx.transferToId] = (running[tx.transferToId] ?? 0) - destAmount;
            }
          }
        }

        rawBreakpoints.push({
          date: new Date(dayLatestTimestampMs).toISOString(),
          balances: snapshotAfterDayActivity,
        });
      }

      const oldestTx = transactions[transactions.length - 1];
      if (oldestTx) {
        const beforeFirstTxMs = Math.max(oldestTx.date.getTime() - 1, 0);
        rawBreakpoints.push({
          date: new Date(beforeFirstTxMs).toISOString(),
          balances: { ...running },
        });
      }
    }

    rawBreakpoints.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const dedupedBreakpoints = rawBreakpoints.filter((point, index, all) => {
      if (index === 0) return true;
      return point.date !== all[index - 1]!.date;
    });

    const scopedBreakpoints =
      isPeriodMode && periodFrom && periodTo
        ? scopeBreakpointsToPeriod(dedupedBreakpoints, periodFrom, periodTo)
        : dedupedBreakpoints;

    const history = await Promise.all(
      scopedBreakpoints.map(async point => ({
        ...point,
        totalEUR: await totalInEURFromAccounts(point.balances, accountCurrency),
      })),
    );

    const response: DashboardHistoryResponse = {
      history,
      generatedAt: now.toISOString(),
    };

    return NextResponse.json(ok(response), { status: 200 });
  } catch (error) {
    console.error('[mobile/dashboard/history] Error:', error);
    return NextResponse.json(err('INTERNAL_ERROR', 'Failed to fetch dashboard history'), {
      status: 500,
    });
  }
}
