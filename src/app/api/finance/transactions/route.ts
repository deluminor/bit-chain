import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@/generated/prisma';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const createTransactionSchema = z.object({
  accountId: z.string().cuid('Invalid account ID'),
  categoryId: z.string().cuid('Invalid category ID'),
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().min(3).max(3).default('UAH'),
  description: z.string().max(200).optional(),
  date: z
    .string()
    .datetime()
    .transform(str => new Date(str))
    .optional(),
  tags: z.array(z.string()).default([]),
  transferToId: z.string().cuid().optional(), // For transfer transactions
  transferAmount: z.number().positive().optional(), // Amount received in destination account
  transferCurrency: z.string().min(3).max(3).optional(), // Currency of destination account
  isRecurring: z.boolean().default(false),
  recurringPattern: z
    .enum(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'])
    .optional()
    .nullable(),
});

const updateTransactionSchema = createTransactionSchema.partial().extend({
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

// Helper function to update account balances
async function _updateAccountBalance(
  accountId: string,
  amount: number,
  operation: 'add' | 'subtract',
) {
  const change = operation === 'add' ? amount : -amount;

  await prisma.financeAccount.update({
    where: { id: accountId },
    data: {
      balance: {
        increment: change,
      },
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type') as 'INCOME' | 'EXPENSE' | 'TRANSFER' | null;
    const accountId = searchParams.get('accountId');
    const categoryId = searchParams.get('categoryId');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'date';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      userId: user.id,
      ...(type && { type }),
      ...(accountId && { accountId }),
      ...(categoryId && { categoryId }),
      ...((dateFrom || dateTo) && {
        date: {
          ...(dateFrom && { gte: new Date(dateFrom) }),
          ...(dateTo && { lte: new Date(dateTo) }),
        },
      }),
      ...(search && {
        OR: [
          { description: { contains: search, mode: 'insensitive' } },
          { tags: { hasSome: [search] } },
        ],
      }),
    };

    // Get transactions with pagination
    const [transactions, totalCount] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          account: {
            select: {
              id: true,
              name: true,
              type: true,
              currency: true,
              color: true,
              icon: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              color: true,
              icon: true,
              type: true,
            },
          },
          transferTo: {
            select: {
              id: true,
              name: true,
              type: true,
              currency: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    // Calculate summary statistics
    const summaryStats = await prisma.transaction.groupBy({
      by: ['type'],
      where: {
        userId: user.id,
        ...((dateFrom || dateTo) && {
          date: {
            ...(dateFrom && { gte: new Date(dateFrom) }),
            ...(dateTo && { lte: new Date(dateTo) }),
          },
        }),
      },
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    });

    const summary = {
      income: summaryStats.find(s => s.type === 'INCOME')?._sum.amount || 0,
      expenses: summaryStats.find(s => s.type === 'EXPENSE')?._sum.amount || 0,
      transfers: summaryStats.find(s => s.type === 'TRANSFER')?._sum.amount || 0,
      totalTransactions: totalCount,
      incomeCount: summaryStats.find(s => s.type === 'INCOME')?._count.id || 0,
      expenseCount: summaryStats.find(s => s.type === 'EXPENSE')?._count.id || 0,
      transferCount: summaryStats.find(s => s.type === 'TRANSFER')?._count.id || 0,
    };

    const pagination = {
      page,
      limit,
      total: totalCount,
      pages: Math.ceil(totalCount / limit),
    };

    return NextResponse.json({
      transactions,
      summary,
      pagination,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createTransactionSchema.parse(body);

    // Verify account belongs to user
    const account = await prisma.financeAccount.findFirst({
      where: {
        id: validatedData.accountId,
        userId: user.id,
        isActive: true,
      },
    });

    if (!account) {
      return NextResponse.json({ error: 'Account not found or inactive' }, { status: 400 });
    }

    // Verify category belongs to user and matches transaction type
    const category = await prisma.transactionCategory.findFirst({
      where: {
        id: validatedData.categoryId,
        userId: user.id,
        type: validatedData.type, // Now TRANSFER type is supported
        isActive: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found, inactive, or type mismatch' },
        { status: 400 },
      );
    }

    // For transfer transactions, verify transfer account
    let transferToAccount = null;
    if (validatedData.type === 'TRANSFER' && validatedData.transferToId) {
      transferToAccount = await prisma.financeAccount.findFirst({
        where: {
          id: validatedData.transferToId,
          userId: user.id,
          isActive: true,
        },
      });

      if (!transferToAccount) {
        return NextResponse.json(
          { error: 'Transfer destination account not found or inactive' },
          { status: 400 },
        );
      }

      if (validatedData.transferToId === validatedData.accountId) {
        return NextResponse.json({ error: 'Cannot transfer to the same account' }, { status: 400 });
      }
    }

    // Create transaction and update balances in a database transaction
    const result = await prisma.$transaction(async tx => {
      // Create the transaction
      const transaction = await tx.transaction.create({
        data: {
          ...validatedData,
          userId: user.id,
          date: validatedData.date || new Date(),
        },
        include: {
          account: {
            select: {
              id: true,
              name: true,
              type: true,
              currency: true,
              color: true,
              icon: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              color: true,
              icon: true,
              type: true,
            },
          },
          transferTo: {
            select: {
              id: true,
              name: true,
              type: true,
              currency: true,
            },
          },
        },
      });

      // Update account balances based on transaction type
      switch (validatedData.type) {
        case 'INCOME':
          await tx.financeAccount.update({
            where: { id: validatedData.accountId },
            data: { balance: { increment: validatedData.amount } },
          });
          break;

        case 'EXPENSE':
          await tx.financeAccount.update({
            where: { id: validatedData.accountId },
            data: { balance: { decrement: validatedData.amount } },
          });
          break;

        case 'TRANSFER':
          if (validatedData.transferToId) {
            // Subtract from source account
            await tx.financeAccount.update({
              where: { id: validatedData.accountId },
              data: { balance: { decrement: validatedData.amount } },
            });

            // Add to destination account (use transferAmount for multi-currency transfers)
            const amountToAdd = validatedData.transferAmount || validatedData.amount;
            await tx.financeAccount.update({
              where: { id: validatedData.transferToId },
              data: { balance: { increment: amountToAdd } },
            });
          }
          break;
      }

      return transaction;
    });

    return NextResponse.json(
      {
        transaction: result,
        message: 'Transaction created successfully',
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

    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateTransactionSchema.parse(body);
    const { id, ...updateData } = validatedData;

    // Get existing transaction
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingTransaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Update transaction and balances in a database transaction
    const result = await prisma.$transaction(async tx => {
      // First, reverse the original transaction's balance effects
      switch (existingTransaction.type) {
        case 'INCOME':
          await tx.financeAccount.update({
            where: { id: existingTransaction.accountId },
            data: { balance: { decrement: existingTransaction.amount } },
          });
          break;
        case 'EXPENSE':
          await tx.financeAccount.update({
            where: { id: existingTransaction.accountId },
            data: { balance: { increment: existingTransaction.amount } },
          });
          break;
        case 'TRANSFER':
          if (existingTransaction.transferToId) {
            await tx.financeAccount.update({
              where: { id: existingTransaction.accountId },
              data: { balance: { increment: existingTransaction.amount } },
            });
            await tx.financeAccount.update({
              where: { id: existingTransaction.transferToId },
              data: { balance: { decrement: existingTransaction.amount } },
            });
          }
          break;
      }

      // Update the transaction
      const updatedTransaction = await tx.transaction.update({
        where: { id },
        data: updateData,
        include: {
          account: {
            select: {
              id: true,
              name: true,
              type: true,
              currency: true,
              color: true,
              icon: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              color: true,
              icon: true,
              type: true,
            },
          },
          transferTo: {
            select: {
              id: true,
              name: true,
              type: true,
              currency: true,
            },
          },
        },
      });

      // Apply new transaction's balance effects
      const newType = updateData.type || existingTransaction.type;
      const newAmount = updateData.amount || existingTransaction.amount;
      const newAccountId = updateData.accountId || existingTransaction.accountId;
      const newTransferToId = updateData.transferToId || existingTransaction.transferToId;

      switch (newType) {
        case 'INCOME':
          await tx.financeAccount.update({
            where: { id: newAccountId },
            data: { balance: { increment: newAmount } },
          });
          break;
        case 'EXPENSE':
          await tx.financeAccount.update({
            where: { id: newAccountId },
            data: { balance: { decrement: newAmount } },
          });
          break;
        case 'TRANSFER':
          if (newTransferToId) {
            await tx.financeAccount.update({
              where: { id: newAccountId },
              data: { balance: { decrement: newAmount } },
            });
            await tx.financeAccount.update({
              where: { id: newTransferToId },
              data: { balance: { increment: newAmount } },
            });
          }
          break;
      }

      return updatedTransaction;
    });

    return NextResponse.json({
      transaction: result,
      message: 'Transaction updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 },
      );
    }

    console.error('Error updating transaction:', error);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('id');

    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    // Get existing transaction
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId: user.id,
      },
    });

    if (!existingTransaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Delete transaction and reverse balance effects in a database transaction
    await prisma.$transaction(async tx => {
      // Reverse the transaction's balance effects
      switch (existingTransaction.type) {
        case 'INCOME':
          await tx.financeAccount.update({
            where: { id: existingTransaction.accountId },
            data: { balance: { decrement: existingTransaction.amount } },
          });
          break;
        case 'EXPENSE':
          await tx.financeAccount.update({
            where: { id: existingTransaction.accountId },
            data: { balance: { increment: existingTransaction.amount } },
          });
          break;
        case 'TRANSFER':
          if (existingTransaction.transferToId) {
            await tx.financeAccount.update({
              where: { id: existingTransaction.accountId },
              data: { balance: { increment: existingTransaction.amount } },
            });
            await tx.financeAccount.update({
              where: { id: existingTransaction.transferToId },
              data: { balance: { decrement: existingTransaction.amount } },
            });
          }
          break;
      }

      // Delete the transaction
      await tx.transaction.delete({
        where: { id: transactionId },
      });
    });

    return NextResponse.json({
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}
