'use client';

import { useTradingStats } from '@/hooks/useTradingStats';
import { useMemo } from 'react';
import { RadarChartComponent } from './RadarChartComponent';

const COLOR = 'hsl(var(--chart-1))';

export function CurrencyDistributionChart() {
  const { stats, isLoading } = useTradingStats();

  const data = useMemo(
    () =>
      stats?.currencyData.map(entry => ({
        name: entry.pair,
        value: entry.percentage,
      })) || [],
    [stats?.currencyData],
  );

  // Find most traded currency
  const mostTradedCurrency = useMemo(() => {
    if (!data.length) return null;
    return data.reduce((prev, current) => (prev.value > current.value ? prev : current));
  }, [data]);

  return (
    <RadarChartComponent
      title="Currency Distribution"
      description="Distribution of trades by currency"
      data={data}
      color={COLOR}
      isLoading={isLoading}
      footer={
        <div className="text-sm text-muted-foreground">
          Most traded currency:{' '}
          <span className="font-medium">{mostTradedCurrency?.name || 'None'}</span>
          {mostTradedCurrency && <span> ({mostTradedCurrency.value}%)</span>}
        </div>
      }
    />
  );
}
