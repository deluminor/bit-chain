import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@/generated/prisma';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const createAccountSchema = z.object({
  name: z.string().min(1, 'Account name is required').max(50, 'Account name too long'),
  type: z.enum(['CASH', 'BANK_CARD', 'SAVINGS', 'INVESTMENT']),
  currency: z.string().min(3, 'Currency code required').max(3, 'Invalid currency code'),
  balance: z.number().default(0),
  color: z.string().optional(),
  icon: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

const updateAccountSchema = createAccountSchema.partial().extend({
  id: z.string().cuid(),
});

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

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const accounts = await prisma.financeAccount.findMany({
      where: {
        userId: user.id,
        ...(includeInactive ? {} : { isActive: true }),
      },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
      orderBy: [{ isActive: 'desc' }, { createdAt: 'asc' }],
    });

    return NextResponse.json({
      accounts,
      summary: {
        total: accounts.length,
        active: accounts.filter(acc => acc.isActive).length,
        inactive: accounts.filter(acc => !acc.isActive).length,
        totalBalance: accounts
          .filter(acc => acc.isActive)
          .reduce((sum, acc) => sum + acc.balance, 0),
      },
    });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createAccountSchema.parse(body);

    // Check if account name already exists for this user
    const existingAccount = await prisma.financeAccount.findFirst({
      where: {
        userId: user.id,
        name: validatedData.name,
      },
    });

    if (existingAccount) {
      return NextResponse.json({ error: 'Account with this name already exists' }, { status: 400 });
    }

    const account = await prisma.financeAccount.create({
      data: {
        ...validatedData,
        userId: user.id,
      },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        account,
        message: 'Account created successfully',
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 },
      );
    }

    console.error('Error creating account:', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateAccountSchema.parse(body);
    const { id, ...updateData } = validatedData;

    // Check if account exists and belongs to user
    const existingAccount = await prisma.financeAccount.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingAccount) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // Check if name is being changed and if new name already exists
    if (updateData.name && updateData.name !== existingAccount.name) {
      const nameExists = await prisma.financeAccount.findFirst({
        where: {
          userId: user.id,
          name: updateData.name,
        },
      });

      if (nameExists) {
        return NextResponse.json(
          { error: 'Account with this name already exists' },
          { status: 400 },
        );
      }
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
      message: 'Account updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 },
      );
    }

    console.error('Error updating account:', error);
    return NextResponse.json({ error: 'Failed to update account' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('id');
    const force = searchParams.get('force') === 'true';

    if (!accountId) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }

    // Check if account exists and belongs to user
    const account = await prisma.financeAccount.findFirst({
      where: {
        id: accountId,
        userId: user.id,
      },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // Check if account has transactions
    if (account._count.transactions > 0 && !force) {
      return NextResponse.json(
        {
          error: 'Cannot delete account with transactions',
          hasTransactions: true,
          transactionCount: account._count.transactions,
          message: 'Use force=true to delete anyway or deactivate the account instead',
        },
        { status: 400 },
      );
    }

    if (force && account._count.transactions > 0) {
      // Delete account and all associated transactions
      await prisma.$transaction([
        prisma.transaction.deleteMany({
          where: { accountId },
        }),
        prisma.financeAccount.delete({
          where: { id: accountId },
        }),
      ]);
    } else {
      // Just delete the account
      await prisma.financeAccount.delete({
        where: { id: accountId },
      });
    }

    return NextResponse.json({
      message: 'Account deleted successfully',
      deletedTransactions: force ? account._count.transactions : 0,
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
