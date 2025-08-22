'use client';

import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/useMobile';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  desktopClassName?: string;
}

export function ResponsiveContainer({
  children,
  className,
  mobileClassName = '',
  desktopClassName = '',
}: ResponsiveContainerProps) {
  const isMobile = useIsMobile();

  return (
    <div className={cn(className, isMobile ? mobileClassName : desktopClassName)}>{children}</div>
  );
}

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  gap?: number;
}

export function ResponsiveGrid({
  children,
  className,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 4,
}: ResponsiveGridProps) {
  const gridCols = `grid-cols-${cols.mobile} md:grid-cols-${cols.tablet} lg:grid-cols-${cols.desktop}`;
  const gridGap = `gap-${gap}`;

  return <div className={cn('grid', gridCols, gridGap, className)}>{children}</div>;
}

interface MobileOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function MobileOnly({ children, fallback = null }: MobileOnlyProps) {
  const isMobile = useIsMobile();
  return isMobile ? <>{children}</> : <>{fallback}</>;
}

interface DesktopOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function DesktopOnly({ children, fallback = null }: DesktopOnlyProps) {
  const isMobile = useIsMobile();
  return !isMobile ? <>{children}</> : <>{fallback}</>;
}

// Responsive text sizing
interface ResponsiveTextProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
}

export function ResponsiveText({ children, size = 'base', className }: ResponsiveTextProps) {
  const isMobile = useIsMobile();

  const sizeMap = {
    xs: isMobile ? 'text-xs' : 'text-sm',
    sm: isMobile ? 'text-sm' : 'text-base',
    base: isMobile ? 'text-base' : 'text-lg',
    lg: isMobile ? 'text-lg' : 'text-xl',
    xl: isMobile ? 'text-xl' : 'text-2xl',
    '2xl': isMobile ? 'text-xl' : 'text-3xl',
    '3xl': isMobile ? 'text-2xl' : 'text-4xl',
  };

  return <div className={cn(sizeMap[size], className)}>{children}</div>;
}

// Responsive spacing
interface ResponsiveSpacingProps {
  children: React.ReactNode;
  p?: number; // padding
  m?: number; // margin
  className?: string;
}

export function ResponsiveSpacing({ children, p, m, className }: ResponsiveSpacingProps) {
  const isMobile = useIsMobile();

  const padding = p ? (isMobile ? `p-${Math.max(1, p - 2)}` : `p-${p}`) : '';
  const margin = m ? (isMobile ? `m-${Math.max(1, m - 2)}` : `m-${m}`) : '';

  return <div className={cn(padding, margin, className)}>{children}</div>;
}

// Responsive card layout
interface ResponsiveCardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveCardLayout({ children, className }: ResponsiveCardLayoutProps) {
  return (
    <div
      className={cn(
        'grid gap-4',
        'grid-cols-1', // Mobile: 1 column
        'sm:grid-cols-2', // Small: 2 columns
        'lg:grid-cols-3', // Large: 3 columns
        'xl:grid-cols-4', // XL: 4 columns
        className,
      )}
    >
      {children}
    </div>
  );
}

// Responsive chart container
interface ResponsiveChartProps {
  children: React.ReactNode;
  className?: string;
  height?: {
    mobile: number;
    desktop: number;
  };
}

export function ResponsiveChart({
  children,
  className,
  height, // = { mobile: 300, desktop: 400 },
}: ResponsiveChartProps) {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn('w-full', className)}
      style={{
        height: height ? (isMobile ? `${height.mobile}px` : `${height.desktop}px`) : 'auto',
        minHeight: height ? (isMobile ? `${height.mobile}px` : `${height.desktop}px`) : 'auto',
      }}
    >
      {children}
    </div>
  );
}

// Responsive modal/dialog
interface ResponsiveModalProps {
  children: React.ReactNode;
  className?: string;
  fullScreenOnMobile?: boolean;
}

export function ResponsiveModal({
  children,
  className,
  fullScreenOnMobile = true,
}: ResponsiveModalProps) {
  return (
    <div
      className={cn(
        // Base styles
        'bg-background rounded-lg shadow-lg',
        // Mobile: full screen if enabled, otherwise with margin
        fullScreenOnMobile
          ? 'w-full h-full md:w-auto md:h-auto md:max-w-lg md:max-h-[90vh]'
          : 'w-[95vw] max-w-lg max-h-[90vh]',
        // Desktop: standard modal size
        'md:rounded-lg',
        className,
      )}
    >
      {children}
    </div>
  );
}

// Responsive button group
interface ResponsiveButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  stackOnMobile?: boolean;
}

export function ResponsiveButtonGroup({
  children,
  className,
  stackOnMobile = true,
}: ResponsiveButtonGroupProps) {
  return (
    <div
      className={cn(
        'flex gap-2',
        stackOnMobile ? 'flex-col sm:flex-row' : 'flex-row flex-wrap',
        className,
      )}
    >
      {children}
    </div>
  );
}

// Responsive table wrapper
interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveTable({ children, className }: ResponsiveTableProps) {
  return (
    <div
      className={cn(
        'overflow-x-auto',
        'border rounded-lg',
        // Hide scrollbar on webkit browsers
        '[&::-webkit-scrollbar]:hidden',
        '[-ms-overflow-style:none]',
        '[scrollbar-width:none]',
        className,
      )}
    >
      <div className="min-w-full">{children}</div>
    </div>
  );
}

// Responsive sidebar content
interface ResponsiveSidebarContentProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveSidebarContent({ children, className }: ResponsiveSidebarContentProps) {
  return (
    <div
      className={cn(
        // Mobile: full height with padding
        'px-4 py-6',
        // Desktop: adjusted padding
        'md:px-6 md:py-8',
        className,
      )}
    >
      {children}
    </div>
  );
}

// Hook for responsive breakpoints
export function useResponsiveBreakpoints() {
  const isMobile = useIsMobile();

  return {
    isMobile,
    isTablet: !isMobile && window.innerWidth < 1024,
    isDesktop: !isMobile && window.innerWidth >= 1024,
    isLargeDesktop: !isMobile && window.innerWidth >= 1280,
  };
}
