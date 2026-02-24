// Import will be done in the main seed file
export enum AccountType {
  CASH = 'CASH',
  BANK_CARD = 'BANK_CARD',
  SAVINGS = 'SAVINGS',
  INVESTMENT = 'INVESTMENT',
}

export interface DefaultAccountData {
  name: string;
  type: AccountType;
  currency: string;
  color: string;
  icon: string;
  description: string;
}

export const DEFAULT_FINANCE_ACCOUNTS: DefaultAccountData[] = [
  {
    name: 'Cash Wallet',
    type: AccountType.CASH,
    currency: 'UAH',
    color: '#10B981', // green-500
    icon: 'Wallet',
    description: 'Physical cash in wallet',
  },
  {
    name: 'Main Bank Card',
    type: AccountType.BANK_CARD,
    currency: 'UAH',
    color: '#3B82F6', // blue-500
    icon: 'CreditCard',
    description: 'Primary bank account for daily expenses',
  },
  {
    name: 'Savings Account',
    type: AccountType.SAVINGS,
    currency: 'UAH',
    color: '#F59E0B', // amber-500
    icon: 'PiggyBank',
    description: 'Long-term savings account',
  },
  {
    name: 'Investment Portfolio',
    type: AccountType.INVESTMENT,
    currency: 'USD',
    color: '#8B5CF6', // purple-500
    icon: 'TrendingUp',
    description: 'Stocks, bonds, and other investments',
  },
];
