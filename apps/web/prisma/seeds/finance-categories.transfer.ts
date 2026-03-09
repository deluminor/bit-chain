import { TransactionType, type DefaultCategoryData } from './finance-categories.types';

export const DEFAULT_FINANCE_TRANSFER_CATEGORIES: DefaultCategoryData[] = [
  {
    name: 'Transfer',
    type: TransactionType.TRANSFER,
    color: '#3B82F6',
    icon: 'ArrowRightLeft',
    isDefault: true,
  },
];
