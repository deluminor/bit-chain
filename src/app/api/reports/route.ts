import { authOptions } from '@/features/auth/libs/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
  format,
} from 'date-fns';

async function findOrCreateUser(email: string) {
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        password: 'nextauth_user',
      },
    });

    await prisma.category.create({
      data: {
        name: 'solo',
        userId: user.id,
      },
    });
  }

  return user;
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await findOrCreateUser(session.user.email);
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const period = searchParams.get('period') || 'monthly';
    const format = searchParams.get('format') || 'json';

    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    // Calculate date range based on period
    switch (period) {
      case 'weekly':
        startDate = startOfWeek(now);
        endDate = endOfWeek(now);
        break;
      case 'monthly':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case 'yearly':
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        break;
      default:
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
    }

    // Generate different types of reports
    switch (type) {
      case 'income-expenses':
        return await generateIncomeExpensesReport(user.id, startDate, endDate, format);
      case 'category-analysis':
        return await generateCategoryAnalysisReport(user.id, startDate, endDate, format);
      case 'cash-flow':
        return await generateCashFlowReport(user.id, startDate, endDate, format);
      case 'budget-performance':
        return await generateBudgetPerformanceReport(user.id, startDate, endDate, format);
      case 'account-summary':
        return await generateAccountSummaryReport(user.id, startDate, endDate, format);
      case 'goal-progress':
        return await generateGoalProgressReport(user.id, startDate, endDate, format);
      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}

async function generateIncomeExpensesReport(
  userId: string,
  startDate: Date,
  endDate: Date,
  format: string,
) {
  const expenses = await prisma.expense.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      budgetCategory: {
        include: {
          category: true,
        },
      },
    },
  });

  // Calculate totals by type
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // For now, we'll use mock income data since there's no income model yet
  const mockIncome = totalExpenses * 1.3; // Assume 30% more income than expenses

  const report = {
    title: 'Income vs Expenses Report',
    period: `${format(startDate, 'MMM dd, yyyy')} - ${format(endDate, 'MMM dd, yyyy')}`,
    data: {
      totalIncome: mockIncome,
      totalExpenses,
      netSavings: mockIncome - totalExpenses,
      savingsRate: (((mockIncome - totalExpenses) / mockIncome) * 100).toFixed(1),
      expensesByCategory: expenses.reduce(
        (acc, expense) => {
          const categoryName = expense.budgetCategory?.category?.name || 'Uncategorized';
          acc[categoryName] = (acc[categoryName] || 0) + expense.amount;
          return acc;
        },
        {} as Record<string, number>,
      ),
    },
    generatedAt: new Date().toISOString(),
  };

  if (format === 'csv') {
    return generateCSVResponse(report, 'income-expenses');
  }

  return NextResponse.json(report);
}

async function generateCategoryAnalysisReport(
  userId: string,
  startDate: Date,
  endDate: Date,
  format: string,
) {
  const expenses = await prisma.expense.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      budgetCategory: {
        include: {
          category: true,
        },
      },
    },
  });

  const categoryData = expenses.reduce(
    (acc, expense) => {
      const categoryName = expense.budgetCategory?.category?.name || 'Uncategorized';
      if (!acc[categoryName]) {
        acc[categoryName] = {
          total: 0,
          count: 0,
          average: 0,
        };
      }
      acc[categoryName].total += expense.amount;
      acc[categoryName].count += 1;
      acc[categoryName].average = acc[categoryName].total / acc[categoryName].count;
      return acc;
    },
    {} as Record<string, { total: number; count: number; average: number }>,
  );

  const report = {
    title: 'Category Analysis Report',
    period: `${format(startDate, 'MMM dd, yyyy')} - ${format(endDate, 'MMM dd, yyyy')}`,
    data: {
      categories: categoryData,
      topCategory: Object.entries(categoryData).reduce(
        (max, [name, data]) => (data.total > max.total ? { name, ...data } : max),
        { name: '', total: 0, count: 0, average: 0 },
      ),
      totalTransactions: expenses.length,
    },
    generatedAt: new Date().toISOString(),
  };

  if (format === 'csv') {
    return generateCSVResponse(report, 'category-analysis');
  }

  return NextResponse.json(report);
}

async function generateCashFlowReport(
  userId: string,
  startDate: Date,
  endDate: Date,
  format: string,
) {
  const expenses = await prisma.expense.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      date: 'asc',
    },
  });

  const report = {
    title: 'Cash Flow Statement',
    period: `${format(startDate, 'MMM dd, yyyy')} - ${format(endDate, 'MMM dd, yyyy')}`,
    data: {
      dailyFlow: expenses.reduce(
        (acc, expense) => {
          const dateKey = format(new Date(expense.date), 'yyyy-MM-dd');
          acc[dateKey] = (acc[dateKey] || 0) + expense.amount;
          return acc;
        },
        {} as Record<string, number>,
      ),
      totalOutflow: expenses.reduce((sum, expense) => sum + expense.amount, 0),
    },
    generatedAt: new Date().toISOString(),
  };

  if (format === 'csv') {
    return generateCSVResponse(report, 'cash-flow');
  }

  return NextResponse.json(report);
}

