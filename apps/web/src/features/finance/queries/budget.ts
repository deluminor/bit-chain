'use client';

import { type DatePreset, useStore } from '@/store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

export interface BudgetCategory {
  id: string;
  budgetId: string;
  categoryId: string;
  planned: number;
  plannedBase?: number;
  actual: number;
  actualBase?: number;
  category: {
    id: string;
    name: string;
    type: 'INCOME' | 'EXPENSE';
    color: string;
    icon?: string;
  };
}

export interface Budget {
  id: string;
  userId: string;
  name: string;
  period: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  startDate: string;
  endDate: string;
  currency: string;
  totalPlanned: number;
  totalPlannedBase?: number;
  totalActual: number;
  totalActualBase?: number;
  isActive: boolean;
  isDemo: boolean;

  // Template functionality
  isTemplate: boolean;
  templateName?: string;
  autoApply: boolean;
  parentTemplateId?: string;

  createdAt: string;
  updatedAt: string;
  categories: BudgetCategory[];
}

export interface BudgetSummary {
  total: number;
  active: number;
  totalPlanned: number;
  totalActual: number;
  totalPlannedBase?: number;
  totalActualBase?: number;
}

export interface CreateBudgetData {
  name: string;
  period: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  startDate: string;
  endDate: string;
  currency?: string;
  totalPlanned: number;

  // Template functionality
  isTemplate?: boolean;
  templateName?: string;
  autoApply?: boolean;

  categories?: {
    categoryId: string;
    planned: number;
  }[];
}

export interface UpdateBudgetData extends Partial<CreateBudgetData> {
  id: string;
  isActive?: boolean;
}

function buildGlobalRangeQuery(
  globalDatePreset: DatePreset,
  selectedDateRange: { from?: Date; to?: Date } | undefined,
): { from: string; to: string } | null {
  if (globalDatePreset === 'all_time') {
    return null;
  }

  if (!selectedDateRange?.from || !selectedDateRange?.to) {
    return null;
  }

  return {
    from: selectedDateRange.from.toISOString(),
    to: selectedDateRange.to.toISOString(),
  };
}

/** Budget list + summary for the global header date range (primary overlapping budget, clipped actuals). */
export const useBudgets = () => {
  const globalDatePreset = useStore(s => s.globalDatePreset);
  const selectedDateRange = useStore(s => s.selectedDateRange);
  const rangeQuery = useMemo(
    () => buildGlobalRangeQuery(globalDatePreset, selectedDateRange),
    [globalDatePreset, selectedDateRange],
  );

  return useQuery({
    queryKey: ['budgets', rangeQuery?.from ?? 'none', rangeQuery?.to ?? 'none', globalDatePreset],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (rangeQuery) {
        params.set('from', rangeQuery.from);
        params.set('to', rangeQuery.to);
      }
      const query = params.toString();
      const response = await fetch(`/api/finance/budget${query ? `?${query}` : ''}`);
      if (!response.ok) {
        throw new Error('Failed to fetch budgets');
      }
      const data = (await response.json()) as {
        budgets: Budget[];
        summary: BudgetSummary;
        primarySummaryBudgetId?: string | null;
      };
      return {
        budgets: data.budgets,
        summary: data.summary,
        primarySummaryBudgetId: data.primarySummaryBudgetId ?? null,
      };
    },
  });
};

// Create budget
export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBudgetData) => {
      const response = await fetch('/api/finance/budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create budget');
      }

      const result = await response.json();
      return result.budget as Budget;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
};

// Update budget
export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateBudgetData) => {
      const response = await fetch('/api/finance/budget', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update budget');
      }

      const result = await response.json();
      return result.budget as Budget;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
};

// Delete budget
export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/finance/budget?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete budget');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
};

// Fetch budget templates
export const useBudgetTemplates = () => {
  return useQuery({
    queryKey: ['budget-templates'],
    queryFn: async () => {
      const response = await fetch('/api/finance/budget/templates');
      if (!response.ok) {
        throw new Error('Failed to fetch budget templates');
      }
      const data = await response.json();
      return data.templates as Budget[];
    },
  });
};

// Apply template to create new budget
export const useApplyBudgetTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { templateId: string; targetDate?: string }) => {
      const response = await fetch('/api/finance/budget/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to apply budget template');
      }

      const result = await response.json();
      return result.budget as Budget;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
};
