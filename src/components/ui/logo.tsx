'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Bitcoin, DollarSign } from 'lucide-react';
import { useDashboardMode } from '@/store/dashboard-mode';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
}

export function Logo({ className, size = 'md', withText = true }: LogoProps) {
  const { mode } = useDashboardMode();
  const sizeMap = {
    sm: { icon: 'h-4 w-4', text: 'text-sm' },
    md: { icon: 'h-5 w-5', text: 'text-base' },
    lg: { icon: 'h-6 w-6', text: 'text-lg' },
  };

  const sizes = sizeMap[size];
  const isFinanceMode = mode === 'finance';
  const IconComponent = isFinanceMode ? DollarSign : Bitcoin;
  const bgColor = isFinanceMode ? 'bg-green-500' : 'bg-orange-500';

  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      <div className={cn('p-2 rounded-lg shadow-sm', bgColor)}>
        <IconComponent className={cn('text-white', sizes.icon)} />
      </div>
      {withText && <span className={cn('font-medium', sizes.text)}>BitChain</span>}
    </Link>
  );
}
