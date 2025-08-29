import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function cleanupTransferCategories() {
  try {
    console.log('🧹 Cleaning up TRANSFER categories...');

    // Get all users
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users`);

    for (const user of users) {
      console.log(`\n👤 Cleaning TRANSFER categories for user: ${user.email}`);

      // Delete all existing TRANSFER categories for this user
      const deleted = await prisma.transactionCategory.deleteMany({
        where: {
          userId: user.id,
          type: 'TRANSFER',
        },
      });

      console.log(`🗑️ Deleted ${deleted.count} existing TRANSFER categories`);

      // Create only one simple Transfer category
      const transferCategory = await prisma.transactionCategory.create({
        data: {
          userId: user.id,
          name: 'Transfer',
          type: 'TRANSFER',
          color: '#3B82F6', // blue-500
          icon: 'ArrowRightLeft',
          isDefault: true,
        },
      });

      console.log(`✅ Created simple Transfer category: ${transferCategory.name}`);
    }

    console.log('\n🎉 Successfully cleaned up TRANSFER categories!');

    // Show final count
    const transferCategoryCount = await prisma.transactionCategory.count({
      where: { type: 'TRANSFER' },
    });
    console.log(`📊 Total TRANSFER categories in database: ${transferCategoryCount}`);
  } catch (error) {
    console.error('❌ Error cleaning up TRANSFER categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupTransferCategories();
