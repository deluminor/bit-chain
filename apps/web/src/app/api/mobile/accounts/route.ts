import { getMobileUser } from '@/lib/mobile-auth';
import { prisma } from '@/lib/prisma';
import { err, ok, type AccountsListResponse } from '@bit-chain/api-contracts';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/mobile/accounts
 *
 * Returns all active accounts for the authenticated mobile user.
 *
 * @returns 200 AccountsListResponse
 * @returns 401 UNAUTHORIZED if Bearer token is invalid or missing
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
    const accounts = await prisma.financeAccount.findMany({
      where: { userId: user.id, isActive: true, isDemo: false },
      select: {
        id: true,
        name: true,
        type: true,
        balance: true,
        currency: true,
        description: true,
        isActive: true,
        color: true,
        integrationAccounts: {
          select: { id: true },
          take: 1,
        },
        _count: {
          select: { transactions: true },
        },
      },
      orderBy: [{ createdAt: 'asc' }],
    });

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    const payload: AccountsListResponse = {
      accounts: accounts.map(acc => ({
        id: acc.id,
        name: acc.name,
        type: acc.type as AccountsListResponse['accounts'][number]['type'],
        balance: acc.balance,
        currency: acc.currency,
        description: acc.description,
        isActive: acc.isActive,
        color: acc.color,
        isMonobank: acc.integrationAccounts.length > 0,
        transactionCount: acc._count.transactions,
      })),
      totalBalance,
      totalAccounts: accounts.length,
      activeAccounts: accounts.length,
    };

    return NextResponse.json(ok(payload), { status: 200 });
  } catch (error) {
    console.error('[mobile/accounts] Error:', error);
    return NextResponse.json(err('INTERNAL_ERROR', 'Failed to fetch accounts'), { status: 500 });
  }
}
