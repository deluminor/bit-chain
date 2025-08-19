import { PrismaClient } from '../src/generated/prisma';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function restoreFromBackup() {
  const backupFileName = 'full_backup_2025-08-13T15-48-27-035Z.json';
  const backupPath = path.join(process.cwd(), 'backups', backupFileName);

  console.log('🔄 Restoring data from backup...');
  console.log(`📁 Backup file: ${backupFileName}`);

  try {
    // Read backup file
    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup file not found: ${backupPath}`);
    }

    const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf-8')) as any;
    console.log(`📊 Backup contains ${backupData.metadata.totalRecords} records`);

    // Clear existing data first
    console.log('🗑️ Clearing existing data...');
    await prisma.$transaction(async tx => {
      await tx.screenshot.deleteMany({});
      await tx.trade.deleteMany({});
      await tx.budgetCategory.deleteMany({});
      await tx.budget.deleteMany({});
      await tx.financialGoal.deleteMany({});
      await tx.transaction.deleteMany({});
      await tx.transactionCategory.deleteMany({});
      await tx.financeAccount.deleteMany({});
      await tx.category.deleteMany({});
      await tx.user.deleteMany({});
    });

    // Restore data in correct order (due to foreign key constraints)
    await prisma.$transaction(async tx => {
      console.log('👥 Restoring users...');
      for (const user of backupData.users) {
        await tx.user.create({ data: user });
      }

      console.log('🏷️ Restoring trading categories...');
      for (const category of backupData.categories) {
        await tx.category.create({ data: category });
      }

      console.log('💼 Restoring trades...');
      for (const trade of backupData.trades) {
        const { category: _category, ...tradeData } = trade;
        await tx.trade.create({ data: tradeData });
      }

      console.log('📸 Restoring screenshots...');
      for (const screenshot of backupData.screenshots) {
        await tx.screenshot.create({ data: screenshot });
      }
    });

    console.log('✅ Data restoration completed successfully!');

    // Verify restoration
    const [userCount, categoryCount, tradeCount, screenshotCount] = await Promise.all([
      prisma.user.count(),
      prisma.category.count(),
      prisma.trade.count(),
      prisma.screenshot.count(),
    ]);

    console.log('\n📊 Verification:');
    console.log(`   - Users: ${userCount} (expected: ${backupData.users.length})`);
    console.log(`   - Categories: ${categoryCount} (expected: ${backupData.categories.length})`);
    console.log(`   - Trades: ${tradeCount} (expected: ${backupData.trades.length})`);
    console.log(
      `   - Screenshots: ${screenshotCount} (expected: ${backupData.screenshots.length})`,
    );

    console.log('\n🎉 Backup restoration completed successfully!');
  } catch (error) {
    console.error('❌ Backup restoration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  restoreFromBackup()
    .then(() => {
      console.log('\n✅ All original data has been restored!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Restoration failed:', error);
      process.exit(1);
    });
}

export { restoreFromBackup };
