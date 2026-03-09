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
import { getMobileUser } from '@/lib/mobile-auth';
import { err, ok } from '@bit-chain/api-contracts';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

type MobileUser = {
  id: string;
  email: string;
};

type MobileBudgetCategory = {
  transactionCount?: number;
  category: {
    id: string;
    name: string;
    type: string;
    color: string;
    icon: string | null;
  };
};

type MobileBudgetShape = {
  categories: ReadonlyArray<MobileBudgetCategory>;
};

function mapBudgetCategoryForMobile(category: MobileBudgetCategory) {
  return {
    ...category,
    category: {
      ...category.category,
      isDefault: false,
      transactionCount: category.transactionCount ?? 0,
    },
  };
}

function mapBudgetForMobile<T extends MobileBudgetShape>(budget: T) {
  return {
    ...budget,
    categories: budget.categories.map(mapBudgetCategoryForMobile),
  };
}

async function getAuthenticatedMobileUser(request: NextRequest): Promise<MobileUser | null> {
  try {
    return await getMobileUser(request);
  } catch {
    return null;
  }
}

function mapBudgetError(error: unknown, action: string): NextResponse {
  if (error instanceof z.ZodError) {
    const firstIssue = error.errors[0]?.message ?? 'Validation error';
    return NextResponse.json(err('VALIDATION_ERROR', firstIssue), { status: 400 });
  }

  if (error instanceof BudgetDomainError) {
    if (error.status === 404) {
      return NextResponse.json(err('NOT_FOUND', error.message), { status: 404 });
    }

    if (error.status === 400) {
      return NextResponse.json(err('VALIDATION_ERROR', error.message), { status: 400 });
    }

    return NextResponse.json(err('INTERNAL_ERROR', error.message), { status: error.status });
  }

  console.error(`[mobile/budget] ${action} error:`, error);
  return NextResponse.json(err('INTERNAL_ERROR', `Failed to ${action} budget`), { status: 500 });
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedMobileUser(request);
  if (!user) {
    return NextResponse.json(err('UNAUTHORIZED', 'Invalid or missing access token'), {
      status: 401,
    });
  }

  try {
    const result = await listBudgetsWithSummary(user.id);

    return NextResponse.json(
      ok({
        budgets: result.budgets.map(mapBudgetForMobile),
        summary: result.summary,
      }),
      { status: 200 },
    );
  } catch (error) {
    return mapBudgetError(error, 'fetch');
  }
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedMobileUser(request);
  if (!user) {
    return NextResponse.json(err('UNAUTHORIZED', 'Invalid or missing access token'), {
      status: 401,
    });
  }

  try {
    const body = await request.json();
    const input = createBudgetInputSchema.parse(body);
    const budget = await createBudget(user.id, input);

    return NextResponse.json(ok({ budget: mapBudgetForMobile(budget) }), { status: 201 });
  } catch (error) {
    return mapBudgetError(error, 'create');
  }
}

export async function PUT(request: NextRequest) {
  const user = await getAuthenticatedMobileUser(request);
  if (!user) {
    return NextResponse.json(err('UNAUTHORIZED', 'Invalid or missing access token'), {
      status: 401,
    });
  }

  try {
    const body = await request.json();
    const input = updateBudgetInputSchema.parse(body);
    const budget = await updateBudget(user.id, input);

    return NextResponse.json(ok({ budget: mapBudgetForMobile(budget) }), { status: 200 });
  } catch (error) {
    return mapBudgetError(error, 'update');
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getAuthenticatedMobileUser(request);
  if (!user) {
    return NextResponse.json(err('UNAUTHORIZED', 'Invalid or missing access token'), {
      status: 401,
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const { id } = deleteBudgetInputSchema.parse({ id: searchParams.get('id') ?? '' });

    await deleteBudget(user.id, id);

    return NextResponse.json(ok({ message: 'Budget deleted successfully' }), { status: 200 });
  } catch (error) {
    return mapBudgetError(error, 'delete');
  }
}
