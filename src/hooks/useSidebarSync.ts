import { useStore } from '@/store';
import { useEffect } from 'react';

/**
 * Hook to synchronize sidebar state between UI component and store
 * @param isOpen Current open state of the sidebar component
 * @param setOpen Function to set the open state in the sidebar component
 */
export function useSidebarSync(isOpen: boolean, setOpen: (open: boolean) => void) {
  const { isNavigationOpen, setNavigationOpen } = useStore();

  useEffect(() => {
    if (isOpen !== isNavigationOpen) {
      setOpen(isNavigationOpen);
    }
  }, [isOpen, isNavigationOpen, setOpen]);

  // Update store when component state changes
  useEffect(() => {
    if (isOpen !== isNavigationOpen) {
      setNavigationOpen(isOpen);
    }
  }, [isOpen, isNavigationOpen, setNavigationOpen]);

  return {
    storeIsOpen: isNavigationOpen,
    setStoreIsOpen: setNavigationOpen,
  };
}
