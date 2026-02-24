import type { Prisma } from '@/generated/prisma';
import { getMobileUser } from '@/lib/mobile-auth';
import { prisma } from '@/lib/prisma';
import { err, ok, type TransactionsListResponse } from '@bit-chain/api-contracts';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * GET /api/mobile/transactions
 *
 * Returns a paginated list of transactions with period statistics.
 *
 * @query page       - Page number (default: 1)
 * @query pageSize   - Items per page, max 50 (default: 20)
 * @query type       - Filter: INCOME | EXPENSE | TRANSFER
 * @query accountId  - Filter by account ID
 * @query categoryId - Filter by category ID
 * @query search     - Description text search
 * @query dateFrom   - ISO datetime lower bound
 * @query dateTo     - ISO datetime upper bound
 *
 * @returns 200 TransactionsListResponse
 * @returns 401 UNAUTHORIZED
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

    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') ?? '20', 10)));
    const typeParam = searchParams.get('type');
    const accountId = searchParams.get('accountId') ?? undefined;
    const categoryId = searchParams.get('categoryId') ?? undefined;
    const search = searchParams.get('search')?.trim() || undefined;
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    const validType =
      typeParam === 'INCOME' || typeParam === 'EXPENSE' || typeParam === 'TRANSFER'
        ? (typeParam as 'INCOME' | 'EXPENSE' | 'TRANSFER')
        : undefined;

    // ── Two separate where clauses ─────────────────────────────────────────
    // `listWhere`  — includes type filter (what the user selected in the chip)
    // `statsWhere` — excludes type filter so income/expenses/netFlow always
    //                reflect the full period regardless of the active chip.
    const baseConditions: Prisma.TransactionWhereInput = {
      userId: user.id,
      isDemo: false,
      ...(accountId && { accountId }),
      ...(categoryId && { categoryId }),
      ...(search && { description: { contains: search, mode: 'insensitive' as const } }),
      ...((dateFrom || dateTo) && {
        date: {
          ...(dateFrom && { gte: new Date(dateFrom) }),
          ...(dateTo && { lte: new Date(dateTo) }),
        },
      }),
    };

    const listWhere: Prisma.TransactionWhereInput = {
      ...baseConditions,
      ...(validType && { type: validType }),
    };

    // Stats are intentionally computed without a type filter so that
    // selecting "EXPENSE" chip doesn't zero-out income and vice-versa.
    const statsWhere: Prisma.TransactionWhereInput = {
      ...baseConditions,
      type: { in: ['INCOME', 'EXPENSE'] },
    };

    const skip = (page - 1) * pageSize;

    // Parallel fetch: paginated list + total count + period stats
    const [transactions, total, aggregates] = await Promise.all([
      prisma.transaction.findMany({
        where: listWhere,
        select: {
          id: true,
          amount: true,
          type: true,
          description: true,
          date: true,
          currency: true,
          accountId: true,
          account: { select: { name: true } },
          categoryId: true,
          category: { select: { name: true, color: true } },
        },
        orderBy: { date: 'desc' },
        skip,
        take: pageSize,
      }),

      prisma.transaction.count({ where: listWhere }),

      // Group by type + currency to avoid summing different currencies together.
      prisma.transaction.groupBy({
        by: ['type', 'currency'],
        where: statsWhere,
        _sum: { amount: true },
        _count: { id: true },
      }),
    ]);

    // Group amounts per currency
    const statsByCurrency = new Map<
      string,
      { income: number; expenses: number; netFlow: number }
    >();

    for (const g of aggregates) {
      const currency = g.currency;
      if (!statsByCurrency.has(currency)) {
        statsByCurrency.set(currency, { income: 0, expenses: 0, netFlow: 0 });
      }

      const stats = statsByCurrency.get(currency)!;
      const amount = g._sum.amount ?? 0;

      if (g.type === 'INCOME') stats.income += amount;
      if (g.type === 'EXPENSE') stats.expenses += amount;
      stats.netFlow = stats.income - stats.expenses;
    }

    const stats = Array.from(statsByCurrency.entries()).map(([currency, data]) => ({
      currency,
      income: data.income,
      expenses: data.expenses,
      netFlow: data.netFlow,
    }));

    // Fallback to UAH if there are no stats (e.g. empty period)
    if (stats.length === 0) {
      stats.push({ currency: 'UAH', income: 0, expenses: 0, netFlow: 0 });
    }

    const txCount = aggregates.reduce((acc, g) => acc + (g._count.id ?? 0), 0);

    const payload: TransactionsListResponse = {
      transactions: transactions.map(tx => ({
        id: tx.id,
        amount: tx.amount,
        type: tx.type as 'INCOME' | 'EXPENSE' | 'TRANSFER',
        description: tx.description,
        date: tx.date.toISOString(),
        currency: tx.currency,
        accountId: tx.accountId,
        accountName: tx.account.name,
        categoryId: tx.categoryId,
        categoryName: tx.category?.name ?? null,
        categoryColor: tx.category?.color ?? null,
      })),
      stats,
      transactionCount: txCount,
      total,
      page,
      pageSize,
      hasMore: skip + transactions.length < total,
    };

    return NextResponse.json(ok(payload), { status: 200 });
  } catch (error) {
    console.error('[mobile/transactions] Error:', error);
    return NextResponse.json(err('INTERNAL_ERROR', 'Failed to fetch transactions'), {
      status: 500,
    });
  }
}


