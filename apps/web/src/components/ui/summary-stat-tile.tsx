'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type SummaryStatTone =
  | 'default'
  | 'purple'
  | 'income'
  | 'expense'
  | 'transfer'
  | 'orange'
  | 'blue'
  | 'green'
  | 'rose'
  | 'cyan'
  | 'emerald';

const TONE_STYLES: Record<SummaryStatTone, { iconWrap: string; icon: string; value: string }> = {
  default: { iconWrap: 'bg-muted', icon: 'text-muted-foreground', value: 'text-foreground' },
  purple: { iconWrap: 'bg-purple-500/10', icon: 'text-purple-500', value: 'text-foreground' },
  income: { iconWrap: 'bg-income/10', icon: 'text-income', value: 'text-income' },
  expense: { iconWrap: 'bg-expense/10', icon: 'text-expense', value: 'text-expense' },
  transfer: { iconWrap: 'bg-transfer/10', icon: 'text-transfer', value: 'text-transfer' },
  orange: { iconWrap: 'bg-orange-500/10', icon: 'text-orange-500', value: 'text-foreground' },
  blue: { iconWrap: 'bg-blue-500/10', icon: 'text-blue-500', value: 'text-foreground' },
  green: { iconWrap: 'bg-green-500/10', icon: 'text-green-500', value: 'text-foreground' },
  rose: { iconWrap: 'bg-rose-500/10', icon: 'text-rose-500', value: 'text-foreground' },
  cyan: { iconWrap: 'bg-cyan-500/10', icon: 'text-cyan-500', value: 'text-foreground' },
  emerald: { iconWrap: 'bg-emerald-500/10', icon: 'text-emerald-500', value: 'text-foreground' },
};

export interface SummaryStatTileProps {
  title: string;
  value: ReactNode;
  hint?: ReactNode;
  icon: LucideIcon;
  tone?: SummaryStatTone;
  valueClassName?: string;
  className?: string;
  iconClassName?: string;
}

export function SummaryStatTile({
  title,
  value,
  hint,
  icon: Icon,
  tone = 'default',
  valueClassName,
  className,
  iconClassName,
}: SummaryStatTileProps) {
  const t = TONE_STYLES[tone];
  return (
    <Card
      className={cn(
        'border-border/60 px-3 py-2 shadow-sm transition-colors hover:bg-muted/25',
        className,
      )}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-md', t.iconWrap)}
        >
          <Icon className={cn('h-3.5 w-3.5', t.icon, iconClassName)} />
        </div>
        <div className="min-w-0 flex-1">
          <span className="block truncate text-xs font-medium leading-tight text-foreground/90">
            {title}
          </span>
          {hint != null && hint !== '' ? (
            <p className="mt-0.5 line-clamp-1 text-[11px] leading-tight text-muted-foreground">
              {hint}
            </p>
          ) : null}
        </div>
        <div className="shrink-0 text-right">
          <span
            className={cn(
              'block text-base font-semibold leading-tight tabular-nums',
              valueClassName ?? t.value,
            )}
          >
            {value}
          </span>
        </div>
      </div>
    </Card>
  );
}

export function SummaryStatsRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('grid grid-cols-1 gap-2 *:min-w-0', className)}>{children}</div>;
}