async function generateBudgetPerformanceReport(
  userId: string,
  startDate: Date,
  endDate: Date,
  format: string,
) {
  const budgets = await prisma.budget.findMany({
    where: {
      userId,
      startDate: {
        lte: endDate,
      },
      endDate: {
        gte: startDate,
      },
    },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
  });

  const report = {
    title: 'Budget Performance Report',
    period: `${format(startDate, 'MMM dd, yyyy')} - ${format(endDate, 'MMM dd, yyyy')}`,
    data: {
      budgets: budgets.map(budget => ({
        name: budget.name,
        totalPlanned: budget.totalPlanned,
        totalActual: budget.totalActual,
        variance: budget.totalActual - budget.totalPlanned,
        performance:
          budget.totalPlanned > 0
            ? (((budget.totalPlanned - budget.totalActual) / budget.totalPlanned) * 100).toFixed(1)
            : 0,
      })),
      overallPerformance:
        budgets.length > 0
          ? (budgets.reduce((sum, b) => sum + (b.totalPlanned - b.totalActual), 0) /
              budgets.reduce((sum, b) => sum + b.totalPlanned, 1)) *
            100
          : 0,
    },
    generatedAt: new Date().toISOString(),
  };

  if (format === 'csv') {
    return generateCSVResponse(report, 'budget-performance');
  }

  return NextResponse.json(report);
}

async function generateAccountSummaryReport(
  userId: string,
  startDate: Date,
  endDate: Date,
  format: string,
) {
  const accounts = await prisma.account.findMany({
    where: { userId },
  });

  const report = {
    title: 'Account Summary Report',
    period: `${format(startDate, 'MMM dd, yyyy')} - ${format(endDate, 'MMM dd, yyyy')}`,
    data: {
      accounts: accounts.map(account => ({
        name: account.name,
        type: account.type,
        balance: account.balance,
        currency: account.currency,
      })),
      totalBalance: accounts.reduce((sum, account) => sum + account.balance, 0),
      accountCount: accounts.length,
    },
    generatedAt: new Date().toISOString(),
  };

  if (format === 'csv') {
    return generateCSVResponse(report, 'account-summary');
  }

  return NextResponse.json(report);
}

async function generateGoalProgressReport(
  userId: string,
  startDate: Date,
  endDate: Date,
  format: string,
) {
  const goals = await prisma.financialGoal.findMany({
    where: { userId },
  });

  const report = {
    title: 'Goal Progress Report',
    period: `${format(startDate, 'MMM dd, yyyy')} - ${format(endDate, 'MMM dd, yyyy')}`,
    data: {
      goals: goals.map(goal => ({
        name: goal.name,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        progress:
          goal.targetAmount > 0 ? ((goal.currentAmount / goal.targetAmount) * 100).toFixed(1) : 0,
        remaining: Math.max(goal.targetAmount - goal.currentAmount, 0),
        deadline: goal.deadline,
      })),
      totalTargets: goals.reduce((sum, goal) => sum + goal.targetAmount, 0),
      totalProgress: goals.reduce((sum, goal) => sum + goal.currentAmount, 0),
    },
    generatedAt: new Date().toISOString(),
  };

  if (format === 'csv') {
    return generateCSVResponse(report, 'goal-progress');
  }

  return NextResponse.json(report);
}

function generateCSVResponse(report: any, type: string) {
  let csvContent = '';

  switch (type) {
    case 'income-expenses':
      csvContent = 'Category,Amount\n';
      Object.entries(report.data.expensesByCategory).forEach(([category, amount]) => {
        csvContent += `"${category}",${amount}\n`;
      });
      break;
    case 'category-analysis':
      csvContent = 'Category,Total,Count,Average\n';
      Object.entries(report.data.categories).forEach(([category, data]: [string, any]) => {
        csvContent += `"${category}",${data.total},${data.count},${data.average.toFixed(2)}\n`;
      });
      break;
    case 'cash-flow':
      csvContent = 'Date,Amount\n';
      Object.entries(report.data.dailyFlow).forEach(([date, amount]) => {
        csvContent += `${date},${amount}\n`;
      });
      break;
    default:
      csvContent = 'No CSV format available for this report type\n';
  }

  return new Response(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${type}-report-${format(new Date(), 'yyyy-MM-dd')}.csv"`,
    },
  });
}
