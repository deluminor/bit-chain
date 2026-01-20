import { authOptions } from '@/features/auth/libs/auth';
import { convertToBaseCurrencySafe } from '@/lib/currency';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

interface BudgetCategoryInput {
  categoryId: string;
  planned: string;
}

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

    // Calculate actual spending for each budget category
    const budgetsWithActual = await Promise.all(
      budgets.map(async budget => {
        const categoriesWithActual = await Promise.all(
          budget.categories.map(async budgetCategory => {
            // Get transactions for this category within budget period
            const transactions = await prisma.transaction.findMany({
              where: {
                userId: user.id,
                categoryId: budgetCategory.categoryId,
                type: 'EXPENSE',
                date: {
                  gte: budget.startDate,
                  lte: budget.endDate,
                },
              },
            });

            const actualSpending = transactions.reduce((sum, transaction) => {
              return sum + transaction.amount;
            }, 0);

            const convertedTransactions = await Promise.all(
              transactions.map(transaction =>
                convertToBaseCurrencySafe(transaction.amount, transaction.currency),
              ),
            );

            const actualSpendingBase = convertedTransactions.reduce(
              (sum, amount) => sum + amount,
              0,
            );

            const plannedBase = await convertToBaseCurrencySafe(
              budgetCategory.planned,
              budget.currency,
            );

            return {
              ...budgetCategory,
              actual: actualSpending,
              actualBase: actualSpendingBase,
              plannedBase,
            };
          }),
        );

        const totalActual = categoriesWithActual.reduce((sum, cat) => sum + cat.actual, 0);

        const totalActualBase = categoriesWithActual.reduce(
          (sum, cat) => sum + (cat.actualBase ?? 0),
          0,
        );

        const totalPlannedBase = await convertToBaseCurrencySafe(
          budget.totalPlanned,
          budget.currency,
        );

        return {
          ...budget,
          totalActual,
          totalActualBase,
          totalPlannedBase,
          categories: categoriesWithActual,
        };
      }),
    );

    // Calculate summary
    const totalPlannedBase = budgetsWithActual.reduce(
      (sum, budget) => sum + (budget.totalPlannedBase ?? 0),
      0,
    );

    const totalActualBase = budgetsWithActual.reduce(
      (sum, budget) => sum + (budget.totalActualBase ?? 0),
      0,
    );

    const summary = {
      total: budgetsWithActual.length,
      active: budgetsWithActual.filter(b => b.isActive).length,
      totalPlanned: totalPlannedBase,
      totalActual: totalActualBase,
      totalPlannedBase,
      totalActualBase,
    };

    return NextResponse.json({ budgets: budgetsWithActual, summary });
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

    const {
      name,
      period,
      startDate,
      endDate,
      currency = 'UAH',
      totalPlanned,
      categories,
      isTemplate = false,
      templateName,
      autoApply = false,
    } = data;

    // Validate required fields
    if (!name || !period || !startDate || !endDate || !totalPlanned) {
      return NextResponse.json(
        { error: 'Missing required fields: name, period, startDate, endDate, totalPlanned' },
        { status: 400 },
      );
    }

    // Check if budget with same name already exists for this user
    const existingBudget = await prisma.budget.findFirst({
      where: {
        userId: user.id,
        name: name,
      },
    });

    if (existingBudget) {
      return NextResponse.json(
        { error: 'A budget with this name already exists. Please choose a different name.' },
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
        isTemplate,
        templateName,
        autoApply,
      },
    });

    // Create budget categories if provided
    if (categories && Array.isArray(categories) && categories.length > 0) {
      const budgetCategories = categories.map((cat: BudgetCategoryInput) => ({
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
  } catch (error: unknown) {
    console.error('Error creating budget:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create budget';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
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
      period,
      startDate,
      endDate,
      currency,
      totalPlanned,
      isActive,
      categories,
      isTemplate,
      templateName,
      autoApply,
    } = data;

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

    // Check if name is being changed and if new name already exists
    if (name && name !== existingBudget.name) {
      const nameExists = await prisma.budget.findFirst({
        where: {
          userId: user.id,
          name: name,
          id: { not: id }, // Exclude current budget
        },
      });

      if (nameExists) {
        return NextResponse.json(
          { error: 'A budget with this name already exists. Please choose a different name.' },
          { status: 400 },
        );
      }
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
        ...(isTemplate !== undefined && { isTemplate }),
        ...(templateName !== undefined && { templateName }),
        ...(autoApply !== undefined && { autoApply }),
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
        const budgetCategories = categories.map((cat: BudgetCategoryInput) => ({
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
  } catch (error: unknown) {
    console.error('Error updating budget:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update budget';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
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
  } catch (error: unknown) {
    console.error('Error deleting budget:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete budget';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
