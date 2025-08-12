'use client';

import { cn } from '@/lib/utils';
import { Loader2, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Badge } from './badge';

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function LoadingSpinner({ className, size = 'md', text, ...props }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className={cn('flex items-center justify-center gap-2', className)} {...props}>
      <Loader2 className={cn('animate-spin', sizeClasses[size])} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  children: React.ReactNode;
}

export function LoadingOverlay({ isLoading, text = 'Loading...', children }: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
          <LoadingSpinner text={text} size="lg" />
        </div>
      )}
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center text-center py-12 px-6', className)}
    >
      {Icon && (
        <div className="mb-4 p-3 rounded-full bg-muted">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && <p className="text-muted-foreground text-sm mb-6 max-w-sm">{description}</p>}
      {action && (
        <Button variant={action.variant || 'default'} onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  retry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  retry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center text-center py-12 px-6', className)}
    >
      <div className="mb-4 p-3 rounded-full bg-red-50 dark:bg-red-900/20">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-red-900 dark:text-red-100">{title}</h3>
      <p className="text-red-700 dark:text-red-300 text-sm mb-6 max-w-sm">{message}</p>
      {retry && (
        <Button variant="outline" onClick={retry}>
          Try again
        </Button>
      )}
    </div>
  );
}

interface StatusIndicatorProps {
  status: 'loading' | 'success' | 'error' | 'idle';
  successMessage?: string;
  errorMessage?: string;
  loadingMessage?: string;
  className?: string;
}

export function StatusIndicator({
  status,
  successMessage = 'Success!',
  errorMessage = 'Error occurred',
  loadingMessage = 'Loading...',
  className,
}: StatusIndicatorProps) {
  const getStatusContent = () => {
    switch (status) {
      case 'loading':
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          message: loadingMessage,
          variant: 'secondary' as const,
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="h-4 w-4" />,
          message: successMessage,
          variant: 'default' as const,
        };
      case 'error':
        return {
          icon: <XCircle className="h-4 w-4" />,
          message: errorMessage,
          variant: 'destructive' as const,
        };
      default:
        return null;
    }
  };

  const content = getStatusContent();

  if (!content || status === 'idle') return null;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Badge variant={content.variant} className="flex items-center gap-1">
        {content.icon}
        {content.message}
      </Badge>
    </div>
  );
}

interface ProgressiveLoadingProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function ProgressiveLoading({ steps, currentStep, className }: ProgressiveLoadingProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <LoadingSpinner size="sm" />
          Loading...
        </CardTitle>
        <CardDescription>
          Step {Math.min(currentStep + 1, steps.length)} of {steps.length}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-3">
            {index < currentStep ? (
              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
            ) : index === currentStep ? (
              <Loader2 className="h-4 w-4 animate-spin text-blue-500 flex-shrink-0" />
            ) : (
              <div className="h-4 w-4 rounded-full border-2 border-muted flex-shrink-0" />
            )}
            <span
              className={cn(
                'text-sm',
                index <= currentStep ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {step}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
