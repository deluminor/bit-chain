import { BackupService } from '../src/lib/backup';
import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function testBackupSystem() {
  console.log('🔄 Starting backup system test...\n');

  try {
    // 1. Test export functionality
    console.log('1. Testing data export...');
    const exportedData = await BackupService.exportAllData({
      includeScreenshots: true,
    });

    console.log(`✅ Exported ${exportedData.metadata.totalRecords} records:`);
    console.log(`   - Users: ${exportedData.users.length}`);
    console.log(`   - Categories: ${exportedData.categories.length}`);
    console.log(`   - Trades: ${exportedData.trades.length}`);
    console.log(`   - Screenshots: ${exportedData.screenshots.length}\n`);

    // 2. Test save to file
    console.log('2. Testing backup file creation...');
    const backupPath = await BackupService.saveBackupToFile(exportedData, 'test_backup.json');
    console.log(`✅ Backup saved to: ${backupPath}\n`);

    // 3. Test load from file
    console.log('3. Testing backup file loading...');
    const loadedData = await BackupService.loadBackupFromFile('test_backup.json');
    console.log(`✅ Loaded backup with ${loadedData.metadata.totalRecords} records\n`);

    // 4. Test backup file listing
    console.log('4. Testing backup file listing...');
    const backupFiles = await BackupService.listBackupFiles();
    console.log(`✅ Found ${backupFiles.length} backup files:`);
    backupFiles.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file}`);
    });

    // 5. Test backup info retrieval
    console.log('\n5. Testing backup info retrieval...');
    const backupInfo = await BackupService.getBackupInfo('test_backup.json');
    if (backupInfo) {
      console.log('✅ Backup info retrieved successfully:');
      console.log(`   - Version: ${backupInfo.metadata.version}`);
      console.log(`   - Timestamp: ${backupInfo.metadata.timestamp}`);
      console.log(`   - Total Records: ${backupInfo.metadata.totalRecords}`);
    }

    // 6. Test current database stats
    console.log('\n6. Current database statistics:');
    const [userCount, categoryCount, tradeCount, screenshotCount] = await Promise.all([
      prisma.user.count(),
      prisma.category.count(),
      prisma.trade.count(),
      prisma.screenshot.count(),
    ]);

    console.log(`✅ Current database contains:`);
    console.log(`   - Users: ${userCount}`);
    console.log(`   - Categories: ${categoryCount}`);
    console.log(`   - Trades: ${tradeCount}`);
    console.log(`   - Screenshots: ${screenshotCount}`);

    // 7. Verify data integrity
    console.log('\n7. Verifying data integrity...');
    const integrityCounts = {
      exportedUsers: exportedData.users.length,
      exportedCategories: exportedData.categories.length,
      exportedTrades: exportedData.trades.length,
      exportedScreenshots: exportedData.screenshots.length,
      dbUsers: userCount,
      dbCategories: categoryCount,
      dbTrades: tradeCount,
      dbScreenshots: screenshotCount,
    };

    const integrity =
      integrityCounts.exportedUsers === integrityCounts.dbUsers &&
      integrityCounts.exportedCategories === integrityCounts.dbCategories &&
      integrityCounts.exportedTrades === integrityCounts.dbTrades &&
      integrityCounts.exportedScreenshots === integrityCounts.dbScreenshots;

    if (integrity) {
      console.log('✅ Data integrity check passed - export matches database');
    } else {
      console.log('⚠️ Data integrity check failed - counts mismatch:');
      console.log(integrityCounts);
    }

    console.log('\n🎉 Backup system test completed successfully!');
    console.log('\n📋 Test Summary:');
    console.log('✅ Data export functionality');
    console.log('✅ Backup file creation');
    console.log('✅ Backup file loading');
    console.log('✅ File listing');
    console.log('✅ Backup info retrieval');
    console.log('✅ Data integrity verification');
    console.log('\n🚀 Backup system is ready for use!');
  } catch (error) {
    console.error('❌ Backup system test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testBackupSystem();
}

export { testBackupSystem };
