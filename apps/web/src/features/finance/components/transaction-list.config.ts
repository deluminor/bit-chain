import { ArrowRightLeft, Minus, Plus } from 'lucide-react';

export const transactionTypeIcons = {
  INCOME: Plus,
  EXPENSE: Minus,
  TRANSFER: ArrowRightLeft,
};

export const getTransactionTypeColor = (type: string): string => {
  switch (type) {
    case 'INCOME':
      return 'text-income bg-income/10';
    case 'EXPENSE':
      return 'text-expense bg-expense/10';
    case 'TRANSFER':
      return 'text-transfer bg-transfer/10';
    default:
      return 'text-muted-foreground bg-muted';
  }
};

export const getAmountColor = (type: string): string => {
  switch (type) {
    case 'INCOME':
      return 'text-income';
    case 'EXPENSE':
      return 'text-expense';
    case 'TRANSFER':
      return 'text-transfer';
    default:
      return 'text-muted-foreground';
  }
};
