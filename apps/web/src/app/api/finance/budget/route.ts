import { authOptions } from '@/features/auth/libs/auth';
import {
  createBudgetInputSchema,
  deleteBudgetInputSchema,
  updateBudgetInputSchema,
} from '@/features/finance/services/budget/budget-domain.schemas';
import {
  BudgetDomainError,
  createBudget,
  deleteBudget,
  listBudgetsWithSummary,
  updateBudget,
} from '@/features/finance/services/budget/budget-domain.service';
import { findOrCreateFinanceUserByEmail } from '@/features/finance/services/finance-user.service';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

async function getAuthenticatedFinanceUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const user = await findOrCreateFinanceUserByEmail(session.user.email);
  return user.id;
}

function mapBudgetError(error: unknown, action: string): NextResponse {
  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
  }

  if (error instanceof BudgetDomainError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  console.error(`[finance/budget] ${action} error:`, error);
  return NextResponse.json({ error: `Failed to ${action} budget` }, { status: 500 });
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedFinanceUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const fromS = request.nextUrl.searchParams.get('from');
    const toS = request.nextUrl.searchParams.get('to');

    if (fromS && toS) {
      const globalFrom = new Date(fromS);
      const globalTo = new Date(toS);

      if (Number.isNaN(globalFrom.getTime()) || Number.isNaN(globalTo.getTime())) {
        return NextResponse.json({ error: 'Invalid from/to date' }, { status: 400 });
      }

      const result = await listBudgetsWithSummary(userId, { globalFrom, globalTo });
      return NextResponse.json(result);
    }

    const result = await listBudgetsWithSummary(userId);
    return NextResponse.json(result);
  } catch (error) {
    return mapBudgetError(error, 'fetch');
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedFinanceUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const input = createBudgetInputSchema.parse(body);
    const budget = await createBudget(userId, input);

    return NextResponse.json({ budget }, { status: 201 });
  } catch (error) {
    return mapBudgetError(error, 'create');
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getAuthenticatedFinanceUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const input = updateBudgetInputSchema.parse(body);
    const budget = await updateBudget(userId, input);

    return NextResponse.json({ budget });
  } catch (error) {
    return mapBudgetError(error, 'update');
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getAuthenticatedFinanceUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const { id } = deleteBudgetInputSchema.parse({ id: searchParams.get('id') ?? '' });

    await deleteBudget(userId, id);

    return NextResponse.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    return mapBudgetError(error, 'delete');
  }
}
