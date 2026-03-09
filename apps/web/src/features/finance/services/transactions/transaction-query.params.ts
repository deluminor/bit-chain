import type { Prisma } from '@/generated/prisma';
import type { TransactionType } from './transaction-domain.shared';

export interface WebTransactionsQuery {
  page: number;
  limit: number;
  type: TransactionType | null;
  accountId: string | null;
  categoryId: string | null;
  dateFrom: string | null;
  dateTo: string | null;
  search: string | null;
  sortBy: string;
  sortOrder: Prisma.SortOrder;
}

export interface MobileTransactionsQuery {
  page: number;
  pageSize: number;
  type: TransactionType | undefined;
  accountId: string | undefined;
  categoryId: string | undefined;
  search: string | undefined;
  dateFrom: string | null;
  dateTo: string | null;
}

const parseTransactionType = (value: string | null): TransactionType | undefined => {
  if (value === 'INCOME' || value === 'EXPENSE' || value === 'TRANSFER') {
    return value;
  }

  return undefined;
};

export function parseWebTransactionsQuery(searchParams: URLSearchParams): WebTransactionsQuery {
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const limit = parseInt(searchParams.get('limit') ?? '20', 10);
  const type = parseTransactionType(searchParams.get('type')) ?? null;
  const accountId = searchParams.get('accountId');
  const categoryId = searchParams.get('categoryId');
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  const search = searchParams.get('search');
  const sortBy = searchParams.get('sortBy') ?? 'date';
  const sortOrderRaw = searchParams.get('sortOrder');

  return {
    page,
    limit,
    type,
    accountId,
    categoryId,
    dateFrom,
    dateTo,
    search,
    sortBy,
    sortOrder: sortOrderRaw === 'asc' ? 'asc' : 'desc',
  };
}

/**
 * Parse mobile list query params from URL search params.
 */
export function parseMobileTransactionsQuery(
  searchParams: URLSearchParams,
): MobileTransactionsQuery {
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') ?? '20', 10)));

  return {
    page,
    pageSize,
    type: parseTransactionType(searchParams.get('type')),
    accountId: searchParams.get('accountId') ?? undefined,
    categoryId: searchParams.get('categoryId') ?? undefined,
    search: searchParams.get('search')?.trim() || undefined,
    dateFrom: searchParams.get('dateFrom'),
    dateTo: searchParams.get('dateTo'),
  };
}
