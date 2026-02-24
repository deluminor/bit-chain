import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// Helper function to get user from session
async function getUserFromSession() {
  const session = await getServerSession();
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
    const limit = parseInt(searchParams.get('limit') || '10');

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
    const body = await request.json();
    const { action, amount } = body;

    if (!action || !['activate', 'deactivate', 'adjustBalance'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be activate, deactivate, or adjustBalance' },
        { status: 400 },
      );
    }

    // Check if account exists and belongs to user
    const account = await prisma.financeAccount.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    let updateData: any = {};
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
        if (typeof amount !== 'number') {
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
