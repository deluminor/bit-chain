import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface BudgetCategory {
  id: string;
  budgetId: string;
  categoryId: string;
  planned: number;
  actual: number;
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
  totalActual: number;
  isActive: boolean;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
  categories: BudgetCategory[];
}

export interface BudgetSummary {
  total: number;
  active: number;
  totalPlanned: number;
  totalActual: number;
}

export interface CreateBudgetData {
  name: string;
  period: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  startDate: string;
  endDate: string;
  currency?: string;
  totalPlanned: number;
  categories?: {
    categoryId: string;
    planned: number;
  }[];
}

export interface UpdateBudgetData extends Partial<CreateBudgetData> {
  id: string;
  isActive?: boolean;
}

// Fetch all budgets
export const useBudgets = () => {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      const response = await fetch('/api/finance/budget');
      if (!response.ok) {
        throw new Error('Failed to fetch budgets');
      }
      const data = await response.json();
      return {
        budgets: data.budgets as Budget[],
        summary: data.summary as BudgetSummary,
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
