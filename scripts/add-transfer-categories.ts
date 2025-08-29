import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

// TRANSFER categories from our finance-categories.ts file
const TRANSFER_CATEGORIES = [
  {
    name: 'Account Transfer',
    type: 'TRANSFER' as const,
    color: '#3B82F6',
    icon: 'ArrowRightLeft',
    isDefault: true,
    children: [
      {
        name: 'Between Own Accounts',
        type: 'TRANSFER' as const,
        color: '#2563EB',
        icon: 'ArrowRightLeft',
        isDefault: true,
      },
      {
        name: 'Currency Exchange',
        type: 'TRANSFER' as const,
        color: '#1D4ED8',
        icon: 'RefreshCw',
        isDefault: true,
      },
      {
        name: 'Bank Transfer',
        type: 'TRANSFER' as const,
        color: '#1E40AF',
        icon: 'Building2',
        isDefault: true,
      },
    ],
  },
];

async function addTransferCategories() {
  try {
    console.log('🔄 Adding TRANSFER categories...');

    // Get all users
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users`);

    for (const user of users) {
      console.log(`\n👤 Adding TRANSFER categories for user: ${user.email}`);

      for (const categoryData of TRANSFER_CATEGORIES) {
        // Create parent category
        const parentCategory = await prisma.transactionCategory.upsert({
          where: {
            userId_name_type: {
              userId: user.id,
              name: categoryData.name,
              type: categoryData.type,
            },
          },
          update: {
            color: categoryData.color,
            icon: categoryData.icon,
            isDefault: categoryData.isDefault,
          },
          create: {
            userId: user.id,
            name: categoryData.name,
            type: categoryData.type,
            color: categoryData.color,
            icon: categoryData.icon,
            isDefault: categoryData.isDefault,
          },
        });

        console.log(`✅ Created/Updated parent category: ${categoryData.name}`);

        // Create child categories if they exist
        if (categoryData.children && categoryData.children.length > 0) {
          for (const childData of categoryData.children) {
            await prisma.transactionCategory.upsert({
              where: {
                userId_name_type: {
                  userId: user.id,
                  name: childData.name,
                  type: childData.type,
                },
              },
              update: {
                color: childData.color,
                icon: childData.icon,
                isDefault: childData.isDefault,
                parentId: parentCategory.id,
              },
              create: {
                userId: user.id,
                name: childData.name,
                type: childData.type,
                color: childData.color,
                icon: childData.icon,
                isDefault: childData.isDefault,
                parentId: parentCategory.id,
              },
            });

            console.log(`✅ Created/Updated child category: ${childData.name}`);
          }
        }
      }

      console.log(`✅ Completed adding TRANSFER categories for user: ${user.email}`);
    }

    console.log('\n🎉 Successfully added all TRANSFER categories!');

    // Show final count
    const transferCategoryCount = await prisma.transactionCategory.count({
      where: { type: 'TRANSFER' },
    });
    console.log(`📊 Total TRANSFER categories in database: ${transferCategoryCount}`);
  } catch (error) {
    console.error('❌ Error adding TRANSFER categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTransferCategories();
