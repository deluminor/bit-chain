import type {
  ApiResponse,
  DashboardExpensesTrendResponse,
  DashboardHistoryResponse,
  DashboardSummary,
  TransactionsListResponse,
} from '@bit-chain/api-contracts';
import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import api from '~/src/lib/api';
import { QUERY_CONFIG } from '~/src/lib/constants';
import { convertCurrency } from '~/src/lib/currency';
import {
  DASHBOARD_EXPENSES_TREND_QUERY_KEY,
  DASHBOARD_HISTORY_QUERY_KEY,
  DASHBOARD_QUERY_KEY,
} from '~/src/lib/query-keys';

export { DASHBOARD_QUERY_KEY };

export interface DashboardFilters {
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Fetches aggregated dashboard summary from /api/mobile/dashboard/summary.
 * Accepts optional period filters so that `periodStats` reflect the selected
 * period rather than always defaulting to the current calendar month.
 *
 * @param filters - Optional `dateFrom` / `dateTo` ISO strings.
 *
 * @example
 * ```tsx
 * const { dateFrom, dateTo } = getPeriodRange(period);
 * const { data } = useDashboard({ dateFrom, dateTo });
 * ```
 */
export function useDashboard(filters?: DashboardFilters) {
  return useQuery({
    // Include filters in the cache key so each period gets its own cache entry.
    queryKey: [...DASHBOARD_QUERY_KEY, filters] as const,
    queryFn: async (): Promise<DashboardSummary> => {
      const params = new URLSearchParams();
      if (filters?.dateFrom) params.set('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.set('dateTo', filters.dateTo);

      const query = params.toString();
      const { data } = await api.get<ApiResponse<DashboardSummary>>(
        `/dashboard/summary${query ? `?${query}` : ''}`,
      );
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
    staleTime: QUERY_CONFIG.STALE_TIME_DASHBOARD,
  });
}

export interface DashboardHistoryFilters {
  dateFrom?: string;
  dateTo?: string;
}

export function useDashboardHistory(filters?: DashboardHistoryFilters) {
  return useQuery({
    queryKey: [...DASHBOARD_HISTORY_QUERY_KEY, filters] as const,
    queryFn: async (): Promise<DashboardHistoryResponse> => {
      const params = new URLSearchParams();
      if (filters?.dateFrom) params.set('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.set('dateTo', filters.dateTo);

      const query = params.toString();
      const { data } = await api.get<ApiResponse<DashboardHistoryResponse>>(
        `/dashboard/history${query ? `?${query}` : ''}`,
      );
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
    staleTime: QUERY_CONFIG.STALE_TIME_DASHBOARD,
  });
}

const EXPENSES_TREND_FALLBACK_PAGE_SIZE = 50;
const EXPENSES_TREND_FALLBACK_MAX_PAGES = 40;

function startOfUtcMonth(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0, 0, 0, 0));
}

function toMonthLabel(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function getUtcMonthDays(date: Date): number {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
}

async function fetchExpensesTrendViaTransactions(): Promise<DashboardExpensesTrendResponse> {
  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const currentMonth = now.getUTCMonth();
  const previousMonthDate = new Date(Date.UTC(currentYear, currentMonth - 1, 1));
  const previousYear = previousMonthDate.getUTCFullYear();
  const previousMonth = previousMonthDate.getUTCMonth();

  const dateFrom = startOfUtcMonth(previousMonthDate).toISOString();
  const dateTo = now.toISOString();

  const currentDaily = new Map<number, number>();
  const previousDaily = new Map<number, number>();

  let page = 1;
  let hasMore = true;
  let pagesLoaded = 0;

  while (hasMore && pagesLoaded < EXPENSES_TREND_FALLBACK_MAX_PAGES) {
    const params = new URLSearchParams({
      type: 'EXPENSE',
      page: String(page),
      pageSize: String(EXPENSES_TREND_FALLBACK_PAGE_SIZE),
      dateFrom,
      dateTo,
    });

    const { data } = await api.get<ApiResponse<TransactionsListResponse>>(
      `/transactions?${params.toString()}`,
    );

    if (!data.ok) {
      throw new Error(data.error.code);
    }

    const convertedExpenses = await Promise.all(
      data.data.transactions.map(async transaction => ({
        date: new Date(transaction.date),
        amountEUR: await convertCurrency(transaction.amount, transaction.currency, 'EUR').catch(
          () => transaction.amount,
        ),
      })),
    );

    for (const transaction of convertedExpenses) {
      if (Number.isNaN(transaction.date.getTime())) {
        continue;
      }

      const txDay = transaction.date.getUTCDate();
      const amount = Number.isFinite(transaction.amountEUR) ? transaction.amountEUR : 0;

      if (
        transaction.date.getUTCFullYear() === currentYear &&
        transaction.date.getUTCMonth() === currentMonth
      ) {
        currentDaily.set(txDay, (currentDaily.get(txDay) ?? 0) + amount);
        continue;
      }

      if (
        transaction.date.getUTCFullYear() === previousYear &&
        transaction.date.getUTCMonth() === previousMonth
      ) {
        previousDaily.set(txDay, (previousDaily.get(txDay) ?? 0) + amount);
      }
    }

    hasMore = data.data.hasMore;
    page += 1;
    pagesLoaded += 1;
  }

  const comparedDays = Math.max(getUtcMonthDays(now), getUtcMonthDays(previousMonthDate));
  const points: DashboardExpensesTrendResponse['points'] = [];
  let currentCumulative = 0;
  let previousCumulative = 0;

  for (let day = 1; day <= comparedDays; day += 1) {
    currentCumulative += currentDaily.get(day) ?? 0;
    previousCumulative += previousDaily.get(day) ?? 0;

    points.push({
      day,
      label: String(day),
      currentExpenseEUR: Math.round(currentCumulative * 100) / 100,
      previousExpenseEUR: Math.round(previousCumulative * 100) / 100,
    });
  }

  return {
    points,
    currentMonthLabel: toMonthLabel(startOfUtcMonth(now)),
    previousMonthLabel: toMonthLabel(startOfUtcMonth(previousMonthDate)),
    comparedDays,
    generatedAt: now.toISOString(),
  };
}

/**
 * Fetches cumulative expenses trend for current month vs previous month.
 *
 * Values from the API are normalized in EUR and should be converted to the
 * selected app currency on the client before rendering.
 */
export function useDashboardExpensesTrend() {
  return useQuery({
    queryKey: DASHBOARD_EXPENSES_TREND_QUERY_KEY,
    queryFn: async (): Promise<DashboardExpensesTrendResponse> => {
      try {
        const { data } = await api.get<ApiResponse<DashboardExpensesTrendResponse>>(
          '/dashboard/expenses-trend',
        );
        if (!data.ok) throw new Error(data.error.code);
        return data.data;
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          return fetchExpensesTrendViaTransactions();
        }

        throw error;
      }
    },
    staleTime: QUERY_CONFIG.STALE_TIME_DASHBOARD,
  });
}
