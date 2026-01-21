import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@/generated/prisma';
import type { Prisma } from '@/generated/prisma';
import { convertToBaseCurrencySafe } from '@/lib/currency';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
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

const getExpectedTransactionType = (loanType: 'LOAN' | 'DEBT') =>
  loanType === 'LOAN' ? 'EXPENSE' : 'INCOME';

const createLoanValidationError = (message: string) => {
  const error = new Error(message) as Error & { status?: number };
  error.status = 400;
  return error;
};

async function adjustLoanBalance(
  tx: Prisma.TransactionClient,
  loanId: string,
  amount: number,
  direction: 'increase' | 'decrease',
) {
  const loan = await tx.loan.findFirst({
    where: { id: loanId },
  });

  if (!loan) {
    throw createLoanValidationError('Loan not found or access denied');
  }

  const nextBalance =
    direction === 'decrease' ? loan.currentBalance - amount : loan.currentBalance + amount;

  if (nextBalance < 0) {
    throw createLoanValidationError('Payment exceeds remaining loan balance');
  }

  const normalizedBalance = Math.max(nextBalance, 0);
  const isActive = loan.isActive ? normalizedBalance > 0 : false;

  const updatedLoan = await tx.loan.update({
    where: { id: loanId },
    data: {
      currentBalance: normalizedBalance,
      isActive,
    },
  });

  await tx.transactionCategory.updateMany({
    where: { loanId },
    data: { isActive },
  });

  return updatedLoan;
}

interface SummaryTransaction {
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  amount: number;
  currency: string | null;
  account: {
    currency: string;
  } | null;
}

async function calculateSummary(transactions: SummaryTransaction[]) {
  let income = 0;
  let expenses = 0;
  let transfers = 0;
  let incomeCount = 0;
  let expenseCount = 0;
  let transferCount = 0;
  let maxIncome = 0;
  let maxExpense = 0;

  for (const transaction of transactions) {
    const currency = transaction.currency || transaction.account?.currency;
    const amountInBase = await convertToBaseCurrencySafe(transaction.amount, currency ?? undefined);

    if (transaction.type === 'INCOME') {
      income += amountInBase;
      incomeCount += 1;
      maxIncome = Math.max(maxIncome, amountInBase);
    } else if (transaction.type === 'EXPENSE') {
      expenses += amountInBase;
      expenseCount += 1;
      maxExpense = Math.max(maxExpense, amountInBase);
    } else if (transaction.type === 'TRANSFER') {
      transfers += amountInBase;
      transferCount += 1;
    }
  }

  return {
    income,
    expenses,
    transfers,
    incomeCount,
    expenseCount,
    transferCount,
    maxIncome,
    maxExpense,
  };
}

