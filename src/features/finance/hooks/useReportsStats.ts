'use client';

import { useQuery } from '@tanstack/react-query';
import { subMonths } from 'date-fns';

interface ReportStats {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  budgetAdherence: number;
  incomeChange: number;
  expenseChange: number;
  savingsChange: number;
  budgetChange: number;
}

async function fetchReportStats(): Promise<ReportStats> {
  interface ReportSummary {
    income: number;
    expenses: number;
    transfers: number;
    totalTransactions: number;
    incomeCount: number;
    expenseCount: number;
    transferCount: number;
  }

  const fetchSummary = async (startDate: Date, endDate: Date): Promise<ReportSummary> => {
    const response = await fetch(
      `/api/finance/transactions?dateFrom=${startDate.toISOString()}&dateTo=${endDate.toISOString()}&limit=1`,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch transactions summary');
    }

    const data = await response.json();
    return data.summary as ReportSummary;
  };

  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = subMonths(currentMonthStart, 1);
  const lastMonthEnd = new Date(currentMonthStart.getTime() - 1);

  const currentSummary = await fetchSummary(currentMonthStart, now);

  let lastMonthSummary = { income: 0, expenses: 0, transfers: 0 };
  try {
    lastMonthSummary = await fetchSummary(lastMonthStart, lastMonthEnd);
  } catch {
    lastMonthSummary = { income: 0, expenses: 0, transfers: 0 };
  }

  // Get current budgets
  const budgetsResponse = await fetch('/api/finance/budget');
  let budgetAdherence = 0;

  if (budgetsResponse.ok) {
    const budgetsData = await budgetsResponse.json();
    const { budgets } = budgetsData;

    // Calculate budget adherence for current month
    interface Budget {
      startDate: string;
      endDate: string;
      totalPlanned: number;
      totalPlannedBase?: number;
    }
    const currentBudgets = budgets.filter((budget: Budget) => {
      const budgetStart = new Date(budget.startDate);
      const budgetEnd = new Date(budget.endDate);
      return budgetStart <= now && budgetEnd >= now;
    });

    if (currentBudgets.length > 0) {
      const totalPlanned = currentBudgets.reduce(
        (sum: number, b: Budget) => sum + (b.totalPlannedBase ?? b.totalPlanned),
        0,
      );
      // Use expenses from summary which now correctly excludes transfers
      const actualSpent = currentSummary.expenses || 0;
      budgetAdherence =
        totalPlanned > 0 ? Math.min(100, ((totalPlanned - actualSpent) / totalPlanned) * 100) : 0;
    }
  }

  const totalIncome = currentSummary.income || 0;
  const totalExpenses = currentSummary.expenses || 0;
  const netSavings = totalIncome - totalExpenses;

  const lastIncome = lastMonthSummary.income || 0;
  const lastExpenses = lastMonthSummary.expenses || 0;
  const lastSavings = lastIncome - lastExpenses;

  // Calculate percentage changes
  const incomeChange = lastIncome > 0 ? ((totalIncome - lastIncome) / lastIncome) * 100 : 0;
  const expenseChange =
    lastExpenses > 0 ? ((totalExpenses - lastExpenses) / lastExpenses) * 100 : 0;
  const savingsChange =
    lastSavings > 0 ? ((netSavings - lastSavings) / Math.abs(lastSavings)) * 100 : 0;

  return {
    totalIncome,
    totalExpenses,
    netSavings,
    budgetAdherence,
    incomeChange,
    expenseChange,
    savingsChange,
    budgetChange: 3, // Mock for now, would need historical budget data
  };
}

export function useReportsStats() {
  return useQuery({
    queryKey: ['reports-stats'],
    queryFn: fetchReportStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
