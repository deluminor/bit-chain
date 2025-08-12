'use client';

import { useTradingStats } from '@/hooks/useTradingStats';
import { useMemo } from 'react';
import { RadarChartComponent } from './RadarChartComponent';

import { CHART_COLORS } from '@/constants/colors';

const COLOR = CHART_COLORS.PRIMARY.DEFAULT;

export function CategoryChart() {
  const { stats, isLoading } = useTradingStats();

  const data = useMemo(() => {
    if (!stats?.categoriesData?.length) return [];

    // Sort by trades count in descending order
    return [...stats.categoriesData]
      .sort((a, b) => b.trades - a.trades)
      .map(entry => ({
        name: typeof entry.category === 'object' ? entry.category.name : String(entry.category),
        value: entry.trades,
      }));
  }, [stats?.categoriesData]);

  // Calculate total trades
  const totalTrades = useMemo(() => {
    if (!stats?.categoriesData.length) return 0;
    return stats.categoriesData.reduce((sum, category) => sum + category.trades, 0);
  }, [stats?.categoriesData]);

  // Find most traded category
  const mostTradedCategory = useMemo(() => {
    if (!stats?.categoriesData?.length) return null;

    // Use reduce to find the category with maximum trades
    return stats.categoriesData.reduce((max, current) =>
      current.trades > (max?.trades || 0) ? current : max,
    );
  }, [stats?.categoriesData]);

  // Calculate percentage for most traded category
  const mostTradedPercentage = useMemo(() => {
    if (!mostTradedCategory || totalTrades === 0) return 0;
    return Math.round((mostTradedCategory.trades / totalTrades) * 100);
  }, [mostTradedCategory, totalTrades]);

  return (
    <RadarChartComponent
      title="Trade Categories"
      description="Distribution of trades by category"
      data={data}
      color={COLOR}
      isLoading={isLoading}
      footer={
        <div className="text-sm text-muted-foreground">
          Most traded category:{' '}
          <span className="font-medium">
            {typeof mostTradedCategory?.category === 'object'
              ? mostTradedCategory?.category?.name
              : mostTradedCategory?.category || 'None'}
          </span>
          {mostTradedCategory && <span> ({mostTradedPercentage}% of trades)</span>}
        </div>
      }
    />
  );
}
