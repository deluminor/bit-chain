'use client';

import { TotalBalanceDisplay } from '@/components/layout/TotalBalanceDisplay';

/**
 * BalanceCard component that displays total balance in EUR
 * instead of showing multiple currencies like €54.68 + ₴-1,367.43 + $36,290.5
 */
interface BalanceCardProps {
  title?: string;
  subtitle?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export function BalanceCard({
  title = 'Total Balance',
  subtitle = 'Consolidated across all accounts',
  className = '',
  size = 'lg',
  showDetails = true,
}: BalanceCardProps) {
  return (
    <div className={`text-center ${className}`}>
      <div className="space-y-2">
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
        <div className="text-2xl font-bold text-green-600">
          <TotalBalanceDisplay size={size} className="text-green-600" />
        </div>
        {subtitle && showDetails && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}

/**
 * NetWorthDisplay component for showing consolidated net worth
 * Replaces problematic multi-currency displays
 */
interface NetWorthDisplayProps {
  className?: string;
  showAccountCount?: boolean;
}

export function NetWorthDisplay({ className = '', showAccountCount = true }: NetWorthDisplayProps) {
  return (
    <div className={`bg-card border rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Net Worth</h3>
      </div>

      <div className="text-center">
        <div className="text-3xl font-bold text-green-600 mb-2">
          <TotalBalanceDisplay size="lg" className="text-green-600" />
        </div>
        {showAccountCount && (
          <p className="text-sm text-muted-foreground">Across all active accounts</p>
        )}
      </div>
    </div>
  );
}
