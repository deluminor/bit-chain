import { authOptions } from '@/features/auth/libs/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

async function getUserFromSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return null;
  }

  return await prisma.user.findUnique({
    where: { email: session.user.email },
  });
}

export async function GET(_request: NextRequest) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all accounts with aggregated data
    const accounts = await prisma.financeAccount.findMany({
      where: {
        userId: user.id,
        isActive: true,
      },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    // Calculate statistics by account type
    const statsByType = await prisma.financeAccount.groupBy({
      by: ['type'],
      where: {
        userId: user.id,
        isActive: true,
      },
      _count: {
        id: true,
      },
      _sum: {
        balance: true,
      },
      _avg: {
        balance: true,
      },
    });

    // Calculate statistics by currency
    const statsByCurrency = await prisma.financeAccount.groupBy({
      by: ['currency'],
      where: {
        userId: user.id,
        isActive: true,
      },
      _count: {
        id: true,
      },
      _sum: {
        balance: true,
      },
    });

    // Get recent account activity (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentTransactions = await prisma.transaction.count({
      where: {
        userId: user.id,
        date: {
          gte: thirtyDaysAgo,
        },
      },
    });

    // Calculate total balances by currency
    const totalBalances = statsByCurrency.reduce(
      (acc, stat) => {
        acc[stat.currency] = stat._sum.balance || 0;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Get accounts with highest/lowest balances
    const sortedAccounts = [...accounts].sort((a, b) => b.balance - a.balance);
    const highestBalance = sortedAccounts[0] || null;
    const lowestBalance = sortedAccounts[sortedAccounts.length - 1] || null;

    const stats = {
      overview: {
        totalAccounts: accounts.length,
        activeAccounts: accounts.filter(acc => acc.isActive).length,
        totalBalances,
        recentTransactions30Days: recentTransactions,
      },
      byAccountType: statsByType.map(stat => ({
        type: stat.type,
        count: stat._count.id,
        totalBalance: stat._sum.balance || 0,
        averageBalance: stat._avg.balance || 0,
      })),
      byCurrency: statsByCurrency.map(stat => ({
        currency: stat.currency,
        accountCount: stat._count.id,
        totalBalance: stat._sum.balance || 0,
      })),
      highlights: {
        highestBalance: highestBalance
          ? {
              id: highestBalance.id,
              name: highestBalance.name,
              balance: highestBalance.balance,
              currency: highestBalance.currency,
            }
          : null,
        lowestBalance: lowestBalance
          ? {
              id: lowestBalance.id,
              name: lowestBalance.name,
              balance: lowestBalance.balance,
              currency: lowestBalance.currency,
            }
          : null,
        mostActiveAccount:
          accounts.length > 0
            ? accounts.reduce((prev, current) =>
                prev._count.transactions > current._count.transactions ? prev : current,
              )
            : null,
      },
      distribution: {
        accountTypes: statsByType.reduce(
          (acc, stat) => {
            acc[stat.type] = stat._count.id;
            return acc;
          },
          {} as Record<string, number>,
        ),
        currencies: statsByCurrency.reduce(
          (acc, stat) => {
            acc[stat.currency] = stat._count.id;
            return acc;
          },
          {} as Record<string, number>,
        ),
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching account statistics:', error);
    return NextResponse.json({ error: 'Failed to fetch account statistics' }, { status: 500 });
  }
}
