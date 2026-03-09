import type { CategoryFilter } from './_types';

export const CATEGORY_FILTERS: ReadonlyArray<{ key: CategoryFilter; label: string }> = [
  { key: 'ALL',     label: 'All'      },
  { key: 'INCOME',  label: 'Income'   },
  { key: 'EXPENSE', label: 'Expenses' },
];

export const COLOR_SWATCHES = [
  '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B',
  '#EF4444', '#EC4899', '#06B6D4', '#F97316',
  '#84CC16', '#14B8A6', '#F43F5E', '#A78BFA',
] as const;

export const DEFAULT_CATEGORY_FORM = {
  name: '',
  type: 'EXPENSE' as 'INCOME' | 'EXPENSE',
  color: '#10B981',
  icon: '',
};
