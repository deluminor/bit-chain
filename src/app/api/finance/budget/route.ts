import { authOptions } from '@/features/auth/libs/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

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

    const budgets = await prisma.budget.findMany({
      where: { userId: user.id },
      include: {
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                type: true,
                color: true,
                icon: true,
              },
            },
          },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    // Calculate summary
    const summary = {
      total: budgets.length,
      active: budgets.filter(b => b.isActive).length,
      totalPlanned: budgets.reduce((sum, b) => sum + b.totalPlanned, 0),
      totalActual: budgets.reduce((sum, b) => sum + b.totalActual, 0),
    };

    return NextResponse.json({ budgets, summary });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
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

    const { name, period, startDate, endDate, currency = 'UAH', totalPlanned, categories } = data;

    // Validate required fields
    if (!name || !period || !startDate || !endDate || !totalPlanned) {
      return NextResponse.json(
        { error: 'Missing required fields: name, period, startDate, endDate, totalPlanned' },
        { status: 400 },
      );
    }

    // Create the budget
    const budget = await prisma.budget.create({
      data: {
        userId: user.id,
        name,
        period,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        currency,
        totalPlanned: parseFloat(totalPlanned),
        isActive: true,
      },
    });

    // Create budget categories if provided
    if (categories && Array.isArray(categories) && categories.length > 0) {
      const budgetCategories = categories.map((cat: any) => ({
        budgetId: budget.id,
        categoryId: cat.categoryId,
        planned: parseFloat(cat.planned),
      }));

      await prisma.budgetCategory.createMany({
        data: budgetCategories,
      });
    }

    // Fetch the created budget with categories
    const createdBudget = await prisma.budget.findUnique({
      where: { id: budget.id },
      include: {
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                type: true,
                color: true,
                icon: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ budget: createdBudget });
  } catch (error: any) {
    console.error('Error creating budget:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create budget' },
      { status: 500 },
    );
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

    const { id, name, period, startDate, endDate, currency, totalPlanned, isActive, categories } =
      data;

    // Verify budget ownership
    const existingBudget = await prisma.budget.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingBudget) {
      return NextResponse.json({ error: 'Budget not found or access denied' }, { status: 404 });
    }

    // Update the budget
    const _updatedBudget = await prisma.budget.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(period && { period }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(currency && { currency }),
        ...(totalPlanned !== undefined && { totalPlanned: parseFloat(totalPlanned) }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    // Update budget categories if provided
    if (categories && Array.isArray(categories)) {
      // Remove existing categories
      await prisma.budgetCategory.deleteMany({
        where: { budgetId: id },
      });

      // Add new categories
      if (categories.length > 0) {
        const budgetCategories = categories.map((cat: any) => ({
          budgetId: id,
          categoryId: cat.categoryId,
          planned: parseFloat(cat.planned),
        }));

        await prisma.budgetCategory.createMany({
          data: budgetCategories,
        });
      }
    }

    // Fetch the updated budget with categories
    const budget = await prisma.budget.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                type: true,
                color: true,
                icon: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ budget });
  } catch (error: any) {
    console.error('Error updating budget:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update budget' },
      { status: 500 },
    );
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
      return NextResponse.json({ error: 'Budget ID is required' }, { status: 400 });
    }

    // Verify budget ownership
    const existingBudget = await prisma.budget.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingBudget) {
      return NextResponse.json({ error: 'Budget not found or access denied' }, { status: 404 });
    }

    // Delete the budget (cascade will handle budget categories)
    await prisma.budget.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Budget deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting budget:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete budget' },
      { status: 500 },
    );
  }
}
