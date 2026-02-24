import type { CategoryFilter } from './_types';

export const CATEGORY_FILTERS: ReadonlyArray<{ key: CategoryFilter; label: string }> = [
  { key: 'ALL',     label: 'All'      },
  { key: 'INCOME',  label: 'Income'   },
  { key: 'EXPENSE', label: 'Expenses' },
];
