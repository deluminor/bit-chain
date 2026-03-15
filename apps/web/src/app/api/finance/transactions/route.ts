import { authOptions } from '@/features/auth/libs/auth';
import {
  TransactionDomainError,
  createTransaction,
  deleteTransaction,
  listWebTransactions,
  parseWebTransactionsQuery,
  updateTransaction,
} from '@/features/finance/services/transactions/transaction-domain.service';
import {
  createTransactionSchema,
  updateTransactionSchema,
} from '@/features/finance/services/transactions/transaction.schemas';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

async function getUserFromSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return null;
  }

  return prisma.user.findUnique({
    where: { email: session.user.email },
  });
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const query = parseWebTransactionsQuery(new URL(request.url).searchParams);
    const result = await listWebTransactions(user.id, query);

    return NextResponse.json(result);
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
    const transaction = await createTransaction(user.id, validatedData);

    return NextResponse.json(
      {
        transaction,
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

    if (error instanceof TransactionDomainError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
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
    const transaction = await updateTransaction(user.id, validatedData);

    return NextResponse.json({
      transaction,
      message: 'Transaction updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 },
      );
    }

    if (error instanceof TransactionDomainError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
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

    const transactionId = new URL(request.url).searchParams.get('id');
    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    await deleteTransaction(user.id, transactionId);

    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    if (error instanceof TransactionDomainError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error('Error deleting transaction:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}
