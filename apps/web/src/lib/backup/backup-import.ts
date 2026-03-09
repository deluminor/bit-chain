import { prisma } from '@/lib/prisma';
import type { BackupData } from '@/types/backup';

type TransactionClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

async function upsertMany<T>(
  items: readonly T[],
  upsertFn: (item: T) => Promise<unknown>,
): Promise<void> {
  for (const item of items) {
    await upsertFn(item);
  }
}

async function clearExistingData(tx: TransactionClient, userId?: string): Promise<void> {
  if (userId) {
    await tx.screenshot.deleteMany({ where: { trade: { userId } } });
    await tx.budgetCategory.deleteMany({ where: { budget: { userId } } });
    await tx.transaction.deleteMany({ where: { userId } });
    await tx.trade.deleteMany({ where: { userId } });
    await tx.budget.deleteMany({ where: { userId } });
    await tx.financialGoal.deleteMany({ where: { userId } });
    await tx.financeAccount.deleteMany({ where: { userId } });
    await tx.transactionCategory.deleteMany({ where: { userId } });
    await tx.loan.deleteMany({ where: { userId } });
    await tx.category.deleteMany({ where: { userId } });
    return;
  }

  await tx.screenshot.deleteMany();
  await tx.budgetCategory.deleteMany();
  await tx.transaction.deleteMany();
  await tx.trade.deleteMany();
  await tx.budget.deleteMany();
  await tx.financialGoal.deleteMany();
  await tx.financeAccount.deleteMany();
  await tx.transactionCategory.deleteMany();
  await tx.loan.deleteMany();
  await tx.category.deleteMany();
  await tx.user.deleteMany();
}

export async function importData(
  backupData: BackupData,
  options: { overwrite?: boolean; userId?: string } = {},
): Promise<void> {
  const { overwrite = false, userId } = options;

  await prisma.$transaction(async tx => {
    if (overwrite) {
      await clearExistingData(tx, userId);
    }

    if (!userId) {
      await upsertMany(backupData.users, user =>
        tx.user.upsert({ where: { id: user.id }, update: user, create: user }),
      );
    }

    const categoriesToImport = userId
      ? backupData.categories.filter(category => category.userId === userId)
      : backupData.categories;
    await upsertMany(categoriesToImport, category =>
      tx.category.upsert({ where: { id: category.id }, update: category, create: category }),
    );

    const tradesToImport = userId
      ? backupData.trades.filter(trade => trade.userId === userId)
      : backupData.trades;
    await upsertMany(tradesToImport, trade =>
      tx.trade.upsert({ where: { id: trade.id }, update: trade, create: trade }),
    );

    if (backupData.screenshots?.length) {
      const userTradeIds = new Set(tradesToImport.map(trade => trade.id));
      const screenshotsToImport = userId
        ? backupData.screenshots.filter(screenshot => userTradeIds.has(screenshot.tradeId))
        : backupData.screenshots;

      await upsertMany(screenshotsToImport, screenshot =>
        tx.screenshot.upsert({
          where: { id: screenshot.id },
          update: screenshot,
          create: screenshot,
        }),
      );
    }

    const financeAccountsToImport = userId
      ? backupData.financeAccounts.filter(account => account.userId === userId)
      : backupData.financeAccounts;
    await upsertMany(financeAccountsToImport, account =>
      tx.financeAccount.upsert({ where: { id: account.id }, update: account, create: account }),
    );

    const transactionCategoriesToImport = userId
      ? backupData.transactionCategories.filter(category => category.userId === userId)
      : backupData.transactionCategories;
    await upsertMany(transactionCategoriesToImport, category =>
      tx.transactionCategory.upsert({
        where: { id: category.id },
        update: category,
        create: category,
      }),
    );

    const transactionsToImport = userId
      ? backupData.transactions.filter(transaction => transaction.userId === userId)
      : backupData.transactions;
    await upsertMany(transactionsToImport, transaction =>
      tx.transaction.upsert({
        where: { id: transaction.id },
        update: transaction,
        create: transaction,
      }),
    );

    const budgetsToImport = userId
      ? backupData.budgets.filter(budget => budget.userId === userId)
      : backupData.budgets;
    await upsertMany(budgetsToImport, budget =>
      tx.budget.upsert({ where: { id: budget.id }, update: budget, create: budget }),
    );

    const userBudgetIds = new Set(budgetsToImport.map(budget => budget.id));
    const budgetCategoriesToImport = userId
      ? backupData.budgetCategories.filter(budgetCategory =>
          userBudgetIds.has(budgetCategory.budgetId),
        )
      : backupData.budgetCategories;
    await upsertMany(budgetCategoriesToImport, budgetCategory =>
      tx.budgetCategory.upsert({
        where: { id: budgetCategory.id },
        update: budgetCategory,
        create: budgetCategory,
      }),
    );

    const financialGoalsToImport = userId
      ? backupData.financialGoals.filter(goal => goal.userId === userId)
      : backupData.financialGoals;
    await upsertMany(financialGoalsToImport, goal =>
      tx.financialGoal.upsert({ where: { id: goal.id }, update: goal, create: goal }),
    );

    const loansToImport = userId
      ? (backupData.loans || []).filter(loan => loan.userId === userId)
      : backupData.loans || [];
    await upsertMany(loansToImport, loan =>
      tx.loan.upsert({ where: { id: loan.id }, update: loan, create: loan }),
    );
  });
}
