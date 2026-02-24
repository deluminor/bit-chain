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
    const accounts = await prisma.financeAccount.findMany({
      where: { userId: user.id, isActive: true, isDemo: false },
      select: { currency: true, balance: true },
    });

    const currentBalances: Record<string, number> = {};
    for (const acc of accounts) {
      currentBalances[acc.currency] = (currentBalances[acc.currency] || 0) + acc.balance;
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id, isDemo: false },
      orderBy: { date: 'desc' },
      select: {
        id: true,
        type: true,
        amount: true,
        currency: true,
        date: true,
        transferToId: true,
        transferAmount: true,
        transferCurrency: true,
      },
    });

    const runningBalances = { ...currentBalances };
    const history: Array<{ date: string; balances: Record<string, number> }> = [];

    // Push today's balance (end of today)
    // We use end of current day to represent "now"
    const now = new Date();
    history.push({
      date: now.toISOString(),
      balances: { ...runningBalances },
    });

    if (transactions.length > 0) {
      // Group transactions by YYYY-MM-DD
      const txByDate = new Map<string, typeof transactions>();
      for (const tx of transactions) {
        const dStr = tx.date.toISOString().split('T')[0] as string;
        if (!txByDate.has(dStr)) txByDate.set(dStr, []);
        txByDate.get(dStr)!.push(tx);
      }

      const earliestDate = transactions[transactions.length - 1]!.date;

      // We will loop backwards from today until the earliest transaction day
      const currDate = new Date();
      currDate.setHours(0, 0, 0, 0); // start of today

      const earliestDay = new Date(earliestDate);
      earliestDay.setHours(0, 0, 0, 0);

      while (currDate >= earliestDay) {
        const dStr = currDate.toISOString().split('T')[0] as string;

        // Reverse effects of today's transactions to find YESTERDAY'S end-of-day balance
        const dayTxs = txByDate.get(dStr) || [];
        for (const tx of dayTxs) {
          if (tx.type === 'INCOME') {
            runningBalances[tx.currency] = (runningBalances[tx.currency] || 0) - tx.amount;
          } else if (tx.type === 'EXPENSE') {
            runningBalances[tx.currency] = (runningBalances[tx.currency] || 0) + tx.amount;
          } else if (tx.type === 'TRANSFER') {
            runningBalances[tx.currency] = (runningBalances[tx.currency] || 0) + tx.amount;
            if (tx.transferToId) {
              const destCurrency = tx.transferCurrency || tx.currency;
              const destAmount = tx.transferAmount || tx.amount;
              runningBalances[destCurrency] = (runningBalances[destCurrency] || 0) - destAmount;
            }
          }
        }

        const prevDate = new Date(currDate);
        prevDate.setDate(prevDate.getDate() - 1);
        prevDate.setHours(23, 59, 59, 999); // end of previous day

        history.push({
          date: prevDate.toISOString(),
          balances: { ...runningBalances },
        });

        currDate.setDate(currDate.getDate() - 1);
      }
    }

    // Reverse to ascending order starting from 0 (earliest) to current
    history.reverse();

    const response: DashboardHistoryResponse = {
      history,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(ok(response), { status: 200 });
  } catch (error) {
    console.error('[mobile/dashboard/history] Error:', error);
    return NextResponse.json(err('INTERNAL_ERROR', 'Failed to fetch dashboard history'), {
      status: 500,
    });
  }
}
