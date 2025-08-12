import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DemoModeAction, toggleDemoMode } from '../api/demo-mode';

const DEMO_MODE_KEY = 'demo-mode';

export const useDemoMode = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const toggle = async (action: DemoModeAction) => {
    await toggleDemoMode(action);
    localStorage.setItem(DEMO_MODE_KEY, action === 'add' ? 'true' : 'false');
  };

  return useMutation({
    mutationFn: toggle,
    onSuccess: (_, action) => {
      // Invalidate queries to refresh all data
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      queryClient.invalidateQueries({ queryKey: ['finance'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['budget'] });
      queryClient.invalidateQueries({ queryKey: ['goals'] });

      toast({
        title: 'Demo Mode',
        description:
          action === 'add'
            ? 'Demo data for trading and finance has been added successfully!'
            : 'All demo data has been removed successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to toggle demo mode. Please try again.',
        variant: 'destructive',
      });
    },
  });
};
