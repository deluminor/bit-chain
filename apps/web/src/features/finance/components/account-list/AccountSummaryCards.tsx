'use client';

import { TotalBalanceDisplay } from '@/components/layout/TotalBalanceDisplay';
import { Card } from '@/components/ui/card';
import { formatSummaryAmount } from '@/lib/currency';
import { Activity, DollarSign, TrendingUp, Wallet } from 'lucide-react';

interface AccountSummary {
  total: number;
  active: number;
  inactive: number;
  totalBalance: number;
}

interface AccountSummaryCardsProps {
  isLoading: boolean;
  isConverting: boolean;
  totalBalanceEUR: number;
  summary: AccountSummary;
}

export function AccountSummaryCards({
  isLoading,
  isConverting,
  totalBalanceEUR,
  summary,
}: AccountSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <Card className="p-4 sm:p-5 lg:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div className="p-1.5 sm:p-2 bg-purple-500/10 rounded-lg">
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
          </div>
          <h3 className="font-medium sm:font-semibold text-sm sm:text-base">Total Balance</h3>
        </div>
        <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">
          <TotalBalanceDisplay size="md" showLoading={isLoading} />
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">Converted to EUR</p>
      </Card>

      <Card className="p-4 sm:p-5 lg:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div className="p-1.5 sm:p-2 bg-orange-500/10 rounded-lg">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
          </div>
          <h3 className="font-medium sm:font-semibold text-sm sm:text-base">Avg Balance</h3>
        </div>
        <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">
          {isConverting ? (
            <span className="text-muted-foreground">Converting...</span>
          ) : (
            formatSummaryAmount(totalBalanceEUR / Math.max(summary.active, 1))
          )}
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">Per active account</p>
      </Card>

      <Card className="p-4 sm:p-5 lg:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-lg">
            <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
          </div>
          <h3 className="font-medium sm:font-semibold text-sm sm:text-base">Total Accounts</h3>
        </div>
        <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">{summary.total}</div>
        <p className="text-xs sm:text-sm text-muted-foreground">All accounts</p>
      </Card>

      <Card className="p-4 sm:p-5 lg:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div className="p-1.5 sm:p-2 bg-green-500/10 rounded-lg">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
          </div>
          <h3 className="font-medium sm:font-semibold text-sm sm:text-base">Active</h3>
        </div>
        <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">{summary.active}</div>
        <p className="text-xs sm:text-sm text-muted-foreground">Currently active</p>
      </Card>
    </div>
  );
}
