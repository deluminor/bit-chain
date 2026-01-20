import { authOptions } from '@/features/auth/libs/auth';
import { TRADE_SIDES } from '@/features/positions/types/position';
import { createTradeData } from '@/features/positions/utils/trade';
import { prisma } from '@/lib/prisma';
import { SUPPORTED_CURRENCIES } from '@/lib/currency';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

const DEMO_TRADES_COUNT = 100;
const _DEMO_ACCOUNTS_COUNT = 4;
const DEMO_TRANSACTIONS_COUNT = 50;
const DEMO_BUDGETS_COUNT = 2;
const _DEMO_GOALS_COUNT = 3;

async function generateDemoTrades(userId: string) {
  console.log(`[generateDemoTrades] Starting demo trades generation for user: ${userId}`);

  try {
    // Validate input
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
      throw new Error(`Invalid userId provided: ${userId}`);
    }

    // Additional validation for userId format (basic check)
    if (userId.length < 10) {
      throw new Error(`UserId appears to be too short: ${userId}`);
    }

    const symbols = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP'];
    const sides = Object.values(TRADE_SIDES);
    console.log(
      `[generateDemoTrades] Using symbols: ${symbols.join(', ')} and sides: ${sides.join(', ')}`,
    );

    // Get user's categories
    console.log(`[generateDemoTrades] Fetching categories for user: ${userId}`);
    const categories = await prisma.category.findMany({
      where: { userId },
      select: { id: true, name: true },
    });
    console.log(`[generateDemoTrades] Found ${categories.length} existing categories`);

    // If no categories, create a solo category
    if (categories.length === 0) {
      console.log(`[generateDemoTrades] No categories found, creating default 'solo' category`);
      try {
        const soloCategory = await prisma.category.create({
          data: {
            name: 'solo',
            userId,
          },
        });
        categories.push(soloCategory);
        console.log(
          `[generateDemoTrades] Successfully created default category with ID: ${soloCategory.id}`,
        );
      } catch (error) {
        console.error(`[generateDemoTrades] Failed to create default category:`, {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          userId,
        });
        throw new Error(
          `Failed to create default category: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    }

    // Still make sure we have at least one category
    if (categories.length === 0) {
      console.error(
        `[generateDemoTrades] Critical error: No categories available after creation attempt`,
      );
      throw new Error('No categories found for user and failed to create a default one');
    }

    // Generate the trade data
    console.log(`[generateDemoTrades] Starting generation of ${DEMO_TRADES_COUNT} demo trades`);
    const generatedTrades = [];
    let skippedTrades = 0;

    for (let i = 0; i < DEMO_TRADES_COUNT; i++) {
      try {
        const isWin = Math.random() > 0.5;
        const entryPrice = Math.random() * 1000 + 100;
        const exitPrice = isWin
          ? entryPrice * (1 + Math.random() * 0.1)
          : entryPrice * (1 - Math.random() * 0.1);
        const positionSize = Math.random() * 10 + 1;
        const leverage = Math.floor(Math.random() * 5) + 1;

        const symbol = symbols[Math.floor(Math.random() * symbols.length)] || 'BTC';
        const side = sides[Math.floor(Math.random() * sides.length)] || TRADE_SIDES.LONG;

        // Safely get a category - use index 0 as fallback
        let selectedCategory = categories[0]; // Default to first category
        if (categories.length > 1) {
          const randomIndex = Math.floor(Math.random() * categories.length);
          selectedCategory = categories[randomIndex] || selectedCategory;
        }

        if (!selectedCategory || !selectedCategory.id) {
          console.error(`[generateDemoTrades] Invalid category selected for trade ${i}:`, {
            selectedCategory,
            availableCategories: categories.length,
            tradeIndex: i,
          });
          skippedTrades++;
          continue;
        }

        const tradeData = createTradeData({
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          stopLoss: entryPrice * (1 - Math.random() * 0.05),
          commission: Math.random() * 10,
          deposit: Math.random() * 1000 + 100,
          symbol,
          side,
          entryPrice,
          positionSize,
          exitPrice,
          leverage,
        });

        // Remove category from tradeData if present
        const { category: _, ...cleanTradeData } = tradeData;

        const finalTradeData = {
          ...cleanTradeData,
          userId,
          categoryId: selectedCategory.id,
          isDemo: true,
        };

        // Validate trade data before adding
        if (!finalTradeData.userId || !finalTradeData.categoryId) {
          console.error(`[generateDemoTrades] Invalid trade data for trade ${i}:`, {
            userId: finalTradeData.userId,
            categoryId: finalTradeData.categoryId,
            tradeIndex: i,
          });
          skippedTrades++;
          continue;
        }

        generatedTrades.push(finalTradeData);

        // Log progress every 20 trades
        if ((i + 1) % 20 === 0) {
          console.log(`[generateDemoTrades] Generated ${i + 1}/${DEMO_TRADES_COUNT} trades`);
        }
      } catch (error) {
        console.error(`[generateDemoTrades] Error creating trade ${i}:`, {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          tradeIndex: i,
          userId,
        });
        skippedTrades++;
        // Continue with other trades instead of failing completely
      }
    }

    console.log(
      `[generateDemoTrades] Trade generation completed. Generated: ${generatedTrades.length}, Skipped: ${skippedTrades}`,
    );

    if (generatedTrades.length === 0) {
      console.error(`[generateDemoTrades] Critical error: No valid trades generated`, {
        totalAttempted: DEMO_TRADES_COUNT,
        skippedTrades,
        userId,
      });
      throw new Error(
        `Failed to generate any valid trades. Attempted: ${DEMO_TRADES_COUNT}, Skipped: ${skippedTrades}`,
      );
    }

    console.log(`[generateDemoTrades] Inserting ${generatedTrades.length} trades into database`);
    try {
      const result = await prisma.trade.createMany({
        data: generatedTrades,
      });
      console.log(
        `[generateDemoTrades] Successfully inserted ${result.count} trades into database`,
      );
      return result;
    } catch (dbError) {
      console.error(`[generateDemoTrades] Database insertion failed:`, {
        error: dbError instanceof Error ? dbError.message : 'Unknown database error',
        stack: dbError instanceof Error ? dbError.stack : undefined,
        tradesCount: generatedTrades.length,
        userId,
      });
      throw new Error(
        `Failed to insert trades into database: ${dbError instanceof Error ? dbError.message : 'Unknown database error'}`,
      );
    }
  } catch (error) {
    console.error(`[generateDemoTrades] Function failed:`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      userId,
    });
    throw new Error(
      `Failed to generate demo trades: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

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

async function generateDemoFinanceData(userId: string) {
  console.log(
    `[generateDemoFinanceData] Starting demo finance data generation for user: ${userId}`,
  );

  try {
    // Validate input
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
      throw new Error(`Invalid userId provided: ${userId}`);
    }

    // Additional validation for userId format (basic check)
    if (userId.length < 10) {
      throw new Error(`UserId appears to be too short: ${userId}`);
    }

    // Get currencies for account creation
    const currencies = Object.keys(SUPPORTED_CURRENCIES);

    // Define demo account names to check
    const demoAccountNames = [
      'Main Bank Account',
      'Savings Account',
      'Cash Wallet',
      'Investment Account',
    ];

    // Check for existing demo accounts by name to avoid duplicates
    console.log(`[generateDemoFinanceData] Checking for existing demo accounts`);
    const existingDemoAccounts = await prisma.financeAccount.findMany({
      where: {
        userId,
        isDemo: true,
        name: {
          in: demoAccountNames,
        },
      },
    });
    console.log(
      `[generateDemoFinanceData] Found ${existingDemoAccounts.length} existing demo accounts`,
    );

    // Get names of existing accounts
    const existingAccountNames = existingDemoAccounts.map(account => account.name);

    // Filter out accounts that already exist
    let createdAccounts = existingDemoAccounts;
    const accountsToCreate = demoAccountNames.filter(name => !existingAccountNames.includes(name));

    if (accountsToCreate.length > 0) {
      // Generate demo accounts with diverse currencies
      console.log(
        `[generateDemoFinanceData] Creating ${accountsToCreate.length} missing demo accounts`,
      );

      // Define all possible demo accounts
      const allDemoAccounts = [
        {
          name: 'Main Bank Account',
          type: 'BANK_CARD' as const,
          currency: currencies[0] || 'EUR', // EUR
          balance: 3420.5,
          color: '#3B82F6',
          icon: 'CreditCard',
          userId,
          isDemo: true,
        },
        {
          name: 'Savings Account',
          type: 'SAVINGS' as const,
          currency: currencies[1] || 'USD', // USD
          balance: 17200.0,
          color: '#10B981',
          icon: 'PiggyBank',
          userId,
          isDemo: true,
        },
        {
          name: 'Cash Wallet',
          type: 'CASH' as const,
          currency: currencies[2] || 'UAH', // UAH
          balance: 15200.0, // Adjusted for UAH
          color: '#F59E0B',
          icon: 'Wallet',
          userId,
          isDemo: true,
        },
        {
          name: 'Investment Account',
          type: 'INVESTMENT' as const,
          currency: currencies[3] || 'HUF', // HUF
          balance: 3850000.0, // Adjusted for HUF
          color: '#8B5CF6',
          icon: 'TrendingUp',
          userId,
          isDemo: true,
        },
      ];

      // Filter to only create accounts that don't exist
      const demoAccounts = allDemoAccounts.filter(account =>
        accountsToCreate.includes(account.name),
      );

      console.log(`[generateDemoFinanceData] Creating ${demoAccounts.length} finance accounts`);
      const newlyCreatedAccounts = await Promise.all(
        demoAccounts.map(async (account, index) => {
          try {
            const result = await prisma.financeAccount.create({ data: account });
            console.log(
              `[generateDemoFinanceData] Created account ${index + 1}/${demoAccounts.length}: ${account.name}`,
            );
            return result;
          } catch (error) {
            console.error(`[generateDemoFinanceData] Failed to create account ${account.name}:`, {
              error: error instanceof Error ? error.message : 'Unknown error',
              accountData: account,
              userId,
            });
            throw error;
          }
        }),
      );
      // Combine existing and newly created accounts
      createdAccounts = [...existingDemoAccounts, ...newlyCreatedAccounts];
    } else {
      console.log(
        `[generateDemoFinanceData] All demo accounts already exist, using existing ${existingDemoAccounts.length} accounts`,
      );
    }
    console.log(`[generateDemoFinanceData] Total available accounts: ${createdAccounts.length}`);

    // Create demo transaction categories
    const incomeCategories = [
      { name: 'Salary', type: 'INCOME' as const, color: '#10B981', icon: 'Briefcase' },
      { name: 'Freelance', type: 'INCOME' as const, color: '#3B82F6', icon: 'Code' },
      { name: 'Investment Returns', type: 'INCOME' as const, color: '#8B5CF6', icon: 'TrendingUp' },
      { name: 'Side Business', type: 'INCOME' as const, color: '#F59E0B', icon: 'Store' },
    ];

    const expenseCategories = [
      { name: 'Groceries', type: 'EXPENSE' as const, color: '#EF4444', icon: 'ShoppingCart' },
      { name: 'Transport', type: 'EXPENSE' as const, color: '#F59E0B', icon: 'Car' },
      { name: 'Entertainment', type: 'EXPENSE' as const, color: '#8B5CF6', icon: 'Music' },
      { name: 'Utilities', type: 'EXPENSE' as const, color: '#06B6D4', icon: 'Zap' },
      { name: 'Restaurants', type: 'EXPENSE' as const, color: '#EC4899', icon: 'UtensilsCrossed' },
      { name: 'Shopping', type: 'EXPENSE' as const, color: '#84CC16', icon: 'ShoppingBag' },
      { name: 'Healthcare', type: 'EXPENSE' as const, color: '#EF4444', icon: 'Heart' },
      { name: 'Education', type: 'EXPENSE' as const, color: '#3B82F6', icon: 'BookOpen' },
    ];

    const allCategories = [...incomeCategories, ...expenseCategories];

    // Check for existing categories to avoid unique constraint conflicts
    console.log(`[generateDemoFinanceData] Checking for existing transaction categories`);
    const existingCategories = await prisma.transactionCategory.findMany({
      where: {
        userId,
        name: {
          in: allCategories.map(cat => cat.name),
        },
      },
    });
    console.log(
      `[generateDemoFinanceData] Found ${existingCategories.length} existing categories (demo and non-demo)`,
    );

    const existingCategoryKeys = new Set(existingCategories.map(cat => `${cat.name}:${cat.type}`));

    const categoriesToCreate = allCategories.filter(
      cat => !existingCategoryKeys.has(`${cat.name}:${cat.type}`),
    );

    console.log(
      `[generateDemoFinanceData] Creating ${categoriesToCreate.length} new transaction categories`,
    );

    if (categoriesToCreate.length > 0) {
      try {
        await prisma.transactionCategory.createMany({
          data: categoriesToCreate.map(category => ({
            ...category,
            userId,
            isDemo: true,
          })),
          skipDuplicates: true,
        });
        console.log(
          `[generateDemoFinanceData] Created ${categoriesToCreate.length} transaction categories`,
        );
      } catch (error) {
        console.error(`[generateDemoFinanceData] Failed to create demo categories:`, {
          error: error instanceof Error ? error.message : 'Unknown error',
          categoriesToCreateCount: categoriesToCreate.length,
          userId,
        });
        throw error;
      }
    } else {
      console.log(
        `[generateDemoFinanceData] All demo categories already exist, using existing ${existingCategories.length} categories`,
      );
    }

    const createdCategories = await prisma.transactionCategory.findMany({
      where: {
        userId,
        name: {
          in: allCategories.map(cat => cat.name),
        },
      },
    });
    console.log(
      `[generateDemoFinanceData] Successfully loaded ${createdCategories.length} categories`,
    );

    // Generate demo transactions
    console.log(
      `[generateDemoFinanceData] Generating ${DEMO_TRANSACTIONS_COUNT} demo transactions`,
    );
    const demoTransactions = [];
    const transactionTypes = ['INCOME', 'EXPENSE'] as const;
    let skippedTransactions = 0;

    for (let i = 0; i < DEMO_TRANSACTIONS_COUNT; i++) {
      const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
      const availableCategories = createdCategories.filter(cat => cat.type === type);
      const selectedCategory =
        availableCategories[Math.floor(Math.random() * availableCategories.length)];
      const selectedAccount = createdAccounts[Math.floor(Math.random() * createdAccounts.length)];

      if (!selectedCategory || !selectedAccount) {
        console.warn(
          `[generateDemoFinanceData] Skipping transaction ${i} - missing category or account:`,
          {
            hasCategory: !!selectedCategory,
            hasAccount: !!selectedAccount,
            availableCategoriesCount: availableCategories.length,
            availableAccountsCount: createdAccounts.length,
          },
        );
        skippedTransactions++;
        continue;
      }

      // Adjust amounts based on currency
      let baseAmount;
      const accountCurrency = selectedAccount.currency;

      if (type === 'INCOME') {
        // Income amounts adjusted by currency
        switch (accountCurrency) {
          case 'EUR':
            baseAmount = Math.random() * 2800 + 900; // €900-3700
            break;
          case 'USD':
            baseAmount = Math.random() * 3000 + 1000; // $1000-4000
            break;
          case 'UAH':
            baseAmount = Math.random() * 120000 + 40000; // ₴40000-160000
            break;
          case 'HUF':
            baseAmount = Math.random() * 1200000 + 400000; // Ft400000-1600000
            break;
          default:
            baseAmount = Math.random() * 3000 + 1000;
        }
      } else {
        // Expense amounts adjusted by currency
        switch (accountCurrency) {
          case 'EUR':
            baseAmount = Math.random() * 450 + 18; // €18-468
            break;
          case 'USD':
            baseAmount = Math.random() * 500 + 20; // $20-520
            break;
          case 'UAH':
            baseAmount = Math.random() * 20000 + 800; // ₴800-20800
            break;
          case 'HUF':
            baseAmount = Math.random() * 200000 + 8000; // Ft8000-208000
            break;
          default:
            baseAmount = Math.random() * 500 + 20;
        }
      }

      demoTransactions.push({
        userId,
        accountId: selectedAccount.id,
        categoryId: selectedCategory.id,
        type: type as 'INCOME' | 'EXPENSE',
        amount: Math.round(baseAmount * 100) / 100, // Round to 2 decimal places
        currency: accountCurrency,
        description: generateTransactionDescription(
          selectedCategory.name,
          type as 'INCOME' | 'EXPENSE',
        ),
        date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Last 90 days
        isDemo: true,
      });

      // Log progress every 10 transactions
      if ((i + 1) % 10 === 0) {
        console.log(
          `[generateDemoFinanceData] Generated ${i + 1}/${DEMO_TRANSACTIONS_COUNT} transactions`,
        );
      }
    }

    console.log(
      `[generateDemoFinanceData] Transaction generation completed. Generated: ${demoTransactions.length}, Skipped: ${skippedTransactions}`,
    );

    if (demoTransactions.length === 0) {
      console.error(`[generateDemoFinanceData] No transactions generated`, {
        totalAttempted: DEMO_TRANSACTIONS_COUNT,
        skippedTransactions,
        userId,
      });
      throw new Error(
        `Failed to generate any transactions. Attempted: ${DEMO_TRANSACTIONS_COUNT}, Skipped: ${skippedTransactions}`,
      );
    }

    console.log(
      `[generateDemoFinanceData] Inserting ${demoTransactions.length} transactions into database`,
    );
    try {
      await prisma.transaction.createMany({ data: demoTransactions });
      console.log(`[generateDemoFinanceData] Successfully inserted transactions`);
    } catch (transactionError) {
      console.error(`[generateDemoFinanceData] Failed to insert transactions:`, {
        error: transactionError instanceof Error ? transactionError.message : 'Unknown error',
        stack: transactionError instanceof Error ? transactionError.stack : undefined,
        transactionsCount: demoTransactions.length,
        userId,
      });
      throw new Error(
        `Failed to insert transactions: ${transactionError instanceof Error ? transactionError.message : 'Unknown error'}`,
      );
    }

    // Generate demo budgets
    console.log(`[generateDemoFinanceData] Creating ${DEMO_BUDGETS_COUNT} demo budgets`);
    const expenseCategoryIds = createdCategories
      .filter(cat => cat.type === 'EXPENSE')
      .map(cat => cat.id);
    console.log(
      `[generateDemoFinanceData] Found ${expenseCategoryIds.length} expense categories for budgets`,
    );

    // Check existing demo budgets to avoid duplicates
    const existingDemoBudgets = await prisma.budget.findMany({
      where: {
        userId,
        isDemo: true,
      },
      select: {
        name: true,
      },
    });
    const existingBudgetNames = new Set(existingDemoBudgets.map(budget => budget.name));
    console.log(
      `[generateDemoFinanceData] Found ${existingDemoBudgets.length} existing demo budgets`,
    );

    for (let i = 0; i < DEMO_BUDGETS_COUNT; i++) {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - i);
      startDate.setDate(1);

      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0);

      // Use different currency for each budget
      const budgetCurrency = currencies[i % currencies.length] || 'EUR';
      const budgetName = `Budget ${startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} (${budgetCurrency})`;

      // Skip if budget with this name already exists
      if (existingBudgetNames.has(budgetName)) {
        console.log(
          `[generateDemoFinanceData] Skipping budget ${i + 1}/${DEMO_BUDGETS_COUNT}: ${budgetName} (already exists)`,
        );
        continue;
      }

      let totalPlanned;

      // Adjust budget amounts based on currency
      switch (budgetCurrency) {
        case 'EUR':
          totalPlanned = 2300;
          break;
        case 'USD':
          totalPlanned = 2500;
          break;
        case 'UAH':
          totalPlanned = 100000;
          break;
        case 'HUF':
          totalPlanned = 1000000;
          break;
        default:
          totalPlanned = 2500;
      }

      try {
        const budget = await prisma.budget.create({
          data: {
            userId,
            name: budgetName,
            period: 'MONTHLY',
            startDate,
            endDate,
            currency: budgetCurrency,
            totalPlanned,
            isDemo: true,
          },
        });
        console.log(
          `[generateDemoFinanceData] Created budget ${i + 1}/${DEMO_BUDGETS_COUNT}: ${budget.name}`,
        );

        // Create budget categories with currency-adjusted amounts
        const budgetCategories = expenseCategoryIds.slice(0, 6).map(categoryId => {
          let plannedBase, actualBase;

          // Adjust category amounts based on budget currency
          switch (budgetCurrency) {
            case 'EUR':
              plannedBase = Math.random() * 370 + 90; // €90-460
              actualBase = Math.random() * 420 + 45; // €45-465
              break;
            case 'USD':
              plannedBase = Math.random() * 400 + 100; // $100-500
              actualBase = Math.random() * 450 + 50; // $50-500
              break;
            case 'UAH':
              plannedBase = Math.random() * 16000 + 4000; // ₴4000-20000
              actualBase = Math.random() * 18000 + 2000; // ₴2000-20000
              break;
            case 'HUF':
              plannedBase = Math.random() * 160000 + 40000; // Ft40000-200000
              actualBase = Math.random() * 180000 + 20000; // Ft20000-200000
              break;
            default:
              plannedBase = Math.random() * 400 + 100;
              actualBase = Math.random() * 450 + 50;
          }

          return {
            budgetId: budget.id,
            categoryId,
            planned: Math.round(plannedBase * 100) / 100,
            actual: Math.round(actualBase * 100) / 100,
          };
        });

        await prisma.budgetCategory.createMany({ data: budgetCategories });
        console.log(
          `[generateDemoFinanceData] Created ${budgetCategories.length} budget categories for budget: ${budget.name}`,
        );
      } catch (budgetError) {
        console.error(`[generateDemoFinanceData] Failed to create budget ${i + 1}:`, {
          error: budgetError instanceof Error ? budgetError.message : 'Unknown error',
          stack: budgetError instanceof Error ? budgetError.stack : undefined,
          budgetIndex: i,
          userId,
        });
        throw budgetError;
      }
    }

    // Generate demo financial goals with diverse currencies
    console.log(`[generateDemoFinanceData] Creating demo financial goals with diverse currencies`);
    const allDemoGoals = [
      {
        name: 'Emergency Fund',
        description: '6 months of expenses saved for emergencies',
        targetAmount: 14000, // EUR
        currentAmount: 7900,
        currency: currencies[0] || 'EUR',
        deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        color: '#10B981',
        icon: '🏦',
        userId,
        isDemo: true,
      },
      {
        name: 'New MacBook Pro',
        description: 'Professional laptop for development work',
        targetAmount: 2500, // USD
        currentAmount: 1200,
        currency: currencies[1] || 'USD',
        deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months from now
        color: '#F59E0B',
        icon: '💻',
        userId,
        isDemo: true,
      },
      {
        name: 'Vacation in Mountains',
        description: 'Summer vacation with family in the mountains',
        targetAmount: 120000, // UAH
        currentAmount: 30000,
        currency: currencies[2] || 'UAH',
        deadline: new Date(Date.now() + 240 * 24 * 60 * 60 * 1000), // 8 months from now
        color: '#8B5CF6',
        icon: '🏔️',
        userId,
        isDemo: true,
      },
    ];

    // Check for existing financial goals to avoid duplicates
    console.log(`[generateDemoFinanceData] Checking for existing financial goals`);
    const existingGoalNames = allDemoGoals.map(goal => goal.name);
    const existingGoals = await prisma.financialGoal.findMany({
      where: {
        userId,
        name: {
          in: existingGoalNames,
        },
      },
    });
    console.log(`[generateDemoFinanceData] Found ${existingGoals.length} existing financial goals`);

    const existingGoalNamesSet = new Set(existingGoals.map(goal => goal.name));
    const goalsToCreate = allDemoGoals.filter(goal => !existingGoalNamesSet.has(goal.name));

    if (goalsToCreate.length > 0) {
      console.log(`[generateDemoFinanceData] Creating ${goalsToCreate.length} new financial goals`);
      try {
        await prisma.financialGoal.createMany({
          data: goalsToCreate,
          skipDuplicates: true,
        });
        console.log(
          `[generateDemoFinanceData] Successfully created ${goalsToCreate.length} financial goals`,
        );
      } catch (goalsError) {
        console.error(`[generateDemoFinanceData] Failed to create financial goals:`, {
          error: goalsError instanceof Error ? goalsError.message : 'Unknown error',
          stack: goalsError instanceof Error ? goalsError.stack : undefined,
          goalsCount: goalsToCreate.length,
          userId,
        });
        throw new Error(
          `Failed to create financial goals: ${goalsError instanceof Error ? goalsError.message : 'Unknown error'}`,
        );
      }
    } else {
      console.log(
        `[generateDemoFinanceData] All demo financial goals already exist, using existing ${existingGoals.length} goals`,
      );
    }

    const totalGoals = existingGoals.length + goalsToCreate.length;

    const result = {
      accounts: createdAccounts.length,
      categories: createdCategories.length,
      transactions: demoTransactions.length,
      budgets: DEMO_BUDGETS_COUNT,
      goals: totalGoals,
    };

    console.log(
      `[generateDemoFinanceData] Successfully completed demo finance data generation:`,
      result,
    );
    return result;
  } catch (error) {
    console.error(`[generateDemoFinanceData] Function failed:`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      userId,
    });
    throw new Error(
      `Failed to generate demo finance data: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

function generateTransactionDescription(categoryName: string, _type: 'INCOME' | 'EXPENSE'): string {
  const descriptions: Record<string, string[]> = {
    // Income descriptions
    Salary: ['Monthly salary payment', 'Payroll deposit', 'Salary for this month'],
    Freelance: ['Website development project', 'Freelance design work', 'Consulting services'],
    'Investment Returns': ['Stock dividends', 'Bond interest payment', 'Investment profits'],
    'Side Business': ['Online store sales', 'Product sales', 'Service revenue'],

    // Expense descriptions
    Groceries: [
      'Weekly grocery shopping',
      'Supermarket visit',
      'Food and household items',
      'Fresh produce',
    ],
    Transport: ['Gas station fill-up', 'Public transport card', 'Taxi ride', 'Uber ride'],
    Entertainment: ['Movie tickets', 'Concert tickets', 'Streaming subscription', 'Gaming'],
    Utilities: ['Electricity bill', 'Internet bill', 'Water bill', 'Phone bill'],
    Restaurants: ['Dinner at restaurant', 'Lunch takeout', 'Coffee shop', 'Fast food'],
    Shopping: ['Clothing purchase', 'Electronics', 'Home goods', 'Online shopping'],
    Healthcare: ['Doctor visit', 'Pharmacy', 'Health insurance', 'Dental checkup'],
    Education: ['Course enrollment', 'Books purchase', 'Online learning', 'Training program'],
  };

  const categoryDescriptions = descriptions[categoryName] || [`${categoryName} transaction`];
  return (
    categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)] ||
    `${categoryName} transaction`
  );
}

async function removeDemoFinanceData(userId: string) {
  try {
    // Remove in order to respect foreign key constraints

    // Remove budget categories first
    await prisma.budgetCategory.deleteMany({
      where: {
        budget: {
          userId,
          isDemo: true,
        },
      },
    });

    // Remove budgets
    await prisma.budget.deleteMany({
      where: {
        userId,
        isDemo: true,
      },
    });

    // Remove transactions
    await prisma.transaction.deleteMany({
      where: {
        userId,
        isDemo: true,
      },
    });

    // Remove transaction categories
    await prisma.transactionCategory.deleteMany({
      where: {
        userId,
        isDemo: true,
      },
    });

    // Remove financial goals
    await prisma.financialGoal.deleteMany({
      where: {
        userId,
        isDemo: true,
      },
    });

    // Remove finance accounts
    const result = await prisma.financeAccount.deleteMany({
      where: {
        userId,
        isDemo: true,
      },
    });

    return result;
  } catch (error) {
    throw new Error(
      `Failed to remove demo finance data: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

export async function POST(request: Request) {
  console.log('[POST /api/demo-mode] Request received');

  try {
    console.log('[POST /api/demo-mode] Getting server session');
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.warn('[POST /api/demo-mode] Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log(`[POST /api/demo-mode] Session found for user: ${session.user.email}`);

    console.log('[POST /api/demo-mode] Parsing request body');
    const { action } = await request.json();
    if (!action || (action !== 'add' && action !== 'remove')) {
      console.warn(`[POST /api/demo-mode] Invalid action provided: ${action}`);
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    console.log(`[POST /api/demo-mode] Action: ${action}`);

    console.log(`[POST /api/demo-mode] Looking up user: ${session.user.email}`);
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    console.log(`[POST /api/demo-mode] User lookup result: ${user ? 'found' : 'not found'}`);

    // Create user if not exists (for NextAuth users)
    if (!user) {
      console.log(`[POST /api/demo-mode] Creating new user for email: ${session.user.email}`);
      let newUser;
      try {
        newUser = await prisma.user.create({
          data: {
            email: session.user.email,
            password: 'nextauth_user', // Placeholder for NextAuth users
          },
        });
        console.log(`[POST /api/demo-mode] Successfully created user with ID: ${newUser.id}`);

        // Create default category for new user
        console.log(`[POST /api/demo-mode] Creating default category for new user: ${newUser.id}`);
        try {
          const defaultCategory = await prisma.category.create({
            data: {
              name: 'solo',
              userId: newUser.id,
            },
          });
          console.log(
            `[POST /api/demo-mode] Successfully created default category with ID: ${defaultCategory.id}`,
          );
        } catch (categoryError) {
          console.error(`[POST /api/demo-mode] Failed to create default category:`, {
            error: categoryError instanceof Error ? categoryError.message : 'Unknown error',
            stack: categoryError instanceof Error ? categoryError.stack : undefined,
            userId: newUser.id,
            email: session.user.email,
          });
          // Don't throw here, as user creation succeeded
        }
      } catch (userError) {
        console.error(`[POST /api/demo-mode] Failed to create user:`, {
          error: userError instanceof Error ? userError.message : 'Unknown error',
          stack: userError instanceof Error ? userError.stack : undefined,
          email: session.user.email,
        });
        return NextResponse.json(
          {
            error: 'Failed to create user account',
            details: userError instanceof Error ? userError.message : 'Unknown error',
          },
          { status: 500 },
        );
      }

      if (action === 'add') {
        console.log(`[POST /api/demo-mode] Adding demo data for new user: ${newUser.id}`);
        try {
          const _tradeResults = await generateDemoTrades(newUser.id);
          const financeResults = await generateDemoFinanceData(newUser.id);
          console.log(`[POST /api/demo-mode] Successfully added demo data for new user`);

          return NextResponse.json({
            message: 'Demo data added successfully',
            details: {
              trades: DEMO_TRADES_COUNT,
              finance: financeResults,
            },
          });
        } catch (demoError) {
          console.error(`[POST /api/demo-mode] Failed to add demo data for new user:`, {
            error: demoError instanceof Error ? demoError.message : 'Unknown error',
            stack: demoError instanceof Error ? demoError.stack : undefined,
            userId: newUser.id,
          });
          return NextResponse.json(
            {
              error: 'Failed to generate demo data',
              details: demoError instanceof Error ? demoError.message : 'Unknown error',
            },
            { status: 500 },
          );
        }
      } else {
        console.log(`[POST /api/demo-mode] No demo data to remove for new user`);
        return NextResponse.json({ message: 'No demo data to remove' });
      }
    }

    if (action === 'add') {
      console.log(`[POST /api/demo-mode] Adding demo data for existing user: ${user.id}`);
      try {
        const _tradeResults = await generateDemoTrades(user.id);
        const financeResults = await generateDemoFinanceData(user.id);
        console.log(`[POST /api/demo-mode] Successfully added demo data for existing user`);

        return NextResponse.json({
          message: 'Demo data added successfully',
          details: {
            trades: DEMO_TRADES_COUNT,
            finance: financeResults,
          },
        });
      } catch (demoError) {
        console.error(`[POST /api/demo-mode] Failed to add demo data for existing user:`, {
          error: demoError instanceof Error ? demoError.message : 'Unknown error',
          stack: demoError instanceof Error ? demoError.stack : undefined,
          userId: user.id,
        });
        return NextResponse.json(
          {
            error: 'Failed to generate demo data',
            details: demoError instanceof Error ? demoError.message : 'Unknown error',
          },
          { status: 500 },
        );
      }
    } else {
      console.log(`[POST /api/demo-mode] Removing demo data for user: ${user.id}`);
      try {
        await removeDemoTrades(user.id);
        await removeDemoFinanceData(user.id);
        console.log(`[POST /api/demo-mode] Successfully removed demo data`);

        return NextResponse.json({ message: 'Demo data removed successfully' });
      } catch (removeError) {
        console.error(`[POST /api/demo-mode] Failed to remove demo data:`, {
          error: removeError instanceof Error ? removeError.message : 'Unknown error',
          stack: removeError instanceof Error ? removeError.stack : undefined,
          userId: user.id,
        });
        return NextResponse.json(
          {
            error: 'Failed to remove demo data',
            details: removeError instanceof Error ? removeError.message : 'Unknown error',
          },
          { status: 500 },
        );
      }
    }
  } catch (error) {
    console.error('[POST /api/demo-mode] Unhandled error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
