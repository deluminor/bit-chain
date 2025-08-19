'use client';

import { useQuery } from '@tanstack/react-query';
import { currencyService } from '@/lib/currency';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface CategorySpendingData {
  name: string;
  value: number;
  amount: number;
  color: string;
}

async function fetchCategorySpending(): Promise<CategorySpendingData[]> {
  // Get current month transactions
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const transactionsResponse = await fetch(
    `/api/finance/transactions?dateFrom=${monthStart.toISOString()}&dateTo=${now.toISOString()}&type=EXPENSE&limit=1000`,
  );

  if (!transactionsResponse.ok) {
    throw new Error('Failed to fetch transactions');
  }

  const transactionsData = await transactionsResponse.json();
  const { transactions } = transactionsData;

  // Get transaction categories
  const categoriesResponse = await fetch('/api/finance/categories?type=EXPENSE');
  if (!categoriesResponse.ok) {
    throw new Error('Failed to fetch categories');
  }

  const categoriesData = await categoriesResponse.json();
  const { categories } = categoriesData;

  // Calculate spending by category with currency conversion
  const categorySpending = new Map<string, { amount: number; color: string }>();

  for (const transaction of transactions) {
    const category = categories.find((cat: Category) => cat.id === transaction.categoryId);
    if (category) {
      // Convert transaction amount to EUR
      const amountInEur = await currencyService.convertToBaseCurrency(
        transaction.amount,
        transaction.currency || 'USD',
      );

      const existing = categorySpending.get(category.name) || { amount: 0, color: category.color };
      categorySpending.set(category.name, {
        amount: existing.amount + amountInEur,
        color: category.color,
      });
    }
  }

  // Convert to array and calculate percentages
  const totalSpending = Array.from(categorySpending.values()).reduce(
    (sum, cat) => sum + cat.amount,
    0,
  );

  if (totalSpending === 0) {
    return [];
  }

  return Array.from(categorySpending.entries())
    .map(([name, data]) => ({
      name,
      amount: data.amount,
      value: Math.round((data.amount / totalSpending) * 1000) / 10,
      color: data.color,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6); // Top 6 categories
}

export function useCategorySpending() {
  return useQuery({
    queryKey: ['category-spending'],
    queryFn: fetchCategorySpending,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
