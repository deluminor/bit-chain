'use client';

import { useQuery } from '@tanstack/react-query';

interface Budget {
  startDate: string;
  endDate: string;
  categories: BudgetCategory[];
}

interface BudgetCategory {
  categoryId: string;
  planned: number;
  category: { name: string };
}

interface Transaction {
  categoryId: string;
  amount: number;
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
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

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

  // Calculate spending by category
  const categorySpending = new Map<string, number>();

  transactions.forEach((transaction: Transaction) => {
    const categoryId = transaction.categoryId;
    const existing = categorySpending.get(categoryId) || 0;
    categorySpending.set(categoryId, existing + transaction.amount);
  });

  // Build performance data
  const performanceData: BudgetPerformanceData[] = currentBudget.categories.map(
    (budgetCategory: BudgetCategory) => {
      const spent = categorySpending.get(budgetCategory.categoryId) || 0;
      const budgeted = budgetCategory.planned;
      const remaining = Math.max(0, budgeted - spent);
      const percentage = budgeted > 0 ? (spent / budgeted) * 100 : 0;

      return {
        category: budgetCategory.category.name,
        budgeted,
        spent,
        remaining,
        percentage: Math.round(percentage),
      };
    },
  );

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
