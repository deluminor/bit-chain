import { PrismaClient } from '@/generated/prisma';
import fs from 'fs';
import path from 'path';
import { BackupData, BackupOptions } from '@/types/backup';

const prisma = new PrismaClient();

export class BackupService {
  private static readonly BACKUP_VERSION = '1.0.0';
  private static readonly BACKUP_DIR = path.join(process.cwd(), 'backups');

  static async ensureBackupDir(): Promise<void> {
    if (!fs.existsSync(this.BACKUP_DIR)) {
      fs.mkdirSync(this.BACKUP_DIR, { recursive: true });
    }
  }

  static async exportAllData(options: BackupOptions = {}): Promise<BackupData> {
    const { includeScreenshots = true, userId } = options;

    try {
      // Export users
      const users = userId
        ? await prisma.user.findMany({ where: { id: userId } })
        : await prisma.user.findMany();

      // Export categories
      const categories = userId
        ? await prisma.category.findMany({ where: { userId } })
        : await prisma.category.findMany();

      // Export trades
      const trades = userId
        ? await prisma.trade.findMany({
            where: { userId },
            include: { category: true },
          })
        : await prisma.trade.findMany({
            include: { category: true },
          });

      // Export screenshots
      let screenshots: unknown[] = [];
      if (includeScreenshots) {
        screenshots = userId
          ? await prisma.screenshot.findMany({
              where: { trade: { userId } },
            })
          : await prisma.screenshot.findMany();
      }

      // Export financial data
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
        ? await prisma.budgetCategory.findMany({
            where: { budget: { userId } },
          })
        : await prisma.budgetCategory.findMany();

      const financialGoals = userId
        ? await prisma.financialGoal.findMany({ where: { userId } })
        : await prisma.financialGoal.findMany();

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
        financialGoals.length;

      const backupData: BackupData = {
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
        metadata: {
          version: this.BACKUP_VERSION,
          timestamp: new Date().toISOString(),
          totalRecords,
        },
      };

      return backupData;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('Failed to export database data');
    }
  }

