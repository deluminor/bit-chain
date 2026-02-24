import { Prisma, PrismaClient } from '@/generated/prisma';
import { BackupData, BackupOptions } from '@/types/backup';

const prisma = new PrismaClient();

/**
 * Service for database backup operations.
 * Stores backups as JSON in PostgreSQL instead of the filesystem,
 * making it compatible with serverless deployments (Vercel).
 */
export class BackupService {
  private static readonly BACKUP_VERSION = '1.1.0';

  /**
   * Export all user data from the database.
   *
   * @param options - Export options including userId filter and screenshot inclusion
   * @returns Complete backup data object with metadata
   */
  static async exportAllData(options: BackupOptions = {}): Promise<BackupData> {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let screenshots: any[] = [];
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
        version: this.BACKUP_VERSION,
        timestamp: new Date().toISOString(),
        totalRecords,
      },
    };
  }

  /**
   * Save backup data to the database.
   *
   * @param data - Backup data to save
   * @param filename - Backup filename identifier
   * @param userId - Owner of the backup
   * @returns The filename of the saved backup
   */
  static async saveBackupToDb(data: BackupData, filename: string, userId: string): Promise<string> {
    const jsonString = JSON.stringify(data);
    const size = Buffer.byteLength(jsonString, 'utf-8');

    await prisma.backup.upsert({
      where: { userId_filename: { userId, filename } },
      update: { data: data as unknown as Prisma.InputJsonValue, size },
      create: { userId, filename, data: data as unknown as Prisma.InputJsonValue, size },
    });

    return filename;
  }

  /**
   * Load backup data from the database.
   *
   * @param filename - Backup filename identifier
   * @param userId - Owner of the backup
   * @returns Parsed backup data
   * @throws {Error} If backup not found or invalid structure
   */
  static async loadBackupFromDb(filename: string, userId: string): Promise<BackupData> {
    const backup = await prisma.backup.findUnique({
      where: { userId_filename: { userId, filename } },
    });

    if (!backup) {
      throw new Error(`Backup not found: ${filename}`);
    }

    const backupData = backup.data as unknown as BackupData;

    if (!backupData.metadata || !backupData.users || !backupData.categories || !backupData.trades) {
      throw new Error('Invalid backup file structure');
    }

    if (!backupData.financeAccounts) backupData.financeAccounts = [];
    if (!backupData.transactions) backupData.transactions = [];
    if (!backupData.transactionCategories) backupData.transactionCategories = [];
    if (!backupData.budgets) backupData.budgets = [];
    if (!backupData.budgetCategories) backupData.budgetCategories = [];
    if (!backupData.financialGoals) backupData.financialGoals = [];
    if (!backupData.loans) backupData.loans = [];

    return backupData;
  }

  /**
   * Import backup data into the database, optionally overwriting existing data.
   *
   * @param backupData - Data to import
   * @param options - Import options (overwrite flag and userId scope)
   */
  static async importData(
    backupData: BackupData,
    options: { overwrite?: boolean; userId?: string } = {},
  ): Promise<void> {
    const { overwrite = false, userId } = options;

    await prisma.$transaction(async tx => {
      if (overwrite && userId) {
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
      } else if (overwrite) {
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

      if (!userId) {
        for (const user of backupData.users) {
          await tx.user.upsert({ where: { id: user.id }, update: user, create: user });
        }
      }

      const categoriesToImport = userId
        ? backupData.categories.filter(cat => cat.userId === userId)
        : backupData.categories;
      for (const category of categoriesToImport) {
        await tx.category.upsert({
          where: { id: category.id },
          update: category,
          create: category,
        });
      }

      const tradesToImport = userId
        ? backupData.trades.filter(trade => trade.userId === userId)
        : backupData.trades;
      for (const trade of tradesToImport) {
        await tx.trade.upsert({ where: { id: trade.id }, update: trade, create: trade });
      }

      if (backupData.screenshots?.length) {
        const userTradeIds = new Set(tradesToImport.map(t => t.id));
        const screenshotsToImport = userId
          ? backupData.screenshots.filter(s => userTradeIds.has(s.tradeId))
          : backupData.screenshots;
        for (const screenshot of screenshotsToImport) {
          await tx.screenshot.upsert({
            where: { id: screenshot.id },
            update: screenshot,
            create: screenshot,
          });
        }
      }

      const financeAccountsToImport = userId
        ? backupData.financeAccounts.filter(acc => acc.userId === userId)
        : backupData.financeAccounts;
      for (const account of financeAccountsToImport) {
        await tx.financeAccount.upsert({
          where: { id: account.id },
          update: account,
          create: account,
        });
      }

      const transactionCategoriesToImport = userId
        ? backupData.transactionCategories.filter(cat => cat.userId === userId)
        : backupData.transactionCategories;
      for (const category of transactionCategoriesToImport) {
        await tx.transactionCategory.upsert({
          where: { id: category.id },
          update: category,
          create: category,
        });
      }

      const transactionsToImport = userId
        ? backupData.transactions.filter(trans => trans.userId === userId)
        : backupData.transactions;
      for (const transaction of transactionsToImport) {
        await tx.transaction.upsert({
          where: { id: transaction.id },
          update: transaction,
          create: transaction,
        });
      }

      const budgetsToImport = userId
        ? backupData.budgets.filter(budget => budget.userId === userId)
        : backupData.budgets;
      for (const budget of budgetsToImport) {
        await tx.budget.upsert({ where: { id: budget.id }, update: budget, create: budget });
      }

      const budgetCategoriesToImport = userId
        ? backupData.budgetCategories.filter(bc => {
            const budget = backupData.budgets.find(b => b.id === bc.budgetId);
            return budget && budget.userId === userId;
          })
        : backupData.budgetCategories;
      for (const budgetCategory of budgetCategoriesToImport) {
        await tx.budgetCategory.upsert({
          where: { id: budgetCategory.id },
          update: budgetCategory,
          create: budgetCategory,
        });
      }

      const financialGoalsToImport = userId
        ? backupData.financialGoals.filter(goal => goal.userId === userId)
        : backupData.financialGoals;
      for (const goal of financialGoalsToImport) {
        await tx.financialGoal.upsert({ where: { id: goal.id }, update: goal, create: goal });
      }

      const loansToImport = userId
        ? (backupData.loans || []).filter(loan => loan.userId === userId)
        : backupData.loans || [];
      for (const loan of loansToImport) {
        await tx.loan.upsert({ where: { id: loan.id }, update: loan, create: loan });
      }
    });
  }

  /**
   * Create a full backup and store it in the database.
   *
   * @param userId - User to backup data for
   * @returns The filename of the created backup
   */
  static async createFullBackup(userId: string): Promise<string> {
    const backupData = await this.exportAllData({
      includeScreenshots: true,
      userId,
    });

    const filename = `user_${userId}_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    await this.saveBackupToDb(backupData, filename, userId);
    return filename;
  }

  /**
   * List all backup files for a user.
   *
   * @param userId - User whose backups to list
   * @returns Array of backup records with metadata
   */
  static async listBackups(userId: string) {
    return prisma.backup.findMany({
      where: { userId },
      select: {
        id: true,
        filename: true,
        size: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Delete a backup from the database.
   *
   * @param filename - Backup filename to delete
   * @param userId - Owner of the backup
   * @throws {Error} If backup not found
   */
  static async deleteBackup(filename: string, userId: string): Promise<void> {
    const backup = await prisma.backup.findUnique({
      where: { userId_filename: { userId, filename } },
    });

    if (!backup) {
      throw new Error(`Backup not found: ${filename}`);
    }

    await prisma.backup.delete({ where: { id: backup.id } });
  }

  /**
   * Get metadata about a specific backup without loading full data.
   *
   * @param filename - Backup filename
   * @param userId - Owner of the backup
   * @returns Backup info with record counts, or null if not found
   */
  static async getBackupInfo(
    filename: string,
    userId: string,
  ): Promise<{
    filename: string;
    size: number;
    createdAt: Date;
    metadata: BackupData['metadata'];
    recordCounts: {
      users: number;
      categories: number;
      trades: number;
      screenshots: number;
      financeAccounts: number;
      transactions: number;
      transactionCategories: number;
      budgets: number;
      budgetCategories: number;
      financialGoals: number;
      loans: number;
    };
  } | null> {
    try {
      const backupData = await this.loadBackupFromDb(filename, userId);
      const backup = await prisma.backup.findUnique({
        where: { userId_filename: { userId, filename } },
        select: { size: true, createdAt: true },
      });

      return {
        filename,
        size: backup?.size ?? 0,
        createdAt: backup?.createdAt ?? new Date(),
        metadata: backupData.metadata,
        recordCounts: {
          users: backupData.users.length,
          categories: backupData.categories.length,
          trades: backupData.trades.length,
          screenshots: backupData.screenshots.length,
          financeAccounts: backupData.financeAccounts.length,
          transactions: backupData.transactions.length,
          transactionCategories: backupData.transactionCategories.length,
          budgets: backupData.budgets.length,
          budgetCategories: backupData.budgetCategories.length,
          financialGoals: backupData.financialGoals.length,
          loans: backupData.loans.length,
        },
      };
    } catch {
      return null;
    }
  }
}
