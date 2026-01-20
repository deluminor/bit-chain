'use client';

import {
  LayoutDashboardIcon,
  TableIcon,
  DatabaseIcon,
  WalletIcon,
  ArrowRightLeftIcon,
  PieChartIcon,
  Target,
  Landmark,
  TrendingUpIcon,
  Tag,
} from 'lucide-react';
import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ROUTES } from '@/features/auth/constants';
import { useSession } from 'next-auth/react';
import { NavMain } from './NavMain';
import { NavUser } from './NavUser';
import { useDashboardMode } from '@/store/dashboard-mode';
import { ModeToggle } from '@/components/dashboard/ModeToggle';

// Navigation items based on dashboard mode
const getCryptoNavigation = () => [
  {
    title: 'Dashboard',
    url: ROUTES.DASHBOARD.path,
    icon: LayoutDashboardIcon,
  },
  {
    title: 'Trading Journal',
    url: ROUTES.TRADING_JOURNAL.path,
    icon: TableIcon,
  },
  {
    title: 'Analytics',
    url: '/analytics',
    icon: TrendingUpIcon,
  },
  {
    title: 'Backup',
    url: '/backup',
    icon: DatabaseIcon,
  },
];

const getFinanceNavigation = () => [
  {
    title: 'Dashboard',
    url: ROUTES.DASHBOARD.path,
    icon: LayoutDashboardIcon,
  },
  {
    title: 'Accounts',
    url: '/accounts',
    icon: WalletIcon,
  },
  {
    title: 'Transactions',
    url: '/transactions',
    icon: ArrowRightLeftIcon,
  },
  {
    title: 'Categories',
    url: '/categories',
    icon: Tag,
  },
  {
    title: 'Budget',
    url: '/budget',
    icon: PieChartIcon,
  },
  {
    title: 'Goals',
    url: '/goals',
    icon: Target,
  },
  {
    title: 'Loans',
    url: '/loans',
    icon: Landmark,
  },
  {
    title: 'Reports',
    url: '/reports',
    icon: TrendingUpIcon,
  },
  {
    title: 'Backup',
    url: '/backup',
    icon: DatabaseIcon,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const { mode } = useDashboardMode();

  const email = session?.user?.email;
  const userName = email?.split('@')[0] || 'User';

  // Get navigation items based on current mode
  const navigationItems = mode === 'crypto' ? getCryptoNavigation() : getFinanceNavigation();

  const userData = {
    name: userName,
    email: email || 'user@example.com',
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <ModeToggle />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
