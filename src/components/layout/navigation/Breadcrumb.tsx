'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useDashboardMode } from '@/store/dashboard-mode';
import {
  Home,
  LayoutDashboardIcon,
  WalletIcon,
  ArrowRightLeftIcon,
  PieChartIcon,
  Target,
  TrendingUpIcon,
  TableIcon,
  DatabaseIcon,
  FileText,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  href?: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

// Route configurations for different modes
const routeConfigs = {
  crypto: {
    '/': { label: 'Dashboard', icon: LayoutDashboardIcon },
    '/journal': { label: 'Trading Journal', icon: TableIcon },
    '/analytics': { label: 'Analytics', icon: TrendingUpIcon },
    '/backup': { label: 'Backup', icon: DatabaseIcon },
    '/reports': { label: 'Reports', icon: FileText },
  },
  finance: {
    '/': { label: 'Dashboard', icon: LayoutDashboardIcon },
    '/accounts': { label: 'Accounts', icon: WalletIcon },
    '/transactions': { label: 'Transactions', icon: ArrowRightLeftIcon },
    '/budget': { label: 'Budget', icon: PieChartIcon },
    '/goals': { label: 'Goals', icon: Target },
    '/reports': { label: 'Reports', icon: TrendingUpIcon },
    '/backup': { label: 'Backup', icon: DatabaseIcon },
  },
} as const;

// Sub-route patterns
const subRoutePatterns = {
  '/accounts/add': { parent: '/accounts', label: 'Add Account' },
  '/accounts/edit': { parent: '/accounts', label: 'Edit Account' },
  '/transactions/add': { parent: '/transactions', label: 'Add Transaction' },
  '/transactions/edit': { parent: '/transactions', label: 'Edit Transaction' },
  '/transactions/transfer': { parent: '/transactions', label: 'Transfer Funds' },
  '/budget/add': { parent: '/budget', label: 'Create Budget' },
  '/budget/edit': { parent: '/budget', label: 'Edit Budget' },
  '/goals/add': { parent: '/goals', label: 'Create Goal' },
  '/goals/edit': { parent: '/goals', label: 'Edit Goal' },
  '/journal/add': { parent: '/journal', label: 'Add Trade' },
  '/journal/edit': { parent: '/journal', label: 'Edit Trade' },
};

function generateBreadcrumbs(pathname: string, mode: 'crypto' | 'finance'): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [];
  const config = routeConfigs[mode];

  // Always start with Home/Dashboard
  if (pathname !== '/') {
    breadcrumbs.push({
      href: '/',
      label: 'Dashboard',
      icon: Home,
    });
  }

  // Handle exact matches first
  if (config[pathname as keyof typeof config]) {
    const route = config[pathname as keyof typeof config];
    if (pathname !== '/') {
      breadcrumbs.push({
        label: route.label,
        icon: route.icon,
      });
    }
    return breadcrumbs;
  }

  // Handle sub-routes
  const subRoute = subRoutePatterns[pathname as keyof typeof subRoutePatterns];
  if (subRoute) {
    const parentRoute = config[subRoute.parent as keyof typeof config];
    if (parentRoute) {
      breadcrumbs.push({
        href: subRoute.parent,
        label: parentRoute.label,
        icon: parentRoute.icon,
      });
    }
    breadcrumbs.push({
      label: subRoute.label,
    });
    return breadcrumbs;
  }

  // Handle dynamic routes (with IDs)
  const pathSegments = pathname.split('/').filter(Boolean);
  let currentPath = '';

  for (let i = 0; i < pathSegments.length; i++) {
    currentPath += `/${pathSegments[i]}`;

    // Check if this is a known route
    if (config[currentPath as keyof typeof config]) {
      const route = config[currentPath as keyof typeof config];
      const isLast = i === pathSegments.length - 1;

      breadcrumbs.push({
        href: isLast ? undefined : currentPath,
        label: route.label,
        icon: route.icon,
      });
    } else if (i === pathSegments.length - 1) {
      // Last segment, try to determine what it is
      const segment = pathSegments[i];
      const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));

      // Check if parent is a known route
      if (config[parentPath as keyof typeof config]) {
        const parentRoute = config[parentPath as keyof typeof config];
        if (i === 1) {
          // Only add parent if not already added
          breadcrumbs.push({
            href: parentPath,
            label: parentRoute.label,
            icon: parentRoute.icon,
          });
        }

        // Add current page based on context
        if (segment === 'add') {
          breadcrumbs.push({ label: `Add ${parentRoute.label.slice(0, -1)}` });
        } else if (segment === 'edit') {
          breadcrumbs.push({ label: `Edit ${parentRoute.label.slice(0, -1)}` });
        } else {
          // Assume it's an ID or specific item
          breadcrumbs.push({ label: 'Details' });
        }
      }
    }
  }

  return breadcrumbs;
}

export function AppBreadcrumb() {
  const pathname = usePathname();
  const { mode } = useDashboardMode();

  // Don't show breadcrumbs on dashboard
  if (pathname === '/') {
    return null;
  }

  const breadcrumbs = generateBreadcrumbs(pathname, mode);

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink href={item.href} className="flex items-center gap-2">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="flex items-center gap-2">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
