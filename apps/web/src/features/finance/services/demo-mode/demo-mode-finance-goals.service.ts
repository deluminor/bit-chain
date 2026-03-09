import { prisma } from '@/lib/prisma';
import { SUPPORTED_CURRENCIES } from '@/lib/currency';

export async function ensureDemoGoals(userId: string): Promise<number> {
  const currencies = Object.keys(SUPPORTED_CURRENCIES);

  const goals = [
    {
      name: 'Emergency Fund',
      description: '6 months of expenses saved for emergencies',
      targetAmount: 14000,
      currentAmount: 7900,
      currency: currencies[0] || 'EUR',
      deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      color: '#10B981',
      icon: '🏦',
      userId,
      isDemo: true,
    },
    {
      name: 'New MacBook Pro',
      description: 'Professional laptop for development work',
      targetAmount: 2500,
      currentAmount: 1200,
      currency: currencies[1] || 'USD',
      deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      color: '#F59E0B',
      icon: '💻',
      userId,
      isDemo: true,
    },
    {
      name: 'Vacation in Mountains',
      description: 'Summer vacation with family in the mountains',
      targetAmount: 120000,
      currentAmount: 30000,
      currency: currencies[2] || 'UAH',
      deadline: new Date(Date.now() + 240 * 24 * 60 * 60 * 1000),
      color: '#8B5CF6',
      icon: '🏔️',
      userId,
      isDemo: true,
    },
  ];

  const existing = await prisma.financialGoal.findMany({
    where: {
      userId,
      name: { in: goals.map(goal => goal.name) },
    },
    select: { name: true },
  });

  const existingNames = new Set(existing.map(goal => goal.name));
  const toCreate = goals.filter(goal => !existingNames.has(goal.name));

  if (toCreate.length > 0) {
    await prisma.financialGoal.createMany({
      data: toCreate,
      skipDuplicates: true,
    });
  }

  return existing.length + toCreate.length;
}
