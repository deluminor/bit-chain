'use client';

import { useQuery } from '@tanstack/react-query';
import { currencyService, BASE_CURRENCY } from '@/lib/currency';

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

  // Get budgets with actual spending calculated by API
  const budgetsResponse = await fetch('/api/finance/budget');
  if (!budgetsResponse.ok) {
    throw new Error('Failed to fetch budgets');
  }

  const budgetsData = await budgetsResponse.json();
  const { budgets } = budgetsData;

  // Find current month budget
  const currentBudget = budgets.find((budget: any) => {
    const budgetStart = new Date(budget.startDate);
    const budgetEnd = new Date(budget.endDate);
    return budgetStart <= now && budgetEnd >= now;
  });

  if (!currentBudget || !currentBudget.categories) {
    return [];
  }

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

  // Build performance data using API-calculated actual spending
  const performanceData: BudgetPerformanceData[] = [];

  for (const budgetCategory of currentBudget.categories) {
    let budgetedInEUR = budgetCategory.planned;
    let spentInEUR = budgetCategory.actual;

    // Convert budget amount to EUR if needed
    if (currentBudget.currency && currentBudget.currency !== BASE_CURRENCY) {
      try {
        budgetedInEUR = await currencyService.convertToBaseCurrency(
          budgetCategory.planned,
          currentBudget.currency,
        );
        spentInEUR = await currencyService.convertToBaseCurrency(
          budgetCategory.actual,
          currentBudget.currency,
        );
      } catch {
        // Use fallback rate if conversion fails
        const rate = fallbackRates[currentBudget.currency] || 1;
        budgetedInEUR = budgetCategory.planned * rate;
        spentInEUR = budgetCategory.actual * rate;
      }
    }

    const remaining = Math.max(0, budgetedInEUR - spentInEUR);
    const percentage = budgetedInEUR > 0 ? (spentInEUR / budgetedInEUR) * 100 : 0;

    performanceData.push({
      category: budgetCategory.category.name,
      budgeted: budgetedInEUR,
      spent: spentInEUR,
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
