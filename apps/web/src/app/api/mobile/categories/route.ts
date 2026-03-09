import {
  categoryDeleteInputSchema,
  createMobileCategoryInputSchema,
  mobileCategoriesQuerySchema,
  updateMobileCategoryInputSchema,
} from '@/features/finance/services/categories/category-domain.schemas';
import {
  CategoryDomainError,
  createMobileCategory,
  deleteMobileCategory,
  listMobileCategories,
  updateMobileCategory,
} from '@/features/finance/services/categories/category-domain.service';
import { getMobileUser } from '@/lib/mobile-auth';
import { err, ok, type CategoriesListResponse } from '@bit-chain/api-contracts';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

async function getAuthenticatedMobileUser(request: NextRequest): Promise<{ id: string } | null> {
  try {
    return await getMobileUser(request);
  } catch {
    return null;
  }
}

function parseMobileCategoriesQuery(searchParams: URLSearchParams) {
  return mobileCategoriesQuerySchema.parse({
    type: searchParams.get('type') ?? undefined,
  });
}

function mapMobileCategoryError(error: unknown, action: string): NextResponse {
  if (error instanceof z.ZodError) {
    const firstIssue = error.errors[0]?.message ?? 'Validation error';
    return NextResponse.json(err('VALIDATION_ERROR', firstIssue), { status: 400 });
  }

  if (error instanceof CategoryDomainError) {
    if (error.code === 'CONFLICT') {
      return NextResponse.json(err('CONFLICT', error.message), { status: 409 });
    }

    if (error.code === 'NOT_FOUND') {
      return NextResponse.json(err('NOT_FOUND', error.message), { status: 404 });
    }

    if (error.code === 'FORBIDDEN') {
      return NextResponse.json(err('FORBIDDEN', error.message), { status: 403 });
    }

    return NextResponse.json(err('VALIDATION_ERROR', error.message), { status: error.status });
  }

  console.error(`[mobile/categories] ${action} error:`, error);
  return NextResponse.json(err('INTERNAL_ERROR', `Failed to ${action} category`), { status: 500 });
}

/**
 * GET /api/mobile/categories
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const user = await getAuthenticatedMobileUser(request);
  if (!user) {
    return NextResponse.json(err('UNAUTHORIZED', 'Invalid or missing access token'), {
      status: 401,
    });
  }

  try {
    const query = parseMobileCategoriesQuery(new URL(request.url).searchParams);
    const payload: CategoriesListResponse = await listMobileCategories(user.id, query);

    return NextResponse.json(ok(payload), { status: 200 });
  } catch (error) {
    return mapMobileCategoryError(error, 'fetch');
  }
}

/**
 * POST /api/mobile/categories
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const user = await getAuthenticatedMobileUser(request);
  if (!user) {
    return NextResponse.json(err('UNAUTHORIZED', 'Invalid or missing access token'), {
      status: 401,
    });
  }

  try {
    const body = await request.json();
    const input = createMobileCategoryInputSchema.parse(body);
    const category = await createMobileCategory(user.id, input);

    return NextResponse.json(ok(category), { status: 201 });
  } catch (error) {
    return mapMobileCategoryError(error, 'create');
  }
}

/**
 * PUT /api/mobile/categories
 */
export async function PUT(request: NextRequest): Promise<NextResponse> {
  const user = await getAuthenticatedMobileUser(request);
  if (!user) {
    return NextResponse.json(err('UNAUTHORIZED', 'Invalid or missing access token'), {
      status: 401,
    });
  }

  try {
    const body = await request.json();
    const input = updateMobileCategoryInputSchema.parse(body);
    const category = await updateMobileCategory(user.id, input);

    return NextResponse.json(ok(category), { status: 200 });
  } catch (error) {
    return mapMobileCategoryError(error, 'update');
  }
}

/**
 * DELETE /api/mobile/categories?id=
 */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const user = await getAuthenticatedMobileUser(request);
  if (!user) {
    return NextResponse.json(err('UNAUTHORIZED', 'Invalid or missing access token'), {
      status: 401,
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const { id } = categoryDeleteInputSchema.parse({ id: searchParams.get('id') ?? '' });

    await deleteMobileCategory(user.id, id);

    return NextResponse.json(ok({ message: 'Category deleted successfully' }), { status: 200 });
  } catch (error) {
    return mapMobileCategoryError(error, 'delete');
  }
}
