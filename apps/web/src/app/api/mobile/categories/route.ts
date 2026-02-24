import { getMobileUser } from '@/lib/mobile-auth';
import { prisma } from '@/lib/prisma';
import { err, ok, type CategoriesListResponse } from '@bit-chain/api-contracts';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/mobile/categories
 *
 * Returns all active INCOME/EXPENSE categories for the authenticated mobile user.
 *
 * @query type - Optional filter: "INCOME" | "EXPENSE"
 *
 * @returns 200 CategoriesListResponse
 * @returns 401 UNAUTHORIZED if Bearer token is invalid or missing
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
    const typeParam = searchParams.get('type');
    const type = typeParam === 'INCOME' || typeParam === 'EXPENSE' ? typeParam : undefined;

    const categories = await prisma.transactionCategory.findMany({
      where: {
        userId: user.id,
        isActive: true,
        isDemo: false,
        type: type ?? { in: ['INCOME', 'EXPENSE'] },
      },
      select: {
        id: true,
        name: true,
        type: true,
        color: true,
        isDefault: true,
        _count: { select: { transactions: true } },
      },
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    });

    const incomeCount = categories.filter(c => c.type === 'INCOME').length;
    const expenseCount = categories.filter(c => c.type === 'EXPENSE').length;

    const payload: CategoriesListResponse = {
      categories: categories.map(c => ({
        id: c.id,
        name: c.name,
        type: c.type as 'INCOME' | 'EXPENSE',
        color: c.color,
        isDefault: c.isDefault,
        transactionCount: c._count.transactions,
      })),
      incomeCount,
      expenseCount,
    };

    return NextResponse.json(ok(payload), { status: 200 });
  } catch (error) {
    console.error('[mobile/categories] Error:', error);
    return NextResponse.json(err('INTERNAL_ERROR', 'Failed to fetch categories'), { status: 500 });
  }
}
