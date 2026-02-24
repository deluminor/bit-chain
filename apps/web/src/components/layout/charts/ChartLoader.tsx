'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';

interface ChartLoaderProps {
  children: React.ReactNode;
}

export function ChartLoader({ children }: ChartLoaderProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-[250px]">
          <Skeleton className="w-full h-full" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
