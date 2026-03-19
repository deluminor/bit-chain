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
      return NextResponse.json(err('UNAUTHORIZED', 'Invalid or missing access token'), {
        status: 401,
      });
    }

    const body = await request.json().catch(() => ({}));
    const parsed = createTransactionSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.errors[0];
      const path = firstIssue && firstIssue.path.length > 0 ? `${firstIssue.path.join('.')}: ` : '';
      return NextResponse.json(
        err('VALIDATION_ERROR', `${path}${firstIssue?.message ?? 'Invalid request body'}`),
        { status: 422 },
      );
    }

    const transaction = await createTransaction(user.id, parsed.data);

    return NextResponse.json(ok({ transaction, message: 'Transaction created successfully' }), {
      status: 201,
    });
  } catch (error) {
    if (error instanceof TransactionDomainError) {
      return NextResponse.json(err('VALIDATION_ERROR', error.message), {
        status: error.status,
      });
    }

    console.error('[mobile/transactions POST] Error:', error);
    return NextResponse.json(err('INTERNAL_ERROR', 'Failed to create transaction'), {
      status: 500,
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    let user;
    try {
      user = await getMobileUser(request);
    } catch {
      return NextResponse.json(err('UNAUTHORIZED', 'Invalid or missing access token'), {
        status: 401,
      });
    }

    const body = await request.json().catch(() => ({}));
    const parsed = updateTransactionSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.errors[0];
      const path = firstIssue && firstIssue.path.length > 0 ? `${firstIssue.path.join('.')}: ` : '';
      return NextResponse.json(
        err('VALIDATION_ERROR', `${path}${firstIssue?.message ?? 'Invalid request body'}`),
        { status: 422 },
      );
    }

    const transaction = await updateTransaction(user.id, parsed.data);

    return NextResponse.json(ok({ transaction, message: 'Transaction updated successfully' }), {
      status: 200,
    });
  } catch (error) {
    if (error instanceof TransactionDomainError) {
      return NextResponse.json(err('VALIDATION_ERROR', error.message), {
        status: error.status,
      });
    }

    console.error('[mobile/transactions PUT] Error:', error);
    return NextResponse.json(err('INTERNAL_ERROR', 'Failed to update transaction'), {
      status: 500,
    });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    let user;
    try {
      user = await getMobileUser(request);
    } catch {
      return NextResponse.json(err('UNAUTHORIZED', 'Invalid or missing access token'), {
        status: 401,
      });
    }

    const transactionId = new URL(request.url).searchParams.get('id');
    if (!transactionId) {
      return NextResponse.json(err('VALIDATION_ERROR', 'Transaction ID is required'), {
        status: 400,
      });
    }

    await deleteTransaction(user.id, transactionId);

    return NextResponse.json(ok({ message: 'Transaction deleted successfully' }), { status: 200 });
  } catch (error) {
    if (error instanceof TransactionDomainError) {
      return NextResponse.json(err('VALIDATION_ERROR', error.message), {
        status: error.status,
      });
    }

    console.error('[mobile/transactions DELETE] Error:', error);
    return NextResponse.json(err('INTERNAL_ERROR', 'Failed to delete transaction'), {
      status: 500,
    });
  }
}
