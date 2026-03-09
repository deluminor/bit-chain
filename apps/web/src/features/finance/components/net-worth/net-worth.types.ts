export interface NetWorthDataPoint {
  date: string;
  netWorth: number;
  totalAssets: number;
  change: number;
}

export interface NetWorthPerformance {
  currentNetWorth: number;
  startNetWorth: number;
  totalChange: number;
  percentageChange: number;
  highestNetWorth: number;
  lowestNetWorth: number;
  averageChange: number;
}
