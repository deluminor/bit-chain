'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ChartWrapperProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  isLoading?: boolean;
  headerActions?: React.ReactNode;
}

export function ChartWrapper({
  title,
  description,
  children,
  footer,
  className,
  contentClassName,
  isLoading,
  headerActions,
}: ChartWrapperProps) {
  return (
    <Card
      className={cn('min-w-0 shadow-md rounded-lg hover:shadow-lg transition-shadow', className)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
            {description && (
              <CardDescription className="text-sm text-muted-foreground">
                {description}
              </CardDescription>
            )}
          </div>
          {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
        </div>
      </CardHeader>
      <CardContent className={cn('pt-0', contentClassName)}>
        {isLoading ? (
          <div className="h-[300px] w-full flex items-center justify-center">
            <div className="animate-pulse bg-muted/40 rounded-lg h-full w-full" />
          </div>
        ) : (
          children
        )}
      </CardContent>
      {footer && (
        <CardFooter className="pt-4 border-t border-border/50">
          <div className="w-full">{footer}</div>
        </CardFooter>
      )}
    </Card>
  );
}
