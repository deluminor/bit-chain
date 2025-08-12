import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface FinancialGoal {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  deadline: string | null;
  color: string;
  icon: string;
  isActive: boolean;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GoalSummary {
  total: number;
  active: number;
  totalTarget: number;
  totalCurrent: number;
  completed: number;
}

export interface CreateGoalData {
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount?: number;
  currency?: string;
  deadline?: string;
  color?: string;
  icon?: string;
}

export interface UpdateGoalData extends Partial<CreateGoalData> {
  id: string;
  isActive?: boolean;
}

// Fetch all goals
export const useGoals = () => {
  return useQuery({
    queryKey: ['financial-goals'],
    queryFn: async () => {
      const response = await fetch('/api/finance/goals');
      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }
      const data = await response.json();
      return {
        goals: data.goals as FinancialGoal[],
        summary: data.summary as GoalSummary,
      };
    },
  });
};

// Create goal
export const useCreateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateGoalData) => {
      const response = await fetch('/api/finance/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create goal');
      }

      const result = await response.json();
      return result.goal as FinancialGoal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-goals'] });
    },
  });
};

// Update goal
export const useUpdateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateGoalData) => {
      const response = await fetch('/api/finance/goals', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update goal');
      }

      const result = await response.json();
      return result.goal as FinancialGoal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-goals'] });
    },
  });
};

// Delete goal
export const useDeleteGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/finance/goals?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete goal');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-goals'] });
    },
  });
};

// Helper function to calculate goal progress
export const calculateGoalProgress = (currentAmount: number, targetAmount: number): number => {
  if (targetAmount <= 0) return 0;
  return Math.min(Math.round((currentAmount / targetAmount) * 100), 100);
};

// Helper function to determine if goal is completed
export const isGoalCompleted = (currentAmount: number, targetAmount: number): boolean => {
  return currentAmount >= targetAmount;
};

// Helper function to calculate remaining amount
export const getRemainingAmount = (currentAmount: number, targetAmount: number): number => {
  return Math.max(targetAmount - currentAmount, 0);
};