  static async saveBackupToFile(data: BackupData, filename?: string): Promise<string> {
    await this.ensureBackupDir();

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFilename = filename || `backup_${timestamp}.json`;
    const filePath = path.join(this.BACKUP_DIR, backupFilename);

    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`Backup saved to: ${filePath}`);
      return filePath;
    } catch (error) {
      console.error('Error saving backup file:', error);
      throw new Error('Failed to save backup file');
    }
  }

  static async loadBackupFromFile(filename: string): Promise<BackupData> {
    const filePath = path.join(this.BACKUP_DIR, filename);

    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`Backup file not found: ${filename}`);
      }

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const backupData: BackupData = JSON.parse(fileContent);

      // Validate backup structure
      if (
        !backupData.metadata ||
        !backupData.users ||
        !backupData.categories ||
        !backupData.trades
      ) {
        throw new Error('Invalid backup file structure');
      }

      // Set default values for financial data if not present (backwards compatibility)
      if (!backupData.financeAccounts) backupData.financeAccounts = [];
      if (!backupData.transactions) backupData.transactions = [];
      if (!backupData.transactionCategories) backupData.transactionCategories = [];
      if (!backupData.budgets) backupData.budgets = [];
      if (!backupData.budgetCategories) backupData.budgetCategories = [];
      if (!backupData.financialGoals) backupData.financialGoals = [];

      return backupData;
    } catch (error) {
      console.error('Error loading backup file:', error);
      throw new Error(`Failed to load backup file: ${filename}`);
    }
  }

  static async importData(
    backupData: BackupData,
    options: { overwrite?: boolean; userId?: string } = {},
  ): Promise<void> {
    const { overwrite = false, userId } = options;

    try {
      await prisma.$transaction(async tx => {
        // If overwrite is true, clear existing data for the user
        if (overwrite && userId) {
          // Delete in correct order to avoid foreign key constraints
          await tx.screenshot.deleteMany({
            where: { trade: { userId } },
          });
          await tx.budgetCategory.deleteMany({
            where: { budget: { userId } },
          });
          await tx.transaction.deleteMany({
            where: { userId },
          });
          await tx.trade.deleteMany({
            where: { userId },
          });
          await tx.budget.deleteMany({
            where: { userId },
          });
          await tx.financialGoal.deleteMany({
            where: { userId },
          });
          await tx.financeAccount.deleteMany({
            where: { userId },
          });
          await tx.transactionCategory.deleteMany({
            where: { userId },
          });
          await tx.category.deleteMany({
            where: { userId },
          });
        } else if (overwrite) {
          // Full overwrite (admin only)
          await tx.screenshot.deleteMany();
          await tx.budgetCategory.deleteMany();
          await tx.transaction.deleteMany();
          await tx.trade.deleteMany();
          await tx.budget.deleteMany();
          await tx.financialGoal.deleteMany();
          await tx.financeAccount.deleteMany();
          await tx.transactionCategory.deleteMany();
          await tx.category.deleteMany();
          await tx.user.deleteMany();
        }

        // Import users (only if no userId filter or user is in backup)
        if (!userId) {
          for (const user of backupData.users) {
            await tx.user.upsert({
              where: { id: user.id },
              update: user,
              create: user,
            });
          }
        }

        // Import categories (filter by userId if provided)
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

        // Import trades (filter by userId if provided)
        const tradesToImport = userId 
          ? backupData.trades.filter(trade => trade.userId === userId)
          : backupData.trades;
          
        for (const trade of tradesToImport) {
          await tx.trade.upsert({
            where: { id: trade.id },
            update: trade,
            create: trade,
          });
        }

        // Import screenshots
        if (backupData.screenshots && backupData.screenshots.length > 0) {
          for (const screenshot of backupData.screenshots) {
            await tx.screenshot.upsert({
              where: { id: screenshot.id },
              update: screenshot,
              create: screenshot,
            });
          }
        }

        // Import financial data
        
        // Import finance accounts (filter by userId if provided)
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

        // Import transaction categories (filter by userId if provided)
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

        // Import transactions (filter by userId if provided)
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

        // Import budgets (filter by userId if provided)
        const budgetsToImport = userId 
          ? backupData.budgets.filter(budget => budget.userId === userId)
          : backupData.budgets;
          
        for (const budget of budgetsToImport) {
          await tx.budget.upsert({
            where: { id: budget.id },
            update: budget,
            create: budget,
          });
        }

        // Import budget categories (filter by budget userId if provided)
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

        // Import financial goals (filter by userId if provided)
        const financialGoalsToImport = userId 
          ? backupData.financialGoals.filter(goal => goal.userId === userId)
          : backupData.financialGoals;
          
        for (const goal of financialGoalsToImport) {
          await tx.financialGoal.upsert({
            where: { id: goal.id },
            update: goal,
            create: goal,
          });
        }
      });

      console.log(`Successfully imported ${backupData.metadata.totalRecords} records`);
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Failed to import backup data');
    }
  }

  static async createFullBackup(userId?: string): Promise<string> {
    try {
      const backupData = await this.exportAllData({
        includeScreenshots: true,
        userId,
      });

      const filename = userId
        ? `user_${userId}_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`
        : `full_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;

      return await this.saveBackupToFile(backupData, filename);
    } catch (error) {
      console.error('Error creating full backup:', error);
      throw error;
    }
  }

  static async listBackupFiles(): Promise<string[]> {
    await this.ensureBackupDir();

    try {
      const files = fs
        .readdirSync(this.BACKUP_DIR)
        .filter(file => file.endsWith('.json') || file.endsWith('.gz'))
        .sort((a, b) => b.localeCompare(a)); // Latest first

      return files;
    } catch (error) {
      console.error('Error listing backup files:', error);
      return [];
    }
  }

  static async getBackupInfo(filename: string): Promise<{
    filename: string;
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
    };
  } | null> {
    try {
      const backupData = await this.loadBackupFromFile(filename);
      return {
        filename,
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
        },
      };
    } catch (error) {
      console.error('Error getting backup info:', error);
      return null;
    }
  }
}
