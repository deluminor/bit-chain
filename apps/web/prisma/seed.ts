import { PrismaClient } from '../src/generated/prisma';
import { DEFAULT_FINANCE_CATEGORIES } from './seeds/finance-categories';
import { DEFAULT_FINANCE_ACCOUNTS } from './seeds/finance-accounts';

const prisma = new PrismaClient();

async function seedFinanceCategories(userId: string) {
  console.log('🏷️ Seeding finance categories...');

  for (const categoryData of DEFAULT_FINANCE_CATEGORIES) {
    // Create parent category
    const parentCategory = await prisma.transactionCategory.upsert({
      where: {
        userId_name_type: {
          userId,
          name: categoryData.name,
          type: categoryData.type,
        },
      },
      update: {},
      create: {
        userId,
        name: categoryData.name,
        type: categoryData.type,
        color: categoryData.color,
        icon: categoryData.icon,
        isDefault: categoryData.isDefault,
      },
    });

    // Create child categories if they exist
    if (categoryData.children && categoryData.children.length > 0) {
      for (const childData of categoryData.children) {
        await prisma.transactionCategory.upsert({
          where: {
            userId_name_type: {
              userId,
              name: childData.name,
              type: childData.type,
            },
          },
          update: {},
          create: {
            userId,
            name: childData.name,
            type: childData.type,
            color: childData.color,
            icon: childData.icon,
            isDefault: childData.isDefault,
            parentId: parentCategory.id,
          },
        });
      }
    }
  }

  const categoryCount = await prisma.transactionCategory.count({ where: { userId } });
  console.log(`✅ Created ${categoryCount} transaction categories`);
}

async function seedFinanceAccounts(userId: string) {
  console.log('💳 Seeding finance accounts...');

  for (const accountData of DEFAULT_FINANCE_ACCOUNTS) {
    await prisma.financeAccount.upsert({
      where: {
        userId_name: {
          userId,
          name: accountData.name,
        },
      },
      update: {},
      create: {
        userId,
        name: accountData.name,
        type: accountData.type,
        currency: accountData.currency,
        color: accountData.color,
        icon: accountData.icon,
        description: accountData.description,
        balance: 0,
      },
    });
  }

  const accountCount = await prisma.financeAccount.count({ where: { userId } });
  console.log(`✅ Created ${accountCount} finance accounts`);
}

async function seedSampleBudget(userId: string) {
  console.log('📊 Creating sample budget...');

  // Get some expense categories for the budget
  const expenseCategories = await prisma.transactionCategory.findMany({
    where: {
      userId,
      type: 'EXPENSE',
      parentId: null, // Only parent categories
    },
    take: 5,
  });

  if (expenseCategories.length === 0) {
    console.log('⚠️ No expense categories found, skipping budget creation');
    return;
  }

  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const budget = await prisma.budget.upsert({
    where: {
      userId_name: {
        userId,
        name: `${startDate.toLocaleString('default', { month: 'long' })} ${startDate.getFullYear()} Budget`,
      },
    },
    update: {},
    create: {
      userId,
      name: `${startDate.toLocaleString('default', { month: 'long' })} ${startDate.getFullYear()} Budget`,
      period: 'MONTHLY',
      startDate,
      endDate,
      currency: 'UAH',
      totalPlanned: 25000, // Sample budget amount
    },
  });

  // Create budget categories
  const budgetAmounts = [8000, 5000, 3000, 4000, 5000]; // Sample amounts
  for (let i = 0; i < expenseCategories.length; i++) {
    await prisma.budgetCategory.upsert({
      where: {
        budgetId_categoryId: {
          budgetId: budget.id,
          categoryId: expenseCategories[i]?.id || '',
        },
      },
      update: {},
      create: {
        budgetId: budget.id,
        categoryId: expenseCategories[i]?.id || '',
        planned: budgetAmounts[i] || 2000,
        actual: 0,
      },
    });
  }

  console.log(`✅ Created sample budget with ${expenseCategories.length} categories`);
}

async function seedSampleGoal(userId: string) {
  console.log('🎯 Creating sample financial goal...');

  await prisma.financialGoal.upsert({
    where: {
      userId_name: {
        userId,
        name: 'Emergency Fund',
      },
    },
    update: {},
    create: {
      userId,
      name: 'Emergency Fund',
      description: 'Build an emergency fund covering 6 months of expenses',
      targetAmount: 50000,
      currentAmount: 0,
      currency: 'UAH',
      deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      color: '#EF4444',
      icon: 'Shield',
      isActive: true,
    },
  });

  console.log(`✅ Created sample financial goal`);
}

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Get all users to seed data for
    const users = await prisma.user.findMany();

    if (users.length === 0) {
      console.log('⚠️ No users found in database. Please create at least one user first.');
      return;
    }

    console.log(`Found ${users.length} users to seed finance data for`);

    for (const user of users) {
      console.log(`\n👤 Seeding finance data for user: ${user.email}`);

      // Check if user already has finance data
      const existingAccounts = await prisma.financeAccount.count({ where: { userId: user.id } });
      const existingCategories = await prisma.transactionCategory.count({
        where: { userId: user.id },
      });

      if (existingAccounts > 0 || existingCategories > 0) {
        console.log(`ℹ️ User ${user.email} already has finance data, skipping...`);
        continue;
      }

      // Seed categories first (needed for budgets)
      await seedFinanceCategories(user.id);

      // Seed accounts
      await seedFinanceAccounts(user.id);

      // Seed sample budget
      await seedSampleBudget(user.id);

      // Seed sample goal
      await seedSampleGoal(user.id);

      console.log(`✅ Completed seeding for user: ${user.email}`);
    }

    console.log('\n🎉 Database seeding completed successfully!');

    // Summary
    const summary = {
      users: await prisma.user.count(),
      financeAccounts: await prisma.financeAccount.count(),
      transactionCategories: await prisma.transactionCategory.count(),
      budgets: await prisma.budget.count(),
      financialGoals: await prisma.financialGoal.count(),
    };

    console.log('\n📊 Database Summary:');
    console.log(`👥 Users: ${summary.users}`);
    console.log(`💳 Finance Accounts: ${summary.financeAccounts}`);
    console.log(`🏷️ Transaction Categories: ${summary.transactionCategories}`);
    console.log(`📊 Budgets: ${summary.budgets}`);
    console.log(`🎯 Financial Goals: ${summary.financialGoals}`);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
