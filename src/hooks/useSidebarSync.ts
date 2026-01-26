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
    if (isNavigationOpen !== isOpen) {
      setOpen(isNavigationOpen);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNavigationOpen, setOpen]);

  useEffect(() => {
    if (isOpen !== isNavigationOpen) {
      setNavigationOpen(isOpen);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, setNavigationOpen]);

  return {
    storeIsOpen: isNavigationOpen,
    setStoreIsOpen: setNavigationOpen,
  };
}
