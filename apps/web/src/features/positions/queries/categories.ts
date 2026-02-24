import { useToast } from '@/components/ui/use-toast';
import { Category } from '@/generated/prisma';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCategory,
  CreateCategoryParams,
  deleteCategory,
  getCategories,
  getDefaultCategory,
  setDefaultCategory,
  SetDefaultCategoryParams,
  updateCategory,
  UpdateCategoryParams,
} from '../api/categories';
import { POSITIONS_KEY } from './positions';

const CATEGORIES_KEY = ['categories'] as const;
export const DEFAULT_CATEGORY_KEY = ['defaultCategory'] as const;

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: CATEGORIES_KEY,
    queryFn: getCategories,
  });
};

export const useDefaultCategory = () => {
  return useQuery<Category>({
    queryKey: DEFAULT_CATEGORY_KEY,
    queryFn: getDefaultCategory,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateCategoryParams) => createCategory(data),
    onSuccess: newCategory => {
      queryClient.setQueryData<Category[]>(CATEGORIES_KEY, oldData => {
        return oldData ? [...oldData, newCategory] : [newCategory];
      });

      toast({
        title: 'Success',
        description: 'Category created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (params: UpdateCategoryParams) => updateCategory(params),
    onSuccess: updatedCategory => {
      queryClient.setQueryData<Category[]>(CATEGORIES_KEY, oldData => {
        return oldData
          ? oldData.map(category =>
              category.id === updatedCategory.id ? updatedCategory : category,
            )
          : [updatedCategory];
      });
      queryClient.invalidateQueries({ queryKey: POSITIONS_KEY });

      toast({
        title: 'Success',
        description: 'Category updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: data => {
      queryClient.setQueryData<Category[]>(CATEGORIES_KEY, oldData => {
        return oldData ? oldData.filter(category => category.id !== data.id) : [];
      });
      queryClient.invalidateQueries({ queryKey: POSITIONS_KEY });

      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    },
  });
};

export const useSetDefaultCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: SetDefaultCategoryParams) => setDefaultCategory(data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: DEFAULT_CATEGORY_KEY });
      queryClient.refetchQueries({ queryKey: CATEGORIES_KEY });
      queryClient.invalidateQueries({ queryKey: POSITIONS_KEY });

      toast({
        title: 'Success',
        description: 'Default category updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    },
  });
};
