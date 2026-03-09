import {
  createMobileGoalInputSchema,
  goalDeleteInputSchema,
  updateMobileGoalInputSchema,
} from '@/features/finance/services/goals/goal-domain.schemas';
import {
  createMobileGoal,
  deleteMobileGoal,
  GoalDomainError,
  listMobileGoals,
  updateMobileGoal,
} from '@/features/finance/services/goals/goal-domain.service';
import { getMobileUser } from '@/lib/mobile-auth';
import { err, ok, type GoalsListResponse } from '@bit-chain/api-contracts';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

async function getAuthenticatedMobileUser(request: NextRequest): Promise<{ id: string } | null> {
  try {
    return await getMobileUser(request);
  } catch {
    return null;
  }
}

function mapMobileGoalsError(error: unknown, action: string): NextResponse {
  if (error instanceof z.ZodError) {
    const firstIssue = error.errors[0]?.message ?? 'Validation error';
    return NextResponse.json(err('VALIDATION_ERROR', firstIssue), { status: 400 });
  }

  if (error instanceof GoalDomainError) {
    if (error.code === 'NOT_FOUND') {
      return NextResponse.json(err('NOT_FOUND', error.message), { status: 404 });
    }

    return NextResponse.json(err('VALIDATION_ERROR', error.message), { status: error.status });
  }

  console.error(`[mobile/goals] ${action} error:`, error);
  return NextResponse.json(err('INTERNAL_ERROR', `Failed to ${action} goal`), { status: 500 });
}

/**
 * GET /api/mobile/goals
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const user = await getAuthenticatedMobileUser(request);
  if (!user) {
    return NextResponse.json(err('UNAUTHORIZED', 'Invalid or missing access token'), {
      status: 401,
    });
  }

  try {
    const payload: GoalsListResponse = await listMobileGoals(user.id);
    return NextResponse.json(ok(payload), { status: 200 });
  } catch (error) {
    return mapMobileGoalsError(error, 'fetch');
  }
}

/**
 * POST /api/mobile/goals
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
    const input = createMobileGoalInputSchema.parse(body);
    const goal = await createMobileGoal(user.id, input);

    return NextResponse.json(ok(goal), { status: 201 });
  } catch (error) {
    return mapMobileGoalsError(error, 'create');
  }
}

/**
 * PUT /api/mobile/goals
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
    const input = updateMobileGoalInputSchema.parse(body);
    const goal = await updateMobileGoal(user.id, input);

    return NextResponse.json(ok(goal), { status: 200 });
  } catch (error) {
    return mapMobileGoalsError(error, 'update');
  }
}

/**
 * DELETE /api/mobile/goals?id=
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
    const { id } = goalDeleteInputSchema.parse({ id: searchParams.get('id') ?? '' });

    await deleteMobileGoal(user.id, id);
    return NextResponse.json(ok({ message: 'Goal deleted successfully' }), { status: 200 });
  } catch (error) {
    return mapMobileGoalsError(error, 'delete');
  }
}
