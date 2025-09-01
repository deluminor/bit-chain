'use client';

import { useQuery } from '@tanstack/react-query';
import { currencyService, BASE_CURRENCY } from '@/lib/currency';

interface Budget {
  startDate: string;
  endDate: string;
  categories: BudgetCategory[];
  currency?: string;
}

interface BudgetCategory {
  categoryId: string;
  planned: number;
  category: { name: string };
}

interface _Transaction {
  categoryId: string;
  amount: number;
  currency?: string;
}

interface BudgetPerformanceData {
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
  percentage: number;
}

async function fetchBudgetPerformance(): Promise<BudgetPerformanceData[]> {
  // Get current month date range
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = now;

  // Get current month budget
  const budgetsResponse = await fetch('/api/finance/budget');
  if (!budgetsResponse.ok) {
    throw new Error('Failed to fetch budgets');
  }

  const budgetsData = await budgetsResponse.json();
  const { budgets } = budgetsData;

  // Find current month budget
  const currentBudget = budgets.find((budget: Budget) => {
    const budgetStart = new Date(budget.startDate);
    const budgetEnd = new Date(budget.endDate);
    return budgetStart <= now && budgetEnd >= now;
  });

  if (!currentBudget || !currentBudget.categories) {
    return [];
  }

  // Get transactions for current month
  const transactionsResponse = await fetch(
    `/api/finance/transactions?dateFrom=${monthStart.toISOString()}&dateTo=${monthEnd.toISOString()}&type=EXPENSE&limit=1000`,
  );

  if (!transactionsResponse.ok) {
    throw new Error('Failed to fetch transactions');
  }

  const transactionsData = await transactionsResponse.json();
  const { transactions } = transactionsData;

  // Calculate spending by category (convert to EUR)
  const categorySpending = new Map<string, number>();

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
  };

  for (const transaction of transactions as _Transaction[]) {
    const categoryId = transaction.categoryId;
    let amountInEUR = transaction.amount;

    // Convert to EUR if not already in EUR
    if (transaction.currency && transaction.currency !== BASE_CURRENCY) {
      try {
        amountInEUR = await currencyService.convertToBaseCurrency(
          transaction.amount,
          transaction.currency,
        );
      } catch {
        // Use fallback rate if conversion fails
        amountInEUR = transaction.amount * (fallbackRates[transaction.currency] || 1);
      }
    }

    const existing = categorySpending.get(categoryId) || 0;
    categorySpending.set(categoryId, existing + amountInEUR);
  }

  // Build performance data (convert budget amounts to EUR)
  const performanceData: BudgetPerformanceData[] = [];

  for (const budgetCategory of currentBudget.categories) {
    const spent = categorySpending.get(budgetCategory.categoryId) || 0;
    let budgetedInEUR = budgetCategory.planned;

    // Convert budget amount to EUR if needed
    if (currentBudget.currency && currentBudget.currency !== BASE_CURRENCY) {
      try {
        budgetedInEUR = await currencyService.convertToBaseCurrency(
          budgetCategory.planned,
          currentBudget.currency,
        );
      } catch {
        // Use fallback rate if conversion fails
        const fallbackRates: Record<string, number> = {
          USD: 0.9,
          UAH: 0.025,
          GBP: 1.15,
          PLN: 0.23,
          CZK: 0.04,
          CHF: 1.05,
          CAD: 0.68,
          JPY: 0.0062,
        };
        budgetedInEUR = budgetCategory.planned * (fallbackRates[currentBudget.currency] || 1);
      }
    }

    const remaining = Math.max(0, budgetedInEUR - spent);
    const percentage = budgetedInEUR > 0 ? (spent / budgetedInEUR) * 100 : 0;

    performanceData.push({
      category: budgetCategory.category.name,
      budgeted: budgetedInEUR,
      spent,
      remaining,
      percentage: Math.round(percentage),
    });
  }

  return performanceData.sort((a, b) => b.budgeted - a.budgeted);
}

export function useBudgetPerformance() {
  return useQuery({
    queryKey: ['budget-performance'],
    queryFn: fetchBudgetPerformance,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
