import { TransactionType, type DefaultCategoryData } from './finance-categories.types';

export const DEFAULT_FINANCE_INCOME_CATEGORIES: DefaultCategoryData[] = [
  {
    name: 'Salary',
    type: TransactionType.INCOME,
    color: '#10B981',
    icon: 'Briefcase',
    isDefault: true,
    children: [
      {
        name: 'Main Job',
        type: TransactionType.INCOME,
        color: '#059669',
        icon: 'Building',
        isDefault: true,
      },
      {
        name: 'Part-time',
        type: TransactionType.INCOME,
        color: '#047857',
        icon: 'Clock',
        isDefault: true,
      },
    ],
  },
  {
    name: 'Investment',
    type: TransactionType.INCOME,
    color: '#F59E0B',
    icon: 'TrendingUp',
    isDefault: true,
    children: [
      {
        name: 'Dividends',
        type: TransactionType.INCOME,
        color: '#D97706',
        icon: 'DollarSign',
        isDefault: true,
      },
      {
        name: 'Interest',
        type: TransactionType.INCOME,
        color: '#B45309',
        icon: 'Percent',
        isDefault: true,
      },
      {
        name: 'Capital Gains',
        type: TransactionType.INCOME,
        color: '#92400E',
        icon: 'ArrowUp',
        isDefault: true,
      },
    ],
  },
  {
    name: 'Other Income',
    type: TransactionType.INCOME,
    color: '#6B7280',
    icon: 'Gift',
    isDefault: true,
    children: [
      {
        name: 'Gifts',
        type: TransactionType.INCOME,
        color: '#4B5563',
        icon: 'Heart',
        isDefault: true,
      },
      {
        name: 'Refunds',
        type: TransactionType.INCOME,
        color: '#374151',
        icon: 'RotateCcw',
        isDefault: true,
      },
      {
        name: 'Bonuses',
        type: TransactionType.INCOME,
        color: '#1F2937',
        icon: 'Award',
        isDefault: true,
      },
    ],
  },
];
