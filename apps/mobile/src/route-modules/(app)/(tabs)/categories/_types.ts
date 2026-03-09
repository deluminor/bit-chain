import type { CategoriesListResponse } from '@bit-chain/api-contracts';

export type CategoryItem = CategoriesListResponse['categories'][number];
export type CategoryFilter = 'ALL' | 'INCOME' | 'EXPENSE';
