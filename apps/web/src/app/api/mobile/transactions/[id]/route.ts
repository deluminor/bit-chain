import { getMobileUser } from '@/lib/mobile-auth';
import { prisma } from '@/lib/prisma';
import { err, ok, type TransactionByIdResponse } from '@bit-chain/api-contracts';
import { NextRequest, NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/mobile/transactions/:id
 */
export async function GET(request: NextRequest, context: RouteContext): Promise<NextResponse> {
  let user: { id: string; email: string };

  try {
    user = await getMobileUser(request);
  } catch {
    return NextResponse.json(err('UNAUTHORIZED', 'Invalid or missing access token'), {
      status: 401,
    });
  }

  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(err('INVALID_INPUT', 'Transaction ID is required'), {
        status: 400,
      });
    }

    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: user.id,
        isDemo: false,
      },
      select: {
        id: true,
        amount: true,
        type: true,
        description: true,
        date: true,
        currency: true,
        accountId: true,
        transferToId: true,
        transferAmount: true,
        transferCurrency: true,
        account: { select: { name: true } },
        categoryId: true,
        category: { select: { name: true, color: true } },
        transferTo: { select: { name: true } },
      },
    });

    if (!transaction) {
      return NextResponse.json(err('NOT_FOUND', 'Transaction not found'), { status: 404 });
    }

    const payload: TransactionByIdResponse = {
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        type: transaction.type,
        description: transaction.description,
        date: transaction.date.toISOString(),
        currency: transaction.currency,
        accountId: transaction.accountId,
        accountName: transaction.account.name,
        categoryId: transaction.categoryId,
        categoryName: transaction.category?.name ?? null,
        categoryColor: transaction.category?.color ?? null,
        transferToId: transaction.transferToId,
        transferToAccountName: transaction.transferTo?.name ?? null,
        transferAmount: transaction.transferAmount,
        transferCurrency: transaction.transferCurrency,
      },
    };

    return NextResponse.json(ok(payload), { status: 200 });
  } catch (error) {
    console.error('[mobile/transactions/:id] Error:', error);
    return NextResponse.json(err('INTERNAL_ERROR', 'Failed to fetch transaction'), {
      status: 500,
    });
  }
}
