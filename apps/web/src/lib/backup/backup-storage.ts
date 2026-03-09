import { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import type { BackupData } from '@/types/backup';

export async function saveBackupToDb(
  data: BackupData,
  filename: string,
  userId: string,
): Promise<string> {
  const jsonString = JSON.stringify(data);
  const size = Buffer.byteLength(jsonString, 'utf-8');

  await prisma.backup.upsert({
    where: { userId_filename: { userId, filename } },
    update: { data: data as unknown as Prisma.InputJsonValue, size },
    create: { userId, filename, data: data as unknown as Prisma.InputJsonValue, size },
  });

  return filename;
}

export async function loadBackupFromDb(filename: string, userId: string): Promise<BackupData> {
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

  backupData.financeAccounts ??= [];
  backupData.transactions ??= [];
  backupData.transactionCategories ??= [];
  backupData.budgets ??= [];
  backupData.budgetCategories ??= [];
  backupData.financialGoals ??= [];
  backupData.loans ??= [];

  return backupData;
}

export async function listBackups(userId: string) {
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

export async function deleteBackup(filename: string, userId: string): Promise<void> {
  const backup = await prisma.backup.findUnique({
    where: { userId_filename: { userId, filename } },
  });

  if (!backup) {
    throw new Error(`Backup not found: ${filename}`);
  }

  await prisma.backup.delete({ where: { id: backup.id } });
}

export async function getBackupInfo(
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
    const backupData = await loadBackupFromDb(filename, userId);
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
