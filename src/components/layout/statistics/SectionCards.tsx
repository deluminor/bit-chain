'use client';

import { formatCurrency } from '@/app/(protected)/journal/utils/formatters';
import { StatCardSkeleton } from '@/components/layout/statistics/StatCardSkeleton';
import { useTradingStats } from '@/hooks/useTradingStats';
import { StatCard } from './StatCard';

export function SectionCards() {
  const { stats, isLoading } = useTradingStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:from-transparent lg:px-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!stats) return;

  const currentWinRate =
    stats.winLossData.find(d => d.type.toLowerCase() === 'winning')?.percentage || 0;
  const avgWinRate = 50;
  const winRateChange = ((currentWinRate - avgWinRate) / avgWinRate) * 100;

  const totalTrades = stats.categoriesData.reduce((sum, cat) => sum + cat.trades, 0);
  const avgTradesPerCategory = totalTrades / stats.categoriesData.length;
  const tradesChange = ((totalTrades - avgTradesPerCategory) / avgTradesPerCategory) * 100 || 0;

  const totalPnL = stats.pnlData[stats.pnlData.length - 1]?.pnl || 0;
  const prevPnL = stats.pnlData[stats.pnlData.length - 2]?.pnl || 0;

  // Fixed PnL change calculation to handle negative values correctly
  let pnlChange = 0;
  if (prevPnL !== 0) {
    // For negative to negative comparison, check if getting better or worse
    if (prevPnL < 0 && totalPnL < 0) {
      // If both negative, less negative is an improvement
      pnlChange = ((Math.abs(prevPnL) - Math.abs(totalPnL)) / Math.abs(prevPnL)) * 100;
    } else {
      pnlChange = ((totalPnL - prevPnL) / Math.abs(prevPnL)) * 100;
    }
  } else if (totalPnL !== 0) {
    // If previous was 0, calculate based on current value
    pnlChange = totalPnL > 0 ? 100 : -100;
  }

  const mostTradedCategory = stats.categoriesData[0]?.category || 'N/A';
  // Handle both string and object format safely
  const categoryName =
    typeof mostTradedCategory === 'object' && mostTradedCategory !== null
      ? mostTradedCategory.name || 'N/A'
      : mostTradedCategory;

  const formattedCategory = categoryName
    .split('_')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  const cards = [
    {
      title: 'Total PnL',
      value: formatCurrency(totalPnL),
      description: 'Profit and Loss',
      trend: {
        value: Number(pnlChange.toFixed(2)),
        label: 'PnL Change',
        isPositive: pnlChange > 0,
      },
      footer: {
        title: pnlChange > 0 ? 'Growing profits' : 'Declining performance',
        description: 'Compared to previous period',
      },
    },
    {
      title: 'Win Rate',
      value: `${currentWinRate.toFixed(1)}%`,
      description: 'Percentage of winning trades',
      trend: {
        value: Number(winRateChange.toFixed(2)),
        label: 'Win Rate Change',
        isPositive: winRateChange > 0,
      },
      footer: {
        title: winRateChange > 0 ? 'Above average performance' : 'Below average performance',
        description: 'Compared to 50% baseline',
      },
    },
    {
      title: 'Most Traded',
      value: formattedCategory,
      description: 'Most active trading category',
      trend: {
        value: Number(stats.categoriesData[0]?.trades.toFixed(2)) || 0,
        label: 'Trades',
        isPositive: true,
      },
      footer: {
        title: 'Leading category',
        description: 'Based on trade volume',
      },
    },
    {
      title: 'Total Trades',
      value: totalTrades,
      description: 'Number of trades executed',
      trend: {
        value: Number(tradesChange.toFixed(2)),
        label: 'Trades Change',
        isPositive: tradesChange > 0,
      },
      footer: {
        title: tradesChange > 0 ? 'Active trading' : 'Reduced activity',
        description: 'Compared to category average',
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 *:data-[slot=card]:bg-card dark:*:data-[slot=card]:from-transparent lg:px-6">
        {cards.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            description={card.description}
            trend={card.trend}
            footer={card.footer}
          />
        ))}
      </div>
    </div>
  );
}
