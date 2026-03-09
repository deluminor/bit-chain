import { TRADE_SIDES } from '@/features/positions/types/position';
import { createTradeData } from '@/features/positions/utils/trade';
import { prisma } from '@/lib/prisma';
import { DEMO_TRADES_COUNT } from './demo-mode.constants';
import { demoDebug, randomBetween, randomOf, validateDemoUserId } from './demo-mode.utils';

async function ensureTradeCategory(userId: string): Promise<Array<{ id: string; name: string }>> {
  const categories = await prisma.category.findMany({
    where: { userId },
    select: { id: true, name: true },
  });

  if (categories.length > 0) {
    return categories;
  }

  const created = await prisma.category.create({
    data: {
      name: 'solo',
      userId,
    },
  });

  return [created];
}

export async function generateDemoTrades(userId: string): Promise<void> {
  validateDemoUserId(userId);

  const symbols = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP'] as const;
  const sides = Object.values(TRADE_SIDES);
  const categories = await ensureTradeCategory(userId);

  const data = Array.from({ length: DEMO_TRADES_COUNT }).flatMap(() => {
    try {
      const isWin = Math.random() > 0.5;
      const entryPrice = randomBetween(100, 1100);
      const exitPrice = isWin
        ? entryPrice * (1 + Math.random() * 0.1)
        : entryPrice * (1 - Math.random() * 0.1);

      const base = createTradeData({
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        stopLoss: entryPrice * (1 - Math.random() * 0.05),
        commission: Math.random() * 10,
        deposit: randomBetween(100, 1100),
        symbol: randomOf(symbols),
        side: randomOf(sides),
        entryPrice,
        positionSize: randomBetween(1, 11),
        exitPrice,
        leverage: Math.floor(Math.random() * 5) + 1,
      });

      const { category: _category, ...clean } = base;
      const category = randomOf(categories);

      return [{ ...clean, userId, categoryId: category.id, isDemo: true }];
    } catch (error) {
      demoDebug('[generateDemoTrades] Skipping invalid trade', error);
      return [];
    }
  });

  if (data.length === 0) {
    throw new Error('Failed to generate demo trades');
  }

  await prisma.trade.createMany({ data });
  demoDebug('[generateDemoTrades] Trades inserted', { count: data.length });
}

export async function removeDemoTrades(userId: string): Promise<void> {
  validateDemoUserId(userId);
  await prisma.trade.deleteMany({
    where: {
      userId,
      isDemo: true,
    },
  });
}
