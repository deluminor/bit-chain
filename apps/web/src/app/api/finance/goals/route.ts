import { authOptions } from '@/features/auth/libs/auth';
import { findOrCreateFinanceUserByEmail } from '@/features/finance/services/finance-user.service';
import {
  createWebGoalInputSchema,
  goalDeleteInputSchema,
  updateWebGoalInputSchema,
} from '@/features/finance/services/goals/goal-domain.schemas';
import {
  createWebGoal,
  deleteWebGoal,
  GoalDomainError,
  listWebGoals,
  updateWebGoal,
} from '@/features/finance/services/goals/goal-domain.service';
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

function mapWebGoalsError(error: unknown, action: string): NextResponse {
  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
  }

  if (error instanceof GoalDomainError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  console.error(`[finance/goals] ${action} error:`, error);
  return NextResponse.json({ error: `Failed to ${action} goals` }, { status: 500 });
}

export async function GET() {
  try {
    const userId = await getAuthenticatedFinanceUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await listWebGoals(userId);
    return NextResponse.json(payload);
  } catch (error) {
    return mapWebGoalsError(error, 'fetch');
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedFinanceUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const input = createWebGoalInputSchema.parse(body);
    const goal = await createWebGoal(userId, input);

    return NextResponse.json({ goal }, { status: 201 });
  } catch (error) {
    return mapWebGoalsError(error, 'create');
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getAuthenticatedFinanceUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const input = updateWebGoalInputSchema.parse(body);
    const goal = await updateWebGoal(userId, input);

    return NextResponse.json({ goal });
  } catch (error) {
    return mapWebGoalsError(error, 'update');
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getAuthenticatedFinanceUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const { id } = goalDeleteInputSchema.parse({ id: searchParams.get('id') ?? '' });

    await deleteWebGoal(userId, id);
    return NextResponse.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    return mapWebGoalsError(error, 'delete');
  }
}
