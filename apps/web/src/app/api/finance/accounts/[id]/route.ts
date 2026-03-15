import { authOptions } from '@/features/auth/libs/auth';
import type { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const MAX_TRANSACTIONS_LIMIT = 100;

const AccountPatchSchema = z.object({
  action: z.enum(['activate', 'deactivate', 'adjustBalance']),
  amount: z.number().optional(),
});

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

async function getUserFromSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return null;
  }

  return await prisma.user.findUnique({
    where: { email: session.user.email },
  });
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const includeTransactions = searchParams.get('includeTransactions') === 'true';
    const rawLimit = parseInt(searchParams.get('limit') ?? '10', 10);
    const limit = Math.min(
      Math.max(1, Number.isNaN(rawLimit) ? 10 : rawLimit),
      MAX_TRANSACTIONS_LIMIT,
    );

    const account = await prisma.financeAccount.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
        ...(includeTransactions && {
          transactions: {
            take: limit,
            orderBy: { date: 'desc' },
            include: {
              category: {
                select: {
                  name: true,
                  color: true,
                  icon: true,
                },
              },
            },
          },
        }),
      },
    });

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    return NextResponse.json({ account });
  } catch (error) {
    console.error('Error fetching account:', error);
    return NextResponse.json({ error: 'Failed to fetch account' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const parsed = AccountPatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid request body' },
        { status: 400 },
      );
    }

    const { action, amount } = parsed.data;

    const account = await prisma.financeAccount.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    let updateData: Prisma.FinanceAccountUpdateInput = {};
    let message = '';

    switch (action) {
      case 'activate':
        updateData = { isActive: true };
        message = 'Account activated successfully';
        break;

      case 'deactivate':
        updateData = { isActive: false };
        message = 'Account deactivated successfully';
        break;

      case 'adjustBalance':
        if (amount === undefined || typeof amount !== 'number') {
          return NextResponse.json(
            { error: 'Amount is required for balance adjustment' },
            { status: 400 },
          );
        }
        updateData = { balance: account.balance + amount };
        message = `Balance ${amount >= 0 ? 'increased' : 'decreased'} by ${Math.abs(amount)} ${account.currency}`;
        break;
    }

    const updatedAccount = await prisma.financeAccount.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    return NextResponse.json({
      account: updatedAccount,
      message,
    });
  } catch (error) {
    console.error('Error updating account:', error);
    return NextResponse.json({ error: 'Failed to update account' }, { status: 500 });
  }
}
