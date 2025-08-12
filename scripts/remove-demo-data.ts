#!/usr/bin/env tsx

import { prisma } from '../src/lib/prisma';

/**
 * Script to remove demo data from the database
 * Usage:
 *   npm run tsx scripts/remove-demo-data.ts [userId]
 *
 * If userId is provided, removes demo data only for that user
 * If no userId is provided, removes demo data for all users
 */

async function removeDemoTrades(userId: string) {
  console.log(`[removeDemoTrades] Starting demo trades removal for user: ${userId}`);

  try {
    // Validate input
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
      throw new Error(`Invalid userId provided: ${userId}`);
    }

    if (userId.length < 10) {
      throw new Error(`UserId appears to be too short: ${userId}`);
    }

    const result = await prisma.trade.deleteMany({
      where: {
        userId,
        isDemo: true,
      },
    });

    console.log(`[removeDemoTrades] Successfully removed ${result.count} demo trades`);
    return result;
  } catch (error) {
    console.error(`[removeDemoTrades] Function failed:`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      userId,
    });
    throw new Error(
      `Failed to remove demo trades: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

async function removeDemoFinanceData(userId: string) {
  console.log(`[removeDemoFinanceData] Starting demo finance data removal for user: ${userId}`);

  try {
    // Remove in order to respect foreign key constraints

    // Remove budget categories first
    const budgetCategoriesResult = await prisma.budgetCategory.deleteMany({
      where: {
        budget: {
          userId,
          isDemo: true,
        },
      },
    });
    console.log(
      `[removeDemoFinanceData] Removed ${budgetCategoriesResult.count} budget categories`,
    );

    // Remove budgets
    const budgetsResult = await prisma.budget.deleteMany({
      where: {
        userId,
        isDemo: true,
      },
    });
    console.log(`[removeDemoFinanceData] Removed ${budgetsResult.count} budgets`);

    // Remove transactions
    const transactionsResult = await prisma.transaction.deleteMany({
      where: {
        userId,
        isDemo: true,
      },
    });
    console.log(`[removeDemoFinanceData] Removed ${transactionsResult.count} transactions`);

    // Remove transaction categories
    const transactionCategoriesResult = await prisma.transactionCategory.deleteMany({
      where: {
        userId,
        isDemo: true,
      },
    });
    console.log(
      `[removeDemoFinanceData] Removed ${transactionCategoriesResult.count} transaction categories`,
    );

    // Remove financial goals
    const financialGoalsResult = await prisma.financialGoal.deleteMany({
      where: {
        userId,
        isDemo: true,
      },
    });
    console.log(`[removeDemoFinanceData] Removed ${financialGoalsResult.count} financial goals`);

    // Remove finance accounts
    const financeAccountsResult = await prisma.financeAccount.deleteMany({
      where: {
        userId,
        isDemo: true,
      },
    });
    console.log(`[removeDemoFinanceData] Removed ${financeAccountsResult.count} finance accounts`);

    return {
      budgetCategories: budgetCategoriesResult.count,
      budgets: budgetsResult.count,
      transactions: transactionsResult.count,
      transactionCategories: transactionCategoriesResult.count,
      financialGoals: financialGoalsResult.count,
      financeAccounts: financeAccountsResult.count,
    };
  } catch (error) {
    console.error(`[removeDemoFinanceData] Function failed:`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      userId,
    });
    throw new Error(
      `Failed to remove demo finance data: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

async function removeDemoDataForUser(userId: string) {
  console.log(`\n=== Removing demo data for user: ${userId} ===`);

  try {
    // Remove demo trades
    const tradesResult = await removeDemoTrades(userId);

    // Remove demo finance data
    const financeResult = await removeDemoFinanceData(userId);

    console.log(`\n=== Summary for user ${userId} ===`);
    console.log(`Trades removed: ${tradesResult.count}`);
    console.log(`Budget categories removed: ${financeResult.budgetCategories}`);
    console.log(`Budgets removed: ${financeResult.budgets}`);
    console.log(`Transactions removed: ${financeResult.transactions}`);
    console.log(`Transaction categories removed: ${financeResult.transactionCategories}`);
    console.log(`Financial goals removed: ${financeResult.financialGoals}`);
    console.log(`Finance accounts removed: ${financeResult.financeAccounts}`);

    return {
      userId,
      trades: tradesResult.count,
      ...financeResult,
    };
  } catch (error) {
    console.error(`Failed to remove demo data for user ${userId}:`, error);
    throw error;
  }
}

async function removeDemoDataForAllUsers() {
  console.log('\n=== Removing demo data for ALL users ===');

  try {
    // Get all users with demo data
    const usersWithDemoTrades = await prisma.trade.findMany({
      where: {
        isDemo: true,
      },
      select: {
        userId: true,
      },
      distinct: ['userId'],
    });

    const usersWithDemoFinance = await prisma.financeAccount.findMany({
      where: {
        isDemo: true,
      },
      select: {
        userId: true,
      },
      distinct: ['userId'],
    });

    // Combine and deduplicate user IDs
    const allUserIds = new Set([
      ...usersWithDemoTrades.map(u => u.userId),
      ...usersWithDemoFinance.map(u => u.userId),
    ]);

    console.log(`Found ${allUserIds.size} users with demo data`);

    const results = [];
    for (const userId of allUserIds) {
      try {
        const result = await removeDemoDataForUser(userId);
        results.push(result);
      } catch (error) {
        console.error(`Failed to remove demo data for user ${userId}:`, error);
        results.push({ userId, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    console.log('\n=== FINAL SUMMARY ===');
    console.log(`Processed ${results.length} users`);

    const totals = results.reduce(
      (acc, result) => {
        if ('trades' in result) {
          acc.trades += result.trades;
          acc.budgetCategories += result.budgetCategories;
          acc.budgets += result.budgets;
          acc.transactions += result.transactions;
          acc.transactionCategories += result.transactionCategories;
          acc.financialGoals += result.financialGoals;
          acc.financeAccounts += result.financeAccounts;
          acc.successfulUsers += 1;
        } else {
          acc.failedUsers += 1;
        }
        return acc;
      },
      {
        trades: 0,
        budgetCategories: 0,
        budgets: 0,
        transactions: 0,
        transactionCategories: 0,
        financialGoals: 0,
        financeAccounts: 0,
        successfulUsers: 0,
        failedUsers: 0,
      },
    );

    console.log(`Successful users: ${totals.successfulUsers}`);
    console.log(`Failed users: ${totals.failedUsers}`);
    console.log(`Total trades removed: ${totals.trades}`);
    console.log(`Total budget categories removed: ${totals.budgetCategories}`);
    console.log(`Total budgets removed: ${totals.budgets}`);
    console.log(`Total transactions removed: ${totals.transactions}`);
    console.log(`Total transaction categories removed: ${totals.transactionCategories}`);
    console.log(`Total financial goals removed: ${totals.financialGoals}`);
    console.log(`Total finance accounts removed: ${totals.financeAccounts}`);

    return totals;
  } catch (error) {
    console.error('Failed to remove demo data for all users:', error);
    throw error;
  }
}

async function main() {
  try {
    const userId = process.argv[2];

    if (userId) {
      console.log(`Removing demo data for specific user: ${userId}`);
      await removeDemoDataForUser(userId);
    } else {
      console.log('No userId provided. Removing demo data for ALL users.');
      console.log('This will remove demo data for all users in the database.');

      // Add a confirmation prompt in production
      if (process.env.NODE_ENV === 'production') {
        console.log('\n⚠️  WARNING: This is a production environment!');
        console.log('Please provide a specific userId to remove demo data for that user only.');
        console.log('Usage: npm run tsx scripts/remove-demo-data.ts <userId>');
        process.exit(1);
      }

      await removeDemoDataForAllUsers();
    }

    console.log('\n✅ Demo data removal completed successfully!');
  } catch (error) {
    console.error('\n❌ Demo data removal failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  main();
}

export { removeDemoDataForUser, removeDemoDataForAllUsers };
