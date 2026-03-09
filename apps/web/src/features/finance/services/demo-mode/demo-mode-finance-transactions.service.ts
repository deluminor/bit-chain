import { prisma } from '@/lib/prisma';
import { DEMO_TRANSACTIONS_COUNT } from './demo-mode.constants';
import type { DemoFinanceAccountRef, DemoFinanceCategoryRef } from './demo-mode-finance.types';
import { buildTransactionDescription, randomBetween, randomOf, round2 } from './demo-mode.utils';

function randomAmountForCurrency(type: 'INCOME' | 'EXPENSE', currency: string): number {
  if (type === 'INCOME') {
    switch (currency) {
      case 'EUR':
        return randomBetween(900, 3700);
      case 'USD':
        return randomBetween(1000, 4000);
      case 'UAH':
        return randomBetween(40000, 160000);
      case 'HUF':
        return randomBetween(400000, 1600000);
      default:
        return randomBetween(1000, 4000);
    }
  }

  switch (currency) {
    case 'EUR':
      return randomBetween(18, 468);
    case 'USD':
      return randomBetween(20, 520);
    case 'UAH':
      return randomBetween(800, 20800);
    case 'HUF':
      return randomBetween(8000, 208000);
    default:
      return randomBetween(20, 520);
  }
}

export async function generateDemoFinanceTransactions(
  userId: string,
  accounts: DemoFinanceAccountRef[],
  categories: DemoFinanceCategoryRef[],
): Promise<number> {
  const transactionTypes = ['INCOME', 'EXPENSE'] as const;

  const data = Array.from({ length: DEMO_TRANSACTIONS_COUNT }).flatMap(() => {
    const type = randomOf(transactionTypes);
    const typeCategories = categories.filter(category => category.type === type);
    const selectedCategory = typeCategories.length > 0 ? randomOf(typeCategories) : null;
    const selectedAccount = accounts.length > 0 ? randomOf(accounts) : null;

    if (!selectedCategory || !selectedAccount) {
      return [];
    }

    return [
      {
        userId,
        accountId: selectedAccount.id,
        categoryId: selectedCategory.id,
        type,
        amount: round2(randomAmountForCurrency(type, selectedAccount.currency)),
        currency: selectedAccount.currency,
        description: buildTransactionDescription(selectedCategory.name),
        date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        isDemo: true,
      },
    ];
  });

  if (data.length === 0) {
    throw new Error('Failed to generate any demo finance transactions');
  }

  await prisma.transaction.createMany({ data });
  return data.length;
}
