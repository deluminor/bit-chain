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
      let screenshots: any[] = [];
      if (includeScreenshots) {
        screenshots = userId
          ? await prisma.screenshot.findMany({
              where: { trade: { userId } },
            })
          : await prisma.screenshot.findMany();
      }

      const backupData: BackupData = {
        users,
        categories,
        trades,
        screenshots,
        metadata: {
          version: this.BACKUP_VERSION,
          timestamp: new Date().toISOString(),
          totalRecords: users.length + categories.length + trades.length + screenshots.length,
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

      return backupData;
    } catch (error) {
      console.error('Error loading backup file:', error);
      throw new Error(`Failed to load backup file: ${filename}`);
    }
  }

  static async importData(
    backupData: BackupData,
    options: { overwrite?: boolean } = {},
  ): Promise<void> {
    const { overwrite = false } = options;

    try {
      await prisma.$transaction(async tx => {
        // If overwrite is true, clear existing data
        if (overwrite) {
          await tx.screenshot.deleteMany();
          await tx.trade.deleteMany();
          await tx.category.deleteMany();
          await tx.user.deleteMany();
        }

        // Import users
        for (const user of backupData.users) {
          await tx.user.upsert({
            where: { id: user.id },
            update: user,
            create: user,
          });
        }

        // Import categories
        for (const category of backupData.categories) {
          await tx.category.upsert({
            where: { id: category.id },
            update: category,
            create: category,
          });
        }

        // Import trades
        for (const trade of backupData.trades) {
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
        },
      };
    } catch (error) {
      console.error('Error getting backup info:', error);
      return null;
    }
  }
}
