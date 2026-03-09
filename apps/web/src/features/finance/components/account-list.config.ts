import { CreditCard, PiggyBank, TrendingUp, Wallet } from 'lucide-react';

export const accountTypeIcons = {
  CASH: Wallet,
  BANK_CARD: CreditCard,
  SAVINGS: PiggyBank,
  INVESTMENT: TrendingUp,
};

export const getAccountTypeColor = (type: string): string => {
  switch (type) {
    case 'CASH':
      return 'text-income bg-income/10';
    case 'BANK_CARD':
      return 'text-transfer bg-transfer/10';
    case 'SAVINGS':
      return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
    case 'INVESTMENT':
      return 'text-amber-600 bg-amber-100 dark:bg-amber-900/20';
    default:
      return 'text-muted-foreground bg-muted';
  }
};

export const getBalanceColor = (balance: number): string => {
  if (balance > 0) {
    return 'text-income';
  }

  if (balance < 0) {
    return 'text-expense';
  }

  return 'text-muted-foreground';
};
