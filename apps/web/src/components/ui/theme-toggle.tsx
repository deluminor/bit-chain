'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/providers/ThemeProvider';
import { THEME } from '@/store';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className={cn('relative h-9 w-9 rounded-full border hover:bg-accent', className)}
      title={theme === THEME.LIGHT ? 'Switch to dark theme' : 'Switch to light theme'}
    >
      <div className="relative h-5 w-5">
        <span
          className={cn(
            'absolute inset-0 rotate-0 scale-100 flex items-center justify-center',
            theme === THEME.DARK && 'rotate-90 scale-0',
          )}
        >
          <Sun className="h-5 w-5" />
        </span>
        <span
          className={cn(
            'absolute inset-0 rotate-90 scale-0 flex items-center justify-center',
            theme === THEME.DARK && 'rotate-0 scale-100',
          )}
        >
          <Moon className="h-5 w-5" />
        </span>
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
