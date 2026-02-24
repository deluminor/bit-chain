'use client';

import { Bitcoin, DollarSign } from 'lucide-react';
import { useDashboardMode } from '@/store/dashboard-mode';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useIsClient } from '@/hooks/useIsClient';

export function ModeToggle() {
  const { mode, setMode } = useDashboardMode();
  const router = useRouter();
  const isClient = useIsClient();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isClient) {
      const savedMode = localStorage.getItem('dashboard-mode');
      if (savedMode && (savedMode === 'crypto' || savedMode === 'finance')) {
        setMode(savedMode);
      }
    }
  }, [isClient, setMode]);

  // Don't render until we've hydrated and we're on client
  if (!isClient) {
    return (
      <div className="flex items-center justify-center mb-6 w-full max-w-md mx-auto">
        <div className="animate-pulse bg-muted/50 rounded-xl border border-border/20 h-12 w-full" />
      </div>
    );
  }

  const handleModeSwitch = async (newMode: 'crypto' | 'finance') => {
    if (newMode === mode || isTransitioning) return;

    try {
      setIsTransitioning(true);
      setMode(newMode);
      await new Promise(resolve => setTimeout(resolve, 200));
      router.push('/dashboard');
    } catch (error) {
      console.error('Error switching mode:', error);
    } finally {
      setIsTransitioning(false);
    }
  };

  return (
    <div className="flex items-center justify-center mb-2 w-full max-w-md mx-auto">
      <div className="relative inline-flex bg-muted/50 rounded-xl px-2 py-1 w-full border border-border/20">
        {/* Sliding background indicator */}
        <div
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-background rounded-lg shadow-sm border border-border/10 transition-all duration-300 ease-out ${
            mode === 'finance' ? 'left-1' : 'left-[calc(50%+2px)]'
          }`}
        />

        <button
          onClick={() => handleModeSwitch('finance')}
          disabled={isTransitioning}
          className={`relative z-10 flex items-center gap-2 px-1 py-1 rounded-lg text-sm font-medium transition-all duration-200 ease-out flex-1 justify-center ${
            mode === 'finance'
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground/80'
          } ${isTransitioning ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
        >
          <DollarSign
            className={`h-5 w-5 transition-all duration-200 ease-out ${
              mode === 'finance' ? 'text-green-500' : 'text-muted-foreground'
            }`}
          />
          <span className="truncate">Finance</span>
        </button>

        <button
          onClick={() => handleModeSwitch('crypto')}
          disabled={isTransitioning}
          className={`relative z-10 flex items-center gap-2 px-1 py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-out flex-1 justify-center ${
            mode === 'crypto' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'
          } ${isTransitioning ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
        >
          <Bitcoin
            className={`h-5 w-5 transition-all duration-200 ease-out ${
              mode === 'crypto' ? 'text-orange-500' : 'text-muted-foreground'
            }`}
          />
          <span className="truncate">Crypto</span>
        </button>
      </div>
    </div>
  );
}
