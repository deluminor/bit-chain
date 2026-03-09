import {
  TransactionDomainError,
  createTransaction,
  deleteTransaction,
  listMobileTransactions,
  parseMobileTransactionsQuery,
  updateTransaction,
} from '@/features/finance/services/transactions/transaction-domain.service';
import {
  createTransactionSchema,
  updateTransactionSchema,
} from '@/features/finance/services/transactions/transaction.schemas';
import { getMobileUser } from '@/lib/mobile-auth';
import { err, ok, type TransactionsListResponse } from '@bit-chain/api-contracts';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * GET /api/mobile/transactions
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
    const query = parseMobileTransactionsQuery(new URL(request.url).searchParams);
    const payload: TransactionsListResponse = await listMobileTransactions(user.id, query);

    return NextResponse.json(ok(payload), { status: 200 });
  } catch (error) {
    console.error('[mobile/transactions] Error:', error);
    return NextResponse.json(err('INTERNAL_ERROR', 'Failed to fetch transactions'), {
      status: 500,
    });
  }
}

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
      const firstIssue = error.errors[0];
      const path = firstIssue && firstIssue.path.length > 0 ? `${firstIssue.path.join('.')}: ` : '';
      return NextResponse.json(
        { error: `${path}${firstIssue?.message ?? 'Validation error'}`, details: error.errors },
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
    let user;
    try {
      user = await getMobileUser(request);
    } catch {
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
      const firstIssue = error.errors[0];
      const path = firstIssue && firstIssue.path.length > 0 ? `${firstIssue.path.join('.')}: ` : '';
      return NextResponse.json(
        { error: `${path}${firstIssue?.message ?? 'Validation error'}`, details: error.errors },
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
    let user;
    try {
      user = await getMobileUser(request);
    } catch {
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
