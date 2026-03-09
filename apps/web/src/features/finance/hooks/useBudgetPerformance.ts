'use client';

import { convertToBaseCurrencySafe } from '@/lib/currency';
import { useQuery } from '@tanstack/react-query';

interface _Transaction {
  categoryId: string;
  amount: number;
  currency?: string;
}

interface BudgetCategoryPerformance {
  planned: number;
  actual: number;
  plannedBase?: number;
  actualBase?: number;
  category: {
    name: string;
  };
}

interface BudgetItem {
  startDate: string;
  endDate: string;
  currency?: string;
  categories?: BudgetCategoryPerformance[];
}

interface BudgetsResponse {
  budgets: BudgetItem[];
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

  const budgetsData = (await budgetsResponse.json()) as BudgetsResponse;
  const { budgets } = budgetsData;

  // Find current month budget
  const currentBudget = budgets.find(budget => {
    const budgetStart = new Date(budget.startDate);
    const budgetEnd = new Date(budget.endDate);
    return budgetStart <= now && budgetEnd >= now;
  });

  if (!currentBudget || !currentBudget.categories) {
    return [];
  }

  // Build performance data using API-calculated actual spending
  const performanceData: BudgetPerformanceData[] = [];

  for (const budgetCategory of currentBudget.categories) {
    let budgetedInEUR = budgetCategory.plannedBase ?? budgetCategory.planned;
    let spentInEUR = budgetCategory.actualBase ?? budgetCategory.actual;

    if (budgetCategory.plannedBase === undefined && currentBudget.currency) {
      budgetedInEUR = await convertToBaseCurrencySafe(
        budgetCategory.planned,
        currentBudget.currency,
      );
    }

    if (budgetCategory.actualBase === undefined && currentBudget.currency) {
      spentInEUR = await convertToBaseCurrencySafe(budgetCategory.actual, currentBudget.currency);
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
