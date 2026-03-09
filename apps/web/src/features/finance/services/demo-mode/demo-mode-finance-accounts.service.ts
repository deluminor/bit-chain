import { prisma } from '@/lib/prisma';
import { SUPPORTED_CURRENCIES } from '@/lib/currency';
import { DEMO_ACCOUNT_NAMES } from './demo-mode.constants';
import type { DemoAccountSeed, DemoFinanceAccountRef } from './demo-mode-finance.types';

function buildDemoAccounts(): DemoAccountSeed[] {
  const currencies = Object.keys(SUPPORTED_CURRENCIES);

  return [
    {
      name: 'Main Bank Account',
      type: 'BANK_CARD',
      currency: currencies[0] || 'EUR',
      balance: 3420.5,
      color: '#3B82F6',
      icon: 'CreditCard',
    },
    {
      name: 'Savings Account',
      type: 'SAVINGS',
      currency: currencies[1] || 'USD',
      balance: 17200,
      color: '#10B981',
      icon: 'PiggyBank',
    },
    {
      name: 'Cash Wallet',
      type: 'CASH',
      currency: currencies[2] || 'UAH',
      balance: 15200,
      color: '#F59E0B',
      icon: 'Wallet',
    },
    {
      name: 'Investment Account',
      type: 'INVESTMENT',
      currency: currencies[3] || 'HUF',
      balance: 3850000,
      color: '#8B5CF6',
      icon: 'TrendingUp',
    },
  ] satisfies DemoAccountSeed[];
}

export async function ensureDemoFinanceAccounts(userId: string): Promise<DemoFinanceAccountRef[]> {
  const existing = await prisma.financeAccount.findMany({
    where: {
      userId,
      isDemo: true,
      name: { in: [...DEMO_ACCOUNT_NAMES] },
    },
    select: { id: true, name: true, currency: true },
  });

  const existingNames = new Set(existing.map(account => account.name));
  const seeds = buildDemoAccounts().filter(account => !existingNames.has(account.name));

  if (seeds.length > 0) {
    await Promise.all(
      seeds.map(seed =>
        prisma.financeAccount.create({
          data: {
            ...seed,
            userId,
            isDemo: true,
          },
        }),
      ),
    );
  }

  return prisma.financeAccount.findMany({
    where: {
      userId,
      name: { in: [...DEMO_ACCOUNT_NAMES] },
    },
    select: { id: true, name: true, currency: true },
  });
}
