'use client';

import { useQuery } from '@tanstack/react-query';
import { convertToBaseCurrencySafe } from '@/lib/currency';

export interface CashFlowCategory {
  id: string;
  name: string;
  amount: number;
  color: string;
}

export interface CashFlowSankeyData {
  sources: CashFlowCategory[];
  targets: CashFlowCategory[];
  totalIncome: number;
  totalExpenses: number;
}

interface CashFlowSankeyParams {
  dateFrom?: string;
  dateTo?: string;
}

const SOURCE_LIMIT = 4;
const TARGET_LIMIT = 4;
const DEFAULT_COLOR = '#525252';

const getTopCategories = (
  items: CashFlowCategory[],
  limit: number,
  otherLabel: string,
  otherId: string,
): CashFlowCategory[] => {
  const sorted = items.sort((a, b) => b.amount - a.amount);
  const top = sorted.slice(0, limit);
  const rest = sorted.slice(limit);
  const restTotal = rest.reduce((sum, item) => sum + item.amount, 0);

  if (restTotal > 0) {
    top.push({
      id: otherId,
      name: otherLabel,
      amount: restTotal,
      color: DEFAULT_COLOR,
    });
  }

  return top;
};

async function fetchCashFlowSankey(params: CashFlowSankeyParams): Promise<CashFlowSankeyData> {
  const queryParams = new URLSearchParams();
  if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
  if (params.dateTo) queryParams.append('dateTo', params.dateTo);
  queryParams.append('limit', '5000');

  const response = await fetch(`/api/finance/transactions?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }

  const data = await response.json();
  const transactions = data.transactions || [];

  const incomeMap = new Map<string, CashFlowCategory>();
  const expenseMap = new Map<string, CashFlowCategory>();

  let totalIncome = 0;
  let totalExpenses = 0;

  for (const transaction of transactions) {
    if (transaction.type !== 'INCOME' && transaction.type !== 'EXPENSE') {
      continue;
    }

    // Skip transfers for cashflow chart
    if (transaction.type === 'TRANSFER') {
      continue;
    }

    const amountInEur = await convertToBaseCurrencySafe(transaction.amount, transaction.currency);

    const category = transaction.category;
    const categoryId = category?.id || category?.name || 'uncategorized';
    const categoryName = category?.name || 'Uncategorized';
    const categoryColor = category?.color || DEFAULT_COLOR;

    const targetMap = transaction.type === 'INCOME' ? incomeMap : expenseMap;
    const existing = targetMap.get(categoryId) || {
      id: String(categoryId),
      name: categoryName,
      amount: 0,
      color: categoryColor,
    };

    existing.amount += Math.abs(amountInEur);
    targetMap.set(categoryId, existing);

    if (transaction.type === 'INCOME') {
      totalIncome += Math.abs(amountInEur);
    } else {
      totalExpenses += Math.abs(amountInEur);
    }
  }

  const sources = getTopCategories(
    Array.from(incomeMap.values()).filter(item => item.amount > 0),
    SOURCE_LIMIT,
    'Other Income',
    'other-income',
  );
  const targets = getTopCategories(
    Array.from(expenseMap.values()).filter(item => item.amount > 0),
    TARGET_LIMIT,
    'Other Expenses',
    'other-expenses',
  );

  return {
    sources,
    targets,
    totalIncome,
    totalExpenses,
  };
}

export function useCashFlowSankey(params: CashFlowSankeyParams = {}) {
  return useQuery({
    queryKey: ['finance', 'cash-flow-sankey', params.dateFrom, params.dateTo],
    queryFn: () => fetchCashFlowSankey(params),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
