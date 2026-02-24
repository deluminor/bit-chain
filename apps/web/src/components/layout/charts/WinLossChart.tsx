'use client';

import { useTradingStats } from '@/hooks/useTradingStats';
import { TrendingUp } from 'lucide-react';
import { RadialChartComponent } from './RadialChartComponent';

import { CHART_COLORS } from '@/constants/colors';

const COLORS = {
  WINNING: CHART_COLORS.SUCCESS.DEFAULT,
  LOSING: CHART_COLORS.WARNING.DEFAULT,
};

export function WinLossChart() {
  const { stats, isLoading } = useTradingStats();

  const data =
    stats?.winLossData.map(entry => ({
      name: entry.type,
      percentage: entry.percentage,
    })) || [];

  // Filter to show only Winning trades (we'll display a single gauge)
  const winningData = data.filter(item => item.name === 'Winning');

  // Use 0 as fallback if no data is available
  const winPercentage = winningData[0]?.percentage || 0;

  // Example values for trend demonstration - in a real app these would come from backend
  const winRateChange = winPercentage > 3 ? 2.7 : -1.5;

  return (
    <RadialChartComponent
      title="Win Rate"
      description="Percentage of winning trades"
      data={winningData.length > 0 ? winningData : [{ name: 'Winning', percentage: 0 }]}
      colors={[COLORS.WINNING]}
      isLoading={isLoading}
      footer={
        <div>
          <div className="flex items-center gap-2 font-medium leading-none">
            {winRateChange > 0 ? 'Up' : 'Down'} by {Math.abs(winRateChange).toFixed(1)}% this month
            <TrendingUp
              className={`h-4 w-4 ${winRateChange >= 0 ? 'text-green-500' : 'text-red-500 transform rotate-180'}`}
            />
          </div>
          <div className="leading-none text-muted-foreground pt-1">
            Compared to your historical average
          </div>
        </div>
      }
    />
  );
}
