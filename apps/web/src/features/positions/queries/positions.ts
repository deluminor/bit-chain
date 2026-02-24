import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createPosition,
  deletePosition,
  getPositionsByUserId,
  updatePosition,
} from '../api/positions';
import { Trade } from '../types/position';

export const POSITIONS_KEY = ['positions'] as const;

const showToast = (
  toast: ReturnType<typeof useToast>['toast'],
  title: string,
  description: string,
  variant?: 'destructive',
) => {
  toast({
    title,
    description,
    variant,
  });
};

export const usePositions = () => {
  return useQuery({
    queryKey: POSITIONS_KEY,
    queryFn: getPositionsByUserId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useCreatePosition = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPosition,
    onSuccess: data => {
      queryClient.setQueryData<Trade[]>(POSITIONS_KEY, old => [data, ...(old || [])]);
      showToast(toast, 'Position created', 'Your position has been created successfully.');
      return data;
    },
    onError: () => {
      showToast(toast, 'Error', 'Failed to create position. Please try again.', 'destructive');
    },
  });
};

export const useUpdatePosition = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: Trade) => updatePosition(id, data),
    onSuccess: data => {
      queryClient.setQueryData<Trade[]>(
        POSITIONS_KEY,
        old => old?.map(trade => (trade.id === data.id ? data : trade)) || [],
      );
      showToast(toast, 'Position updated', 'Your position has been updated successfully.');
      return data;
    },
    onError: () => {
      showToast(toast, 'Error', 'Failed to update position. Please try again.', 'destructive');
    },
  });
};

export const useDeletePosition = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: Pick<Trade, 'id'>) => deletePosition(id),
    onSuccess: (_, { id }) => {
      queryClient.setQueryData<Trade[]>(
        POSITIONS_KEY,
        old => old?.filter(trade => trade.id !== id) || [],
      );
      showToast(toast, 'Position deleted', 'Your position has been deleted successfully.');
    },
    onError: () => {
      showToast(toast, 'Error', 'Failed to delete position. Please try again.', 'destructive');
    },
  });
};
