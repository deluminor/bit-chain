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

  // Fallback conversion rates
  const fallbackRates: Record<string, number> = {
    USD: 0.9, // 1 USD ≈ 0.9 EUR
    UAH: 0.025, // 1 UAH ≈ 0.025 EUR
    GBP: 1.15, // 1 GBP ≈ 1.15 EUR
    PLN: 0.23, // 1 PLN ≈ 0.23 EUR
    CZK: 0.04, // 1 CZK ≈ 0.04 EUR
    CHF: 1.05, // 1 CHF ≈ 1.05 EUR
    CAD: 0.68, // 1 CAD ≈ 0.68 EUR
    JPY: 0.0062, // 1 JPY ≈ 0.0062 EUR
    HUF: 0.0027, // 1 HUF ≈ 0.0027 EUR
  };

  // Calculate spending by category with improved currency conversion
  const categorySpending = new Map<string, { amount: number; color: string }>();

  for (const transaction of transactions) {
    const category = categories.find((cat: Category) => cat.id === transaction.categoryId);
    if (category) {
      let convertedAmount = transaction.amount;

      // Convert to EUR if not already in EUR
      if (transaction.currency !== 'EUR') {
        try {
          convertedAmount = await currencyService.convertToBaseCurrency(
            transaction.amount,
            transaction.currency || 'USD',
          );
        } catch {
          // Use fallback rate if conversion fails
          convertedAmount = transaction.amount * (fallbackRates[transaction.currency] || 1);
        }
      }

      const existing = categorySpending.get(category.name) || { amount: 0, color: category.color };
      categorySpending.set(category.name, {
        amount: existing.amount + convertedAmount,
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