function normalizeDate(value: string, boundary: 'start' | 'end') {
  const hasTime = value.includes('T');
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  if (!hasTime) {
    if (boundary === 'end') {
      date.setHours(23, 59, 59, 999);
    } else {
      date.setHours(0, 0, 0, 0);
    }
  }

  return date;
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
    const dateFromValue = dateFrom ? normalizeDate(dateFrom, 'start') : null;
    const dateToValue = dateTo ? normalizeDate(dateTo, 'end') : null;

    const where: any = {
      userId: user.id,
      ...(type && { type }),
      ...(categoryId && { categoryId }),
      ...((dateFrom || dateTo) && {
        date: {
          ...(dateFromValue && { gte: dateFromValue }),
          ...(dateToValue && { lte: dateToValue }),
        },
      }),
      ...(search && {
        OR: [
          { description: { contains: search, mode: 'insensitive' } },
          { tags: { hasSome: [search] } },
        ],
      }),
    };

    if (accountId) {
      where.OR = [{ accountId }, { transferToId: accountId }];
    }

    // Get transactions with pagination
    const [transactions, totalCount, summaryTransactions] = await Promise.all([
      prisma.transaction.findMany({
        where,
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
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where }),
      prisma.transaction.findMany({
        where,
        select: {
          type: true,
          amount: true,
          currency: true,
          account: {
            select: {
              currency: true,
            },
          },
        },
      }),
    ]);

    // Calculate summary statistics in base currency (all filters applied)
    const summaryTotals = await calculateSummary(summaryTransactions);

    const summary = {
      ...summaryTotals,
      totalTransactions: totalCount,
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
      select: {
        id: true,
        type: true,
        loanId: true,
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

    if (category.loanId) {
      const loan = await prisma.loan.findFirst({
        where: {
          id: category.loanId,
          userId: user.id,
        },
      });

      if (!loan) {
        return NextResponse.json({ error: 'Loan not found or access denied' }, { status: 404 });
      }

      const expectedType = getExpectedTransactionType(loan.type);
      if (validatedData.type !== expectedType) {
        return NextResponse.json(
          { error: `Loan payments must be ${expectedType.toLowerCase()} transactions` },
          { status: 400 },
        );
      }

      if (transactionCurrency !== loan.currency) {
        return NextResponse.json(
          { error: `Loan currency must be ${loan.currency}` },
          { status: 400 },
        );
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

      if (category.loanId) {
        await adjustLoanBalance(tx, category.loanId, validatedData.amount, 'decrease');
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
      include: {
        category: {
          select: {
            loanId: true,
          },
        },
      },
    });

    if (!existingTransaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    const newCategoryId = updateData.categoryId || existingTransaction.categoryId;
    const newCurrency = updateData.currency ?? existingTransaction.currency;

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
            // Use transferAmount from existing transaction if available, otherwise use amount
            const amountToRevert = existingTransaction.transferAmount || existingTransaction.amount;
            await tx.financeAccount.update({
              where: { id: existingTransaction.transferToId },
              data: { balance: { decrement: amountToRevert } },
            });
          }
          break;
      }

      if (existingTransaction.category.loanId) {
        await adjustLoanBalance(
          tx,
          existingTransaction.category.loanId,
          existingTransaction.amount,
          'increase',
        );
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
            // Use transferAmount for destination account if available, otherwise use amount
            const amountToAdd =
              updateData.transferAmount || existingTransaction.transferAmount || newAmount;
            await tx.financeAccount.update({
              where: { id: newTransferToId },
              data: { balance: { increment: amountToAdd } },
            });
          }
          break;
      }

      const newCategory = await tx.transactionCategory.findFirst({
        where: {
          id: newCategoryId,
          userId: user.id,
        },
        select: {
          loanId: true,
        },
      });

      if (newCategory?.loanId) {
        const loan = await tx.loan.findFirst({
          where: {
            id: newCategory.loanId,
            userId: user.id,
          },
        });

        if (!loan) {
          throw createLoanValidationError('Loan not found or access denied');
        }

        const expectedType = getExpectedTransactionType(loan.type);
        if (newType !== expectedType) {
          throw createLoanValidationError(
            `Loan payments must be ${expectedType.toLowerCase()} transactions`,
          );
        }

        if (newCurrency !== loan.currency) {
          throw createLoanValidationError(`Loan currency must be ${loan.currency}`);
        }

        await adjustLoanBalance(tx, loan.id, newAmount, 'decrease');
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
      include: {
        category: {
          select: {
            loanId: true,
          },
        },
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
            // Use transferAmount from existing transaction if available, otherwise use amount
            const amountToRevert = existingTransaction.transferAmount || existingTransaction.amount;
            await tx.financeAccount.update({
              where: { id: existingTransaction.transferToId },
              data: { balance: { decrement: amountToRevert } },
            });
          }
          break;
      }

      if (existingTransaction.category.loanId) {
        await adjustLoanBalance(
          tx,
          existingTransaction.category.loanId,
          existingTransaction.amount,
          'increase',
        );
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
