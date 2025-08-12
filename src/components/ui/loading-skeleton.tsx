import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
  variant?: 'default' | 'card' | 'text' | 'circle' | 'button';
}

export function Skeleton({ className, count = 1, variant = 'default', ...props }: SkeletonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'card':
        return 'h-32 w-full rounded-lg';
      case 'text':
        return 'h-4 w-3/4 rounded';
      case 'circle':
        return 'h-12 w-12 rounded-full';
      case 'button':
        return 'h-10 w-24 rounded-md';
      default:
        return 'h-4 w-full rounded';
    }
  };

  const baseClass = cn('animate-pulse bg-muted', getVariantStyles(), className);

  if (count === 1) {
    return <div className={baseClass} {...props} />;
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={baseClass} {...props} />
      ))}
    </div>
  );
}

// Pre-defined skeleton layouts for common use cases
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-4 p-6 border rounded-lg', className)}>
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" className="h-10 w-10" />
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" className="w-1/3" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
      </div>
      <Skeleton variant="default" className="h-20" />
    </div>
  );
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 py-3">
      {Array.from({ length: columns }, (_, i) => (
        <Skeleton key={i} variant="text" className="flex-1" />
      ))}
    </div>
  );
}

export function StatCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('p-6 border rounded-lg space-y-3', className)}>
      <div className="flex items-center justify-between">
        <Skeleton variant="text" className="w-1/3" />
        <Skeleton variant="circle" className="h-6 w-6" />
      </div>
      <Skeleton variant="text" className="w-1/2 h-8" />
      <Skeleton variant="text" className="w-2/3" />
    </div>
  );
}

export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton variant="text" className="w-32" />
          <Skeleton variant="text" className="w-48" />
        </div>
        <Skeleton variant="button" />
      </div>
      <Skeleton variant="card" className="h-80" />
    </div>
  );
}

export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }, (_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton variant="text" className="w-1/4" />
          <Skeleton variant="button" className="w-full h-10" />
        </div>
      ))}
      <div className="flex gap-3 pt-4">
        <Skeleton variant="button" />
        <Skeleton variant="button" />
      </div>
    </div>
  );
}
