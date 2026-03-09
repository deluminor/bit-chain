'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from './badge';

interface CharacterCounterProps {
  value: string;
  maxLength: number;
  className?: string;
}

export function CharacterCounter({ value, maxLength, className }: CharacterCounterProps) {
  const remaining = maxLength - value.length;
  const isNearLimit = remaining <= 10;
  const isOverLimit = remaining < 0;

  return (
    <div className={cn('text-right text-xs', className)}>
      <Badge
        variant={isOverLimit ? 'destructive' : isNearLimit ? 'secondary' : 'outline'}
        className="text-xs"
      >
        {value.length} / {maxLength}
      </Badge>
    </div>
  );
}

interface TextareaWithCounterProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength?: number;
  className?: string;
}

export function TextareaWithCounter({
  maxLength = 500,
  className,
  value = '',
  ...props
}: TextareaWithCounterProps) {
  const currentValue = typeof value === 'string' ? value : '';

  return (
    <div className="space-y-2">
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        value={value}
        maxLength={maxLength}
        {...props}
      />
      <CharacterCounter value={currentValue} maxLength={maxLength} />
    </div>
  );
}