const createTransactionSchema = z.object({
  accountId: z.string().cuid('Invalid account ID'),
  categoryId: z.string().cuid('Invalid category ID'),
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().min(3).max(3).optional(),
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

export async function POST(request: NextRequest) {
  try {
    
    let user;
    try {
      user = await getMobileUser(request);
    } catch {
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
      select: {
        id: true,
        type: true,
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

    const transactionCurrency = validatedData.currency ?? account.currency;

    // Create transaction and update balances in a database transaction
    const result = await prisma.$transaction(async tx => {
      // Create the transaction
      const transaction = await tx.transaction.create({
        data: {
          ...validatedData,
          userId: user.id,
          date: validatedData.date || new Date(),
          currency: transactionCurrency,
        },
        select: {
          id: true,
          type: true,
          amount: true,
          currency: true,
          description: true,
          date: true,
          tags: true,
          transferToId: true,
          transferAmount: true,
          transferCurrency: true,
          isRecurring: true,
          recurringPattern: true,
          createdAt: true,
          updatedAt: true,
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

      // Check if account is integrated
      const account = await tx.financeAccount.findUnique({
        where: { id: validatedData.accountId },
        include: { integrationAccounts: true },
      });

      const isIntegrated = (account?.integrationAccounts.length ?? 0) > 0;

      if (!isIntegrated) {
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

              // Check if destination account is integrated
              const destAccount = await tx.financeAccount.findUnique({
                where: { id: validatedData.transferToId },
                include: { integrationAccounts: true },
              });

              const isDestIntegrated = (destAccount?.integrationAccounts.length ?? 0) > 0;

              if (!isDestIntegrated) {
                // Add to destination account (use transferAmount for multi-currency transfers)
                const amountToAdd = validatedData.transferAmount || validatedData.amount;
                await tx.financeAccount.update({
                  where: { id: validatedData.transferToId },
                  data: { balance: { increment: amountToAdd } },
                });
              }
            }
            break;
        }
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

    if (error instanceof Error && 'status' in error && error.status === 400) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    
    let user;
    try {
      user = await getMobileUser(request);
    } catch {
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
      include: {
        category: true,
      },
    });

    if (!existingTransaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Update transaction and balances in a database transaction
    const result = await prisma.$transaction(async tx => {
      // Check if original account is integrated
      const originalAccount = await tx.financeAccount.findUnique({
        where: { id: existingTransaction.accountId },
        include: { integrationAccounts: true },
      });

      const isOriginalIntegrated = (originalAccount?.integrationAccounts.length ?? 0) > 0;

      if (!isOriginalIntegrated) {
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

              // Check if original destination is integrated
              const originalDestAccount = await tx.financeAccount.findUnique({
                where: { id: existingTransaction.transferToId },
                include: { integrationAccounts: true },
              });

              const isOriginalDestIntegrated =
                (originalDestAccount?.integrationAccounts.length ?? 0) > 0;

              if (!isOriginalDestIntegrated) {
                // Use transferAmount from existing transaction if available, otherwise use amount
                const amountToRevert =
                  existingTransaction.transferAmount || existingTransaction.amount;
                await tx.financeAccount.update({
                  where: { id: existingTransaction.transferToId },
                  data: { balance: { decrement: amountToRevert } },
                });
              }
            }
            break;
        }
      }

      // Update the transaction
      const updatedTransaction = await tx.transaction.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          type: true,
          amount: true,
          currency: true,
          description: true,
          date: true,
          tags: true,
          transferToId: true,
          transferAmount: true,
          transferCurrency: true,
          isRecurring: true,
          recurringPattern: true,
          createdAt: true,
          updatedAt: true,
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

      // Check if new account is integrated
      const newAccount = await tx.financeAccount.findUnique({
        where: { id: newAccountId },
        include: { integrationAccounts: true },
      });

      const isNewIntegrated = (newAccount?.integrationAccounts.length ?? 0) > 0;

      if (!isNewIntegrated) {
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

              // Check if new destination is integrated
              const newDestAccount = await tx.financeAccount.findUnique({
                where: { id: newTransferToId },
                include: { integrationAccounts: true },
              });

              const isNewDestIntegrated = (newDestAccount?.integrationAccounts.length ?? 0) > 0;

              if (!isNewDestIntegrated) {
                // Use transferAmount for destination account if explicitly provided in update,
                // otherwise check if it exists in the updated transaction, fallback to source amount
                const newTransferAmount =
                  updateData.transferAmount !== undefined
                    ? updateData.transferAmount
                    : updatedTransaction.transferAmount || newAmount;
                await tx.financeAccount.update({
                  where: { id: newTransferToId },
                  data: { balance: { increment: newTransferAmount } },
                });
              }
            }
            break;
        }
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

    if (error instanceof Error && 'status' in error && error.status === 400) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error('Error updating transaction:', error);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    
    let user;
    try {
      user = await getMobileUser(request);
    } catch {
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
      include: {
        category: true,
      },
    });

    if (!existingTransaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Delete transaction and reverse balance effects in a database transaction
    await prisma.$transaction(async tx => {
      // Check if account is integrated
      const account = await tx.financeAccount.findUnique({
        where: { id: existingTransaction.accountId },
        include: { integrationAccounts: true },
      });

      const isIntegrated = (account?.integrationAccounts.length ?? 0) > 0;

      if (!isIntegrated) {
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

              // For the destination account, we also need to check if it's integrated
              const destAccount = await tx.financeAccount.findUnique({
                where: { id: existingTransaction.transferToId },
                include: { integrationAccounts: true },
              });

              const isDestIntegrated = (destAccount?.integrationAccounts.length ?? 0) > 0;

              if (!isDestIntegrated) {
                // Use transferAmount from existing transaction if available, otherwise use amount
                const amountToRevert =
                  existingTransaction.transferAmount || existingTransaction.amount;
                await tx.financeAccount.update({
                  where: { id: existingTransaction.transferToId },
                  data: { balance: { decrement: amountToRevert } },
                });
              }
            }
            break;
        }
      }

      await tx.transaction.delete({
        where: { id: transactionId },
      });
    });

    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}

