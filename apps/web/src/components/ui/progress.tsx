'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: number;
    max?: number;
    indeterminate?: boolean;
  }
>(({ className, value, max = 100, indeterminate = false, ...props }, ref) => (
  <div
    ref={ref}
    role="progressbar"
    aria-valuemin={0}
    aria-valuemax={max}
    aria-valuenow={value}
    data-state={indeterminate ? 'indeterminate' : 'determinate'}
    data-max={max}
    data-value={value}
    className={cn(
      'relative h-2 w-full overflow-hidden rounded-full bg-secondary/20',
      indeterminate && 'bg-transparent backdrop-blur-sm',
      className,
    )}
    {...props}
  >
    {indeterminate ? (
      <div
        className="animate-indeterminate-progress h-full w-full"
        style={{
          backfaceVisibility: 'hidden',
          perspective: 1000,
          transform: 'translateZ(0)',
        }}
      />
    ) : (
      <div
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{
          transform: `translateX(-${100 - ((value || 0) / max) * 100}%)`,
        }}
      />
    )}
  </div>
));
Progress.displayName = 'Progress';

export { Progress };
