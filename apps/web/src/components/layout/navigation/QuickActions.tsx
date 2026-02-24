'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useDashboardMode } from '@/store/dashboard-mode';
import {
  Plus,
  ArrowRightLeft,
  Wallet,
  PieChart,
  Target,
  Landmark,
  TrendingUp,
  FileText,
  Database,
  Eye,
  Edit3,
  MoreHorizontal,
} from 'lucide-react';
import Link from 'next/link';

// Quick actions for crypto mode
const cryptoActions = [
  {
    label: 'Add Trade',
    href: '/journal/add',
    icon: Plus,
    variant: 'default' as const,
    description: 'Record new trade',
  },
  {
    label: 'View Journal',
    href: '/journal',
    icon: Eye,
    variant: 'outline' as const,
    description: 'Browse all trades',
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: TrendingUp,
    variant: 'outline' as const,
    description: 'View performance',
  },
];

// Quick actions for finance mode
const financeActions = [
  {
    label: 'Add Transaction',
    href: '/transactions/add',
    icon: Plus,
    variant: 'default' as const,
    description: 'Record income/expense',
  },
  {
    label: 'Transfer Funds',
    href: '/transactions/transfer',
    icon: ArrowRightLeft,
    variant: 'outline' as const,
    description: 'Between accounts',
  },
  {
    label: 'View Accounts',
    href: '/accounts',
    icon: Wallet,
    variant: 'outline' as const,
    description: 'Manage accounts',
  },
];

// Additional actions available via dropdown
const additionalCryptoActions = [
  { label: 'Export Data', href: '/backup', icon: Database },
  { label: 'View Reports', href: '/reports', icon: FileText },
  { label: 'Settings', href: '/settings', icon: Edit3 },
];

const additionalFinanceActions = [
  { label: 'Budget Planning', href: '/budget', icon: PieChart },
  { label: 'Financial Goals', href: '/goals', icon: Target },
  { label: 'Loans & Debts', href: '/loans', icon: Landmark },
  { label: 'Reports', href: '/reports', icon: TrendingUp },
  { label: 'Export Data', href: '/backup', icon: Database },
];

interface QuickActionsProps {
  variant?: 'sidebar' | 'dashboard';
  limit?: number;
}

export function QuickActions({ variant = 'dashboard', limit = 3 }: QuickActionsProps) {
  const { mode } = useDashboardMode();

  const primaryActions = mode === 'crypto' ? cryptoActions : financeActions;
  const additionalActions = mode === 'crypto' ? additionalCryptoActions : additionalFinanceActions;

  const displayActions = limit ? primaryActions.slice(0, limit) : primaryActions;
  const hasMore = primaryActions.length > limit;

  if (variant === 'sidebar') {
    return (
      <div className="p-4 border-t">
        <div className="space-y-2">
          {displayActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              size="sm"
              asChild
              className="w-full justify-start"
            >
              <Link href={action.href} className="flex items-center gap-2">
                <action.icon className="h-4 w-4" />
                {action.label}
              </Link>
            </Button>
          ))}

          {(hasMore || additionalActions.length > 0) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <MoreHorizontal className="h-4 w-4 mr-2" />
                  More Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {hasMore &&
                  primaryActions.slice(limit).map((action, index) => (
                    <DropdownMenuItem key={index} asChild>
                      <Link href={action.href} className="flex items-center gap-2">
                        <action.icon className="h-4 w-4" />
                        {action.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}

                {hasMore && additionalActions.length > 0 && <DropdownMenuSeparator />}

                {additionalActions.map((action, index) => (
                  <DropdownMenuItem key={index} asChild>
                    <Link href={action.href} className="flex items-center gap-2">
                      <action.icon className="h-4 w-4" />
                      {action.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    );
  }

  // Dashboard variant - card format
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <CardDescription>
          Frequently used {mode === 'crypto' ? 'trading' : 'finance'} operations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {displayActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              asChild
              className="flex items-center gap-2"
            >
              <Link href={action.href}>
                <action.icon className="h-4 w-4" />
                {action.label}
              </Link>
            </Button>
          ))}

          {(hasMore || additionalActions.length > 0) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <MoreHorizontal className="h-4 w-4" />
                  More
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2">
                  <div className="text-sm font-medium mb-2">Additional Actions</div>

                  {hasMore &&
                    primaryActions.slice(limit).map((action, index) => (
                      <DropdownMenuItem key={index} asChild>
                        <Link href={action.href} className="flex items-center gap-3 p-2">
                          <action.icon className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{action.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {action.description}
                            </div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}

                  {hasMore && additionalActions.length > 0 && (
                    <DropdownMenuSeparator className="my-2" />
                  )}

                  {additionalActions.map((action, index) => (
                    <DropdownMenuItem key={index} asChild>
                      <Link href={action.href} className="flex items-center gap-3 p-2">
                        <action.icon className="h-4 w-4" />
                        <span>{action.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
