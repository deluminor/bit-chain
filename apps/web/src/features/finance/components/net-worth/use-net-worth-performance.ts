import { useMemo } from 'react';
import type { NetWorthDataPoint, NetWorthPerformance } from './net-worth.types';

export function useNetWorthPerformance(chartData: NetWorthDataPoint[]): NetWorthPerformance {
  return useMemo(() => {
    if (chartData.length < 2) {
      const currentNetWorth = chartData[0]?.netWorth || 0;
      return {
        currentNetWorth,
        startNetWorth: currentNetWorth,
        totalChange: 0,
        percentageChange: 0,
        highestNetWorth: currentNetWorth,
        lowestNetWorth: currentNetWorth,
        averageChange: 0,
      };
    }

    const current = chartData[chartData.length - 1]?.netWorth || 0;
    const start = chartData[0]?.netWorth || 0;
    const totalChange = current - start;
    const percentageChange =
      Math.abs(start) > 1
        ? (totalChange / start) * 100
        : totalChange > 0
          ? 100
          : totalChange < 0
            ? -100
            : 0;

    const values = chartData.map(item => item.netWorth);
    const highest = Math.max(...values);
    const lowest = Math.min(...values);

    const changes = chartData.slice(1).map(item => item.change);
    const averageChange =
      changes.length > 0 ? changes.reduce((sum, change) => sum + change, 0) / changes.length : 0;

    return {
      currentNetWorth: current,
      startNetWorth: start,
      totalChange,
      percentageChange,
      highestNetWorth: highest,
      lowestNetWorth: lowest,
      averageChange,
    };
  }, [chartData]);
}
