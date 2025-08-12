import { PrismaClient } from '../src/generated/prisma';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function createEmergencyBackup() {
  console.log('🚨 Creating emergency backup before any changes...\n');

  try {
    // Create backup directory if it doesn't exist
    const backupDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Get all data from database
    console.log('📊 Collecting data from database...');

    const [users, categories, trades, screenshots] = await Promise.all([
      prisma.user.findMany(),
      prisma.category.findMany(),
      prisma.trade.findMany({
        include: { category: true },
      }),
      prisma.screenshot.findMany(),
    ]);

    console.log(`✅ Collected data:`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Trades: ${trades.length}`);
    console.log(`   - Screenshots: ${screenshots.length}`);

    // Check for any additional tables that might exist
    const additionalData: Record<string, unknown> = {};

    try {
      // Try to get data from finance tables if they exist
      const accounts =
        (await (
          prisma as unknown as { account?: { findMany?: () => Promise<unknown[]> } }
        ).account?.findMany?.()) || [];
      const budgets =
        (await (
          prisma as unknown as { budget?: { findMany?: () => Promise<unknown[]> } }
        ).budget?.findMany?.()) || [];
      const budgetCategories =
        (await (
          prisma as unknown as { budgetCategory?: { findMany?: () => Promise<unknown[]> } }
        ).budgetCategory?.findMany?.()) || [];
      const financialGoals =
        (await (
          prisma as unknown as { financialGoal?: { findMany?: () => Promise<unknown[]> } }
        ).financialGoal?.findMany?.()) || [];

      if (accounts.length > 0) {
        additionalData.accounts = accounts;
        console.log(`   - Accounts: ${accounts.length}`);
      }
      if (budgets.length > 0) {
        additionalData.budgets = budgets;
        console.log(`   - Budgets: ${budgets.length}`);
      }
      if (budgetCategories.length > 0) {
        (additionalData as any).budgetCategories = budgetCategories;
        console.log(`   - Budget Categories: ${budgetCategories.length}`);
      }
      if (financialGoals.length > 0) {
        (additionalData as any).financialGoals = financialGoals;
        console.log(`   - Financial Goals: ${financialGoals.length}`);
      }
    } catch {
      console.log('ℹ️  No additional finance tables found (this is expected)');
    }

    // Create backup object
    const backupData = {
      users,
      categories,
      trades,
      screenshots,
      ...additionalData,
      metadata: {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        totalRecords:
          (users.length as number) +
          (categories.length as number) +
          (trades.length as number) +
          (screenshots.length as number) +
          Object.values(additionalData).reduce(
            (sum: number, arr: unknown) => sum + (Array.isArray(arr) ? arr.length : 0),
            0,
          ),
        description: 'Emergency backup created before finance system implementation',
      },
    } as const;

    // Save to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `emergency_backup_${timestamp}.json`;
    const filePath = path.join(backupDir, filename);

    fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));

    console.log(`\n✅ Emergency backup created successfully!`);
    console.log(`📁 File: ${filePath}`);
    console.log(`📊 Total records backed up: ${backupData.metadata.totalRecords}`);

    // Also create a compressed version
    try {
      // prefer gzip if available
      const { execSync } = await import('node:child_process');
      execSync(`gzip -k "${filePath}"`);
      console.log(`🗜️  Compressed backup created: ${filePath}.gz`);
    } catch {
      console.log('ℹ️  Could not create compressed version (gzip not available)');
    }

    console.log('\n🔒 Your data is now safely backed up!');
    return filePath;
  } catch (error) {
    console.error('❌ Emergency backup failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the backup when executed directly
if (require.main === module) {
  createEmergencyBackup()
    .then(() => {
      console.log('\n🎉 Emergency backup completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Emergency backup failed:', error);
      process.exit(1);
    });
}

export { createEmergencyBackup };
