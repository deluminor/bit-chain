import { useToast } from '@/hooks/use-toast';
import axiosInstance from '@/lib/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface TransactionCategory {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  parentId?: string;
  color: string;
  icon: string;
  isDefault: boolean;
  isActive: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  parent?: {
    id: string;
    name: string;
    color: string;
  };
  children?: TransactionCategory[];
  _count: {
    transactions: number;
    children: number;
  };
}

export interface CreateCategoryParams {
  name: string;
  type: 'INCOME' | 'EXPENSE';
  parentId?: string;
  color: string;
  icon: string;
  isDefault?: boolean;
}

export interface UpdateCategoryParams {
  id: string;
  name?: string;
  type?: 'INCOME' | 'EXPENSE';
  parentId?: string;
  color?: string;
  icon?: string;
  isActive?: boolean;
}

export interface CategoryFilters {
  type?: 'INCOME' | 'EXPENSE';
  includeInactive?: boolean;
  hierarchical?: boolean;
}

const CATEGORIES_KEY = ['finance', 'categories'] as const;

export const useCategories = (filters?: CategoryFilters) => {
  return useQuery({
    queryKey: [...CATEGORIES_KEY, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.includeInactive) params.append('includeInactive', 'true');
      if (filters?.hierarchical) params.append('hierarchical', 'true');

      const response = await axiosInstance.get(`/finance/categories?${params.toString()}`);
      return response.data;
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateCategoryParams) => {
      const response = await axiosInstance.post('/finance/categories', data);
      return response.data.category;
    },
    onSuccess: _newCategory => {
      // Invalidate all category queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });

      toast({
        title: 'Success',
        description: 'Category created successfully',
      });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } };
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.response?.data?.error || 'Failed to create category',
      });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (params: UpdateCategoryParams) => {
      const response = await axiosInstance.put('/finance/categories', params);
      return response.data.category;
    },
    onSuccess: _updatedCategory => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });

      toast({
        title: 'Success',
        description: 'Category updated successfully',
      });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } };
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.response?.data?.error || 'Failed to update category',
      });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`/finance/categories?id=${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });

      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: {
          data?: {
            hasTransactions?: boolean;
            transactionCount?: number;
            message?: string;
            hasChildren?: boolean;
            childrenCount?: number;
            error?: string;
          };
        };
      };
      const errorData = err.response?.data;

      if (errorData?.hasTransactions) {
        toast({
          variant: 'destructive',
          title: 'Cannot Delete Category',
          description: `This category has ${errorData.transactionCount} transactions. ${errorData.message}`,
        });
      } else if (errorData?.hasChildren) {
        toast({
          variant: 'destructive',
          title: 'Cannot Delete Category',
          description: `This category has ${errorData.childrenCount} subcategories. ${errorData.message}`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorData?.error || 'Failed to delete category',
        });
      }
    },
  });
};
