export interface AccountBalance {
  accountId: string;
  accountName: string;
  originalAmount: number;
  originalCurrency: string;
  convertedAmount: number;
  accountColor?: string;
  isActive: boolean;
}

export interface BalanceOverviewProps {
  className?: string;
  showDetails?: boolean;
  refreshInterval?: number;
}
