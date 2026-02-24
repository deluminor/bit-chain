import { convertToBaseCurrencySafe } from '@/lib/currency';
import { getMobileUser } from '@/lib/mobile-auth';
import { prisma } from '@/lib/prisma';
import { err, ok } from '@bit-chain/api-contracts';
import { NextRequest, NextResponse } from 'next/server';

interface BudgetCategoryInput {
  categoryId: string;
  planned: string | number;
}

export async function GET(request: NextRequest) {
  let user: { id: string; email: string };

  try {
    user = await getMobileUser(request);
  } catch {
    return NextResponse.json(err('UNAUTHORIZED', 'Invalid or missing access token'), {
      status: 401,
    });
  }

  try {
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
            const startDate = new Date(budget.startDate);
            const endDate = new Date(budget.endDate);

            if (budget.period === 'MONTHLY') {
              startDate.setDate(1);
            }

            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);

            const transactions = await prisma.transaction.findMany({
              where: {
                userId: user.id,
                categoryId: budgetCategory.categoryId,
                type: 'EXPENSE',
                date: {
                  gte: startDate,
                  lte: endDate,
                },
              },
            });

            const actualSpending = Math.abs(
              transactions.reduce((sum, transaction) => {
                return sum + transaction.amount;
              }, 0),
            );

            const convertedTransactions = await Promise.all(
              transactions.map(transaction =>
                convertToBaseCurrencySafe(transaction.amount, transaction.currency),
              ),
            );

            const actualSpendingBase = Math.abs(
              convertedTransactions.reduce((sum, amount) => sum + amount, 0),
            );

            const plannedBase = await convertToBaseCurrencySafe(
              budgetCategory.planned,
              budget.currency,
            );

            // Create a default icon for categories lacking it for backwards compatibility with schema
            return {
              ...budgetCategory,
              actual: actualSpending,
              actualBase: actualSpendingBase,
              plannedBase,
              category: {
                ...budgetCategory.category,
                isDefault: false,
                transactionCount: transactions.length,
              },
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

    return NextResponse.json(ok({ budgets: budgetsWithActual, summary }), { status: 200 });
  } catch (error) {
    console.error('[mobile/budget] Error fetching budgets:', error);
    return NextResponse.json(err('INTERNAL_ERROR', 'Failed to fetch budgets'), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  let user: { id: string; email: string };

  try {
    user = await getMobileUser(request);
  } catch {
    return NextResponse.json(err('UNAUTHORIZED', 'Invalid or missing access token'), {
      status: 401,
    });
  }

  try {
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

    if (!name || !period || !startDate || !endDate || totalPlanned === undefined) {
      return NextResponse.json(
        err(
          'VALIDATION_ERROR',
          'Missing required fields: name, period, startDate, endDate, totalPlanned',
        ),
        { status: 400 },
      );
    }

    const existingBudget = await prisma.budget.findFirst({
      where: {
        userId: user.id,
        name: name,
      },
    });

    if (existingBudget) {
      return NextResponse.json(
        err(
          'VALIDATION_ERROR',
          'A budget with this name already exists. Please choose a different name.',
        ),
        { status: 400 },
      );
    }

    const budget = await prisma.budget.create({
      data: {
        userId: user.id,
        name,
        period,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        currency,
        totalPlanned: parseFloat(totalPlanned.toString()),
        isActive: true,
        isTemplate,
        templateName,
        autoApply,
      },
    });

    if (categories && Array.isArray(categories) && categories.length > 0) {
      const budgetCategories = categories.map((cat: BudgetCategoryInput) => ({
        budgetId: budget.id,
        categoryId: cat.categoryId,
        planned: parseFloat(cat.planned.toString()),
      }));

      await prisma.budgetCategory.createMany({
        data: budgetCategories,
      });
    }

    const createdBudget = await prisma.budget.findUnique({
      where: { id: budget.id },
      include: {
        categories: {
          include: {
            category: { select: { id: true, name: true, type: true, color: true } },
          },
        },
      },
    });

    return NextResponse.json(ok({ budget: createdBudget }), { status: 201 });
  } catch (error) {
    console.error('[mobile/budget] Error creating budget:', error);
    return NextResponse.json(err('INTERNAL_ERROR', 'Failed to create budget'), { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  let user: { id: string; email: string };

  try {
    user = await getMobileUser(request);
  } catch {
    return NextResponse.json(err('UNAUTHORIZED', 'Invalid or missing access token'), {
      status: 401,
    });
  }

  try {
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

    const existingBudget = await prisma.budget.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingBudget) {
      return NextResponse.json(err('NOT_FOUND', 'Budget not found or access denied'), {
        status: 404,
      });
    }

    if (name && name !== existingBudget.name) {
      const nameExists = await prisma.budget.findFirst({
        where: { userId: user.id, name: name, id: { not: id } },
      });

      if (nameExists) {
        return NextResponse.json(
          err(
            'VALIDATION_ERROR',
            'A budget with this name already exists. Please choose a different name.',
          ),
          { status: 400 },
        );
      }
    }

    await prisma.budget.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(period && { period }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(currency && { currency }),
        ...(totalPlanned !== undefined && { totalPlanned: parseFloat(totalPlanned.toString()) }),
        ...(isActive !== undefined && { isActive }),
        ...(isTemplate !== undefined && { isTemplate }),
        ...(templateName !== undefined && { templateName }),
        ...(autoApply !== undefined && { autoApply }),
      },
    });

    if (categories && Array.isArray(categories)) {
      await prisma.budgetCategory.deleteMany({
        where: { budgetId: id },
      });

      if (categories.length > 0) {
        const budgetCategories = categories.map((cat: BudgetCategoryInput) => ({
          budgetId: id,
          categoryId: cat.categoryId,
          planned: parseFloat(cat.planned.toString()),
        }));

        await prisma.budgetCategory.createMany({
          data: budgetCategories,
        });
      }
    }

    const budget = await prisma.budget.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            category: { select: { id: true, name: true, type: true, color: true } },
          },
        },
      },
    });

    return NextResponse.json(ok({ budget }), { status: 200 });
  } catch (error) {
    console.error('[mobile/budget] Error updating budget:', error);
    return NextResponse.json(err('INTERNAL_ERROR', 'Failed to update budget'), { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
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
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(err('VALIDATION_ERROR', 'Budget ID is required'), { status: 400 });
    }

    const existingBudget = await prisma.budget.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingBudget) {
      return NextResponse.json(err('NOT_FOUND', 'Budget not found or access denied'), {
        status: 404,
      });
    }

    await prisma.budget.delete({
      where: { id },
    });

    return NextResponse.json(ok({ message: 'Budget deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('[mobile/budget] Error deleting budget:', error);
    return NextResponse.json(err('INTERNAL_ERROR', 'Failed to delete budget'), { status: 500 });
  }
}
