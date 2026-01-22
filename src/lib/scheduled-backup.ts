import fs from 'fs';
// eslint-disable-next-line
// @ts-expect-error
import cron from 'node-cron';
import path from 'path';
import { BackupService } from './backup';

export class ScheduledBackupService {
  private static instance: ScheduledBackupService;
  private dailyBackupTask?: cron.ScheduledTask;
  private weeklyBackupTask?: cron.ScheduledTask;

  private constructor() {}

  static getInstance(): ScheduledBackupService {
    if (!ScheduledBackupService.instance) {
      ScheduledBackupService.instance = new ScheduledBackupService();
    }
    return ScheduledBackupService.instance;
  }

  startScheduledBackups(): void {
    // Daily backup at 2 AM
    this.dailyBackupTask = cron.schedule(
      '0 2 * * *',
      async () => {
        try {
          console.log('Starting scheduled daily backup...');
          const filename = `daily_backup_${new Date().toISOString().split('T')[0]}.json`;
          await BackupService.createFullBackup();
          console.log(`Daily backup completed: ${filename}`);

          // Clean up old daily backups (keep only last 7)
          await this.cleanupOldBackups('daily_backup_', 7);
        } catch (error) {
          console.error('Scheduled daily backup failed:', error);
        }
      },
      {
        scheduled: false,
        timezone: 'UTC',
      },
    );

    // Weekly backup on Sunday at 3 AM
    this.weeklyBackupTask = cron.schedule(
      '0 3 * * 0',
      async () => {
        try {
          console.log('Starting scheduled weekly backup...');
          const filename = `weekly_backup_${new Date().toISOString().split('T')[0]}.json`;
          await BackupService.createFullBackup();
          console.log(`Weekly backup completed: ${filename}`);

          // Clean up old weekly backups (keep only last 4)
          await this.cleanupOldBackups('weekly_backup_', 4);
        } catch (error) {
          console.error('Scheduled weekly backup failed:', error);
        }
      },
      {
        scheduled: false,
        timezone: 'UTC',
      },
    );

    // Start the tasks
    this.dailyBackupTask.start();
    this.weeklyBackupTask.start();

    console.log('Scheduled backups started: Daily at 2 AM, Weekly on Sunday at 3 AM');
  }

  stopScheduledBackups(): void {
    if (this.dailyBackupTask) {
      this.dailyBackupTask.stop();
      this.dailyBackupTask = undefined;
    }

    if (this.weeklyBackupTask) {
      this.weeklyBackupTask.stop();
      this.weeklyBackupTask = undefined;
    }

    console.log('Scheduled backups stopped');
  }

  private async cleanupOldBackups(prefix: string, keepCount: number): Promise<void> {
    try {
      const backupDir = path.join(process.cwd(), 'backups');
      const files = fs
        .readdirSync(backupDir)
        .filter(file => file.startsWith(prefix))
        .map(file => ({
          name: file,
          path: path.join(backupDir, file),
          stats: fs.statSync(path.join(backupDir, file)),
        }))
        .sort((a, b) => b.stats.mtime.getTime() - a.stats.mtime.getTime());

      // Keep only the latest backups
      if (files.length > keepCount) {
        const filesToDelete = files.slice(keepCount);

        for (const file of filesToDelete) {
          fs.unlinkSync(file.path);
          console.log(`Deleted old backup: ${file.name}`);
        }
      }
    } catch (error) {
      console.error('Error cleaning up old backups:', error);
    }
  }

  async createEmergencyBackup(): Promise<string> {
    try {
      console.log('Creating emergency backup...');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `emergency_backup_${timestamp}.json`;

      const backupData = await BackupService.exportAllData({
        includeScreenshots: true,
      });

      const filePath = await BackupService.saveBackupToFile(backupData, filename);
      console.log(`Emergency backup created: ${filePath}`);

      return filePath;
    } catch (error) {
      console.error('Emergency backup failed:', error);
      throw error;
    }
  }

  getBackupStatus(): {
    dailyBackupActive: boolean;
    weeklyBackupActive: boolean;
    nextDailyBackup: string;
    nextWeeklyBackup: string;
  } {
    return {
      dailyBackupActive: this.dailyBackupTask?.running || false,
      weeklyBackupActive: this.weeklyBackupTask?.running || false,
      nextDailyBackup: this.dailyBackupTask ? 'Daily at 2:00 AM UTC' : 'Not scheduled',
      nextWeeklyBackup: this.weeklyBackupTask ? 'Sunday at 3:00 AM UTC' : 'Not scheduled',
    };
  }
}

// Export singleton instance
export const scheduledBackup = ScheduledBackupService.getInstance();
