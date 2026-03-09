import type { BackupData, BackupOptions } from '@/types/backup';
import { exportAllData as exportAllDataInternal } from './backup/backup-export';
import { importData as importDataInternal } from './backup/backup-import';
import {
  deleteBackup as deleteBackupInternal,
  getBackupInfo as getBackupInfoInternal,
  listBackups as listBackupsInternal,
  loadBackupFromDb as loadBackupFromDbInternal,
  saveBackupToDb as saveBackupToDbInternal,
} from './backup/backup-storage';

/**
 * Service for database backup operations.
 * Stores backups as JSON in PostgreSQL instead of the filesystem,
 * making it compatible with serverless deployments (Vercel).
 */
export class BackupService {
  /**
   * Export all user data from the database.
   *
   * @param options - Export options including userId filter and screenshot inclusion
   * @returns Complete backup data object with metadata
   */
  static async exportAllData(options: BackupOptions = {}): Promise<BackupData> {
    return exportAllDataInternal(options);
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
    return saveBackupToDbInternal(data, filename, userId);
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
    return loadBackupFromDbInternal(filename, userId);
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
    return importDataInternal(backupData, options);
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
    return listBackupsInternal(userId);
  }

  /**
   * Delete a backup from the database.
   *
   * @param filename - Backup filename to delete
   * @param userId - Owner of the backup
   * @throws {Error} If backup not found
   */
  static async deleteBackup(filename: string, userId: string): Promise<void> {
    return deleteBackupInternal(filename, userId);
  }

  /**
   * Get metadata about a specific backup without loading full data.
   *
   * @param filename - Backup filename
   * @param userId - Owner of the backup
   * @returns Backup info with record counts, or null if not found
   */
  static async getBackupInfo(filename: string, userId: string) {
    return getBackupInfoInternal(filename, userId);
  }
}
