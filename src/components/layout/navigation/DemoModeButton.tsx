'use client';

import { Button } from '@/components/ui/button';
import { useDemoMode } from '@/features/positions/queries/demo-mode';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function DemoModeButton() {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { mutate: toggleDemoMode, isPending } = useDemoMode();

  useEffect(() => {
    const storedDemoMode = localStorage.getItem('demo-mode') === 'true';
    setIsDemoMode(storedDemoMode);
  }, []);

  const handleToggleDemoMode = () => {
    toggleDemoMode(isDemoMode ? 'remove' : 'add', {
      onSuccess: () => {
        setIsDemoMode(!isDemoMode);
      },
    });
  };

  return (
    <Button
      variant={isDemoMode ? 'destructive' : 'default'}
      size="sm"
      className="w-full"
      onClick={handleToggleDemoMode}
      disabled={isPending}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isDemoMode ? 'Removing...' : 'Adding...'}
        </>
      ) : isDemoMode ? (
        'Remove Demo Data'
      ) : (
        'Add Demo Data'
      )}
    </Button>
  );
}
