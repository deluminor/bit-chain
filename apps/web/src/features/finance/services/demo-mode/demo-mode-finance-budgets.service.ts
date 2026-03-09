import { prisma } from '@/lib/prisma';
import { SUPPORTED_CURRENCIES } from '@/lib/currency';
import { DEMO_BUDGETS_COUNT } from './demo-mode.constants';

function plannedBudgetForCurrency(currency: string): number {
  switch (currency) {
    case 'EUR':
      return 2300;
    case 'USD':
      return 2500;
    case 'UAH':
      return 100000;
    case 'HUF':
      return 1000000;
    default:
      return 2500;
  }
}

function randomBudgetCategoryAmounts(currency: string): { planned: number; actual: number } {
  switch (currency) {
    case 'EUR':
      return { planned: Math.random() * 370 + 90, actual: Math.random() * 420 + 45 };
    case 'USD':
      return { planned: Math.random() * 400 + 100, actual: Math.random() * 450 + 50 };
    case 'UAH':
      return { planned: Math.random() * 16000 + 4000, actual: Math.random() * 18000 + 2000 };
    case 'HUF':
      return { planned: Math.random() * 160000 + 40000, actual: Math.random() * 180000 + 20000 };
    default:
      return { planned: Math.random() * 400 + 100, actual: Math.random() * 450 + 50 };
  }
}

export async function ensureDemoBudgets(
  userId: string,
  expenseCategoryIds: string[],
): Promise<void> {
  const currencies = Object.keys(SUPPORTED_CURRENCIES);

  const existing = await prisma.budget.findMany({
    where: { userId, isDemo: true },
    select: { name: true },
  });
  const existingNames = new Set(existing.map(budget => budget.name));

  for (let index = 0; index < DEMO_BUDGETS_COUNT; index++) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - index);
    startDate.setDate(1);

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);

    const currency = currencies[index % currencies.length] || 'EUR';
    const name = `Budget ${startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} (${currency})`;

    if (existingNames.has(name)) {
      continue;
    }

    const budget = await prisma.budget.create({
      data: {
        userId,
        name,
        period: 'MONTHLY',
        startDate,
        endDate,
        currency,
        totalPlanned: plannedBudgetForCurrency(currency),
        isDemo: true,
      },
      select: { id: true },
    });

    const categories = expenseCategoryIds.slice(0, 6).map(categoryId => {
      const { planned, actual } = randomBudgetCategoryAmounts(currency);
      return {
        budgetId: budget.id,
        categoryId,
        planned: Math.round(planned * 100) / 100,
        actual: Math.round(actual * 100) / 100,
      };
    });

    if (categories.length > 0) {
      await prisma.budgetCategory.createMany({ data: categories });
    }
  }
}
