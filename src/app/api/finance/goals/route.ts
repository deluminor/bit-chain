import { authOptions } from '@/features/auth/libs/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { currencyService, BASE_CURRENCY } from '@/lib/currency';

async function findOrCreateUser(email: string) {
  let user = await prisma.user.findUnique({
    where: { email },
  });

  // Create user if not exists (for NextAuth users)
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        password: 'nextauth_user', // Placeholder for NextAuth users
      },
    });

    // Create default category for new user
    await prisma.category.create({
      data: {
        name: 'solo',
        userId: user.id,
      },
    });
  }

  return user;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await findOrCreateUser(session.user.email);

    const goals = await prisma.financialGoal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate summary with currency conversion to base currency (EUR)
    let totalTargetInBase = 0;
    let totalCurrentInBase = 0;

    // Convert all amounts to base currency for proper summary calculation
    for (const goal of goals) {
      try {
        if (goal.currency === BASE_CURRENCY) {
          // No conversion needed for base currency
          totalTargetInBase += goal.targetAmount;
          totalCurrentInBase += goal.currentAmount;
        } else {
          // Convert to base currency
          const targetInBase = await currencyService.convertToBaseCurrency(
            goal.targetAmount,
            goal.currency,
          );
          const currentInBase = await currencyService.convertToBaseCurrency(
            goal.currentAmount,
            goal.currency,
          );
          totalTargetInBase += targetInBase;
          totalCurrentInBase += currentInBase;
        }
      } catch (error) {
        console.warn(`Failed to convert currency for goal ${goal.id}:`, error);
        // Fallback: treat as base currency if conversion fails
        totalTargetInBase += goal.targetAmount;
        totalCurrentInBase += goal.currentAmount;
      }
    }

    const summary = {
      total: goals.length,
      active: goals.filter(g => g.isActive).length,
      totalTarget: totalTargetInBase,
      totalCurrent: totalCurrentInBase,
      completed: goals.filter(g => g.currentAmount >= g.targetAmount).length,
    };

    return NextResponse.json({ goals, summary });
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await findOrCreateUser(session.user.email);
    const data = await request.json();

    const {
      name,
      description,
      targetAmount,
      currentAmount = 0,
      currency = 'UAH',
      deadline,
      color = '#10B981',
      icon = '🎯',
    } = data;

    // Validate required fields
    if (!name || !targetAmount) {
      return NextResponse.json(
        { error: 'Missing required fields: name, targetAmount' },
        { status: 400 },
      );
    }

    if (parseFloat(targetAmount) <= 0) {
      return NextResponse.json({ error: 'Target amount must be positive' }, { status: 400 });
    }

    // Create the goal
    const goal = await prisma.financialGoal.create({
      data: {
        userId: user.id,
        name,
        description: description || null,
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount) || 0,
        currency,
        deadline: deadline ? new Date(deadline) : null,
        color,
        icon,
        isActive: true,
      },
    });

    return NextResponse.json({ goal });
  } catch (error: any) {
    console.error('Error creating goal:', error);
    return NextResponse.json({ error: error.message || 'Failed to create goal' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await findOrCreateUser(session.user.email);
    const data = await request.json();

    const {
      id,
      name,
      description,
      targetAmount,
      currentAmount,
      currency,
      deadline,
      color,
      icon,
      isActive,
    } = data;

    if (!id) {
      return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 });
    }

    // Verify goal ownership
    const existingGoal = await prisma.financialGoal.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingGoal) {
      return NextResponse.json({ error: 'Goal not found or access denied' }, { status: 404 });
    }

    // Validate amounts if provided
    if (targetAmount !== undefined && parseFloat(targetAmount) <= 0) {
      return NextResponse.json({ error: 'Target amount must be positive' }, { status: 400 });
    }

    if (currentAmount !== undefined && parseFloat(currentAmount) < 0) {
      return NextResponse.json({ error: 'Current amount cannot be negative' }, { status: 400 });
    }

    // Update the goal
    const updatedGoal = await prisma.financialGoal.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(targetAmount !== undefined && { targetAmount: parseFloat(targetAmount) }),
        ...(currentAmount !== undefined && { currentAmount: parseFloat(currentAmount) }),
        ...(currency && { currency }),
        ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
        ...(color && { color }),
        ...(icon && { icon }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ goal: updatedGoal });
  } catch (error: any) {
    console.error('Error updating goal:', error);
    return NextResponse.json({ error: error.message || 'Failed to update goal' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await findOrCreateUser(session.user.email);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 });
    }

    // Verify goal ownership
    const existingGoal = await prisma.financialGoal.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingGoal) {
      return NextResponse.json({ error: 'Goal not found or access denied' }, { status: 404 });
    }

    // Delete the goal
    await prisma.financialGoal.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Goal deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting goal:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete goal' }, { status: 500 });
  }
}
