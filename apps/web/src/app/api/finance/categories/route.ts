import { authOptions } from '@/features/auth/libs/auth';
import {
  categoryDeleteInputSchema,
  createWebCategoryInputSchema,
  updateWebCategoryInputSchema,
  webCategoriesQuerySchema,
} from '@/features/finance/services/categories/category-domain.schemas';
import {
  CategoryDomainError,
  createWebCategory,
  deleteWebCategory,
  listWebCategories,
  updateWebCategory,
} from '@/features/finance/services/categories/category-domain.service';
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

function parseWebCategoriesQuery(searchParams: URLSearchParams) {
  return webCategoriesQuerySchema.parse({
    type: searchParams.get('type') ?? undefined,
    includeInactive: searchParams.get('includeInactive') === 'true',
    hierarchical: searchParams.get('hierarchical') === 'true',
  });
}

function mapCategoriesError(error: unknown, action: string): NextResponse {
  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
  }

  if (error instanceof CategoryDomainError) {
    return NextResponse.json(
      {
        error: error.message,
        ...(error.details ?? {}),
      },
      { status: error.status },
    );
  }

  console.error(`[finance/categories] ${action} error:`, error);
  return NextResponse.json({ error: `Failed to ${action} categories` }, { status: 500 });
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedFinanceUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const query = parseWebCategoriesQuery(new URL(request.url).searchParams);
    const result = await listWebCategories(userId, query);

    return NextResponse.json(result);
  } catch (error) {
    return mapCategoriesError(error, 'fetch');
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedFinanceUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const input = createWebCategoryInputSchema.parse(body);
    const category = await createWebCategory(userId, input);

    return NextResponse.json(
      {
        category,
        message: 'Category created successfully',
      },
      { status: 201 },
    );
  } catch (error) {
    return mapCategoriesError(error, 'create');
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getAuthenticatedFinanceUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const input = updateWebCategoryInputSchema.parse(body);
    const category = await updateWebCategory(userId, input);

    return NextResponse.json({
      category,
      message: 'Category updated successfully',
    });
  } catch (error) {
    return mapCategoriesError(error, 'update');
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getAuthenticatedFinanceUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const { id } = categoryDeleteInputSchema.parse({ id: searchParams.get('id') ?? '' });

    await deleteWebCategory(userId, id);

    return NextResponse.json({
      message: 'Category deleted successfully',
    });
  } catch (error) {
    return mapCategoriesError(error, 'delete');
  }
}
