'use client';

import { useTradingStats } from '@/hooks/useTradingStats';
import { TrendingUp } from 'lucide-react';
import { RadialChartComponent } from './RadialChartComponent';

import { CHART_COLORS } from '@/constants/colors';

const COLORS = {
  LONG: CHART_COLORS.SUCCESS.DEFAULT,
  SHORT: CHART_COLORS.WARNING.DEFAULT,
};

export function ShortLongChart() {
  const { stats, isLoading } = useTradingStats();

  const data =
    stats?.shortLongData.map(entry => ({
      name: entry.type,
      percentage: entry.percentage,
    })) || [];

  // Filter to show only Long positions (we'll display a single gauge)
  const longData = data.filter(item => item.name === 'Long');

  // Use 0 as fallback if no data is available
  const longPercentage = longData[0]?.percentage || 0;

  // Example values for trend demonstration - in a real app these would come from backend
  const previousLongPercentage = longPercentage > 5 ? longPercentage - 5 : longPercentage + 5;
  const percentageDifference = longPercentage - previousLongPercentage;

  return (
    <RadialChartComponent
      title="Long Positions"
      description="Percentage of long positions in your portfolio"
      data={longData.length > 0 ? longData : [{ name: 'Long', percentage: 0 }]}
      colors={[COLORS.LONG]}
      isLoading={isLoading}
      footer={
        <div>
          <div className="flex items-center gap-2 font-medium leading-none">
            {percentageDifference > 0 ? 'Increased' : 'Decreased'} by{' '}
            {Math.abs(percentageDifference).toFixed(1)}%
            <TrendingUp
              className={`h-4 w-4 ${percentageDifference >= 0 ? 'text-green-500' : 'text-red-500 transform rotate-180'}`}
            />
          </div>
          <div className="leading-none text-muted-foreground pt-1">
            Based on your last 30 days of trading
          </div>
        </div>
      }
    />
  );
}
