import { prisma } from '@/lib/prisma';
import type { BackupData, BackupOptions } from '@/types/backup';
import { BACKUP_VERSION } from './backup.constants';

type BackupScreenshot = Awaited<ReturnType<typeof prisma.screenshot.findMany>>[number];

export async function exportAllData(options: BackupOptions = {}): Promise<BackupData> {
  const { includeScreenshots = true, userId } = options;

  const users = userId
    ? await prisma.user.findMany({ where: { id: userId } })
    : await prisma.user.findMany();

  const categories = userId
    ? await prisma.category.findMany({ where: { userId } })
    : await prisma.category.findMany();

  const trades = userId
    ? await prisma.trade.findMany({ where: { userId } })
    : await prisma.trade.findMany();

  let screenshots: BackupScreenshot[] = [];
  if (includeScreenshots) {
    screenshots = userId
      ? await prisma.screenshot.findMany({ where: { trade: { userId } } })
      : await prisma.screenshot.findMany();
  }

  const financeAccounts = userId
    ? await prisma.financeAccount.findMany({ where: { userId } })
    : await prisma.financeAccount.findMany();

  const transactions = userId
    ? await prisma.transaction.findMany({ where: { userId } })
    : await prisma.transaction.findMany();

  const transactionCategories = userId
    ? await prisma.transactionCategory.findMany({ where: { userId } })
    : await prisma.transactionCategory.findMany();

  const budgets = userId
    ? await prisma.budget.findMany({ where: { userId } })
    : await prisma.budget.findMany();

  const budgetCategories = userId
    ? await prisma.budgetCategory.findMany({ where: { budget: { userId } } })
    : await prisma.budgetCategory.findMany();

  const financialGoals = userId
    ? await prisma.financialGoal.findMany({ where: { userId } })
    : await prisma.financialGoal.findMany();

  const loans = userId
    ? await prisma.loan.findMany({ where: { userId } })
    : await prisma.loan.findMany();

  const totalRecords =
    users.length +
    categories.length +
    trades.length +
    screenshots.length +
    financeAccounts.length +
    transactions.length +
    transactionCategories.length +
    budgets.length +
    budgetCategories.length +
    financialGoals.length +
    loans.length;

  return {
    users,
    categories,
    trades,
    screenshots,
    financeAccounts,
    transactions,
    transactionCategories,
    budgets,
    budgetCategories,
    financialGoals,
    loans,
    metadata: {
      version: BACKUP_VERSION,
      timestamp: new Date().toISOString(),
      totalRecords,
    },
  };
}
