import { prisma } from '@/lib/prisma';
import { DEMO_BUDGETS_COUNT } from './demo-mode.constants';
import type { DemoFinanceResult } from './demo-mode.types';
import { ensureDemoFinanceAccounts } from './demo-mode-finance-accounts.service';
import { ensureDemoBudgets } from './demo-mode-finance-budgets.service';
import { ensureDemoFinanceCategories } from './demo-mode-finance-categories.service';
import { ensureDemoGoals } from './demo-mode-finance-goals.service';
import { generateDemoFinanceTransactions } from './demo-mode-finance-transactions.service';
import { validateDemoUserId } from './demo-mode.utils';

export async function generateDemoFinanceData(userId: string): Promise<DemoFinanceResult> {
  validateDemoUserId(userId);

  const accounts = await ensureDemoFinanceAccounts(userId);
  const categories = await ensureDemoFinanceCategories(userId);
  const transactions = await generateDemoFinanceTransactions(userId, accounts, categories);

  const expenseCategoryIds = categories
    .filter(category => category.type === 'EXPENSE')
    .map(category => category.id);

  await ensureDemoBudgets(userId, expenseCategoryIds);
  const goals = await ensureDemoGoals(userId);

  return {
    accounts: accounts.length,
    categories: categories.length,
    transactions,
    budgets: DEMO_BUDGETS_COUNT,
    goals,
  };
}

export async function removeDemoFinanceData(userId: string): Promise<void> {
  validateDemoUserId(userId);

  await prisma.budgetCategory.deleteMany({
    where: {
      budget: {
        userId,
        isDemo: true,
      },
    },
  });

  await prisma.budget.deleteMany({ where: { userId, isDemo: true } });
  await prisma.transaction.deleteMany({ where: { userId, isDemo: true } });
  await prisma.transactionCategory.deleteMany({ where: { userId, isDemo: true } });
  await prisma.financialGoal.deleteMany({ where: { userId, isDemo: true } });
  await prisma.financeAccount.deleteMany({ where: { userId, isDemo: true } });
}
