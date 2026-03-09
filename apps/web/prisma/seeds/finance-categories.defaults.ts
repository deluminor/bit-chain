import { DEFAULT_FINANCE_EXPENSE_PRIMARY_CATEGORIES } from './finance-categories.expense-primary';
import { DEFAULT_FINANCE_EXPENSE_SECONDARY_CATEGORIES } from './finance-categories.expense-secondary';
import { DEFAULT_FINANCE_INCOME_CATEGORIES } from './finance-categories.income';
import { DEFAULT_FINANCE_TRANSFER_CATEGORIES } from './finance-categories.transfer';
import type { DefaultCategoryData } from './finance-categories.types';

export const DEFAULT_FINANCE_CATEGORIES: DefaultCategoryData[] = [
  ...DEFAULT_FINANCE_INCOME_CATEGORIES,
  ...DEFAULT_FINANCE_EXPENSE_PRIMARY_CATEGORIES,
  ...DEFAULT_FINANCE_EXPENSE_SECONDARY_CATEGORIES,
  ...DEFAULT_FINANCE_TRANSFER_CATEGORIES,
];
