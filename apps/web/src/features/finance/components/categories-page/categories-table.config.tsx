'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumn, FilterField, createSelectFilter } from '@/components/ui/data-table';
import { CategoryFilters, TransactionCategory } from '@/features/finance/queries/categories';
import {
  Briefcase,
  Car,
  Coffee,
  DollarSign,
  Eye,
  EyeOff,
  Gamepad2,
  Gift,
  GraduationCap,
  HeartHandshake,
  Home,
  Plane,
  ShoppingCart,
  Tag,
  Wrench,
} from 'lucide-react';

const ICON_MAP = {
  DollarSign,
  ShoppingCart,
  Home,
  Car,
  Coffee,
  Gamepad2,
  HeartHandshake,
  Briefcase,
  GraduationCap,
  Plane,
  Gift,
  Wrench,
} as const;

function getIconComponent(iconName: string) {
  return ICON_MAP[iconName as keyof typeof ICON_MAP] || Tag;
}

export function createCategoryColumns(): DataTableColumn<TransactionCategory>[] {
  return [
    {
      key: 'icon',
      header: '',
      className: 'w-[60px]',
      cell: category => {
        const IconComponent = getIconComponent(category.icon);
        return (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: category.color }}
          >
            <IconComponent className="w-4 h-4 text-white" />
          </div>
        );
      },
    },
    {
      key: 'name',
      header: 'Name',
      cell: category => (
        <div>
          <div className="font-medium flex items-center gap-2">
            {category.name}
            {category.isDefault && (
              <Badge variant="secondary" className="text-xs">
                Default
              </Badge>
            )}
            {!category.isActive && (
              <Badge variant="outline" className="text-xs">
                Inactive
              </Badge>
            )}
          </div>
          {category.parent && (
            <div className="text-xs text-muted-foreground">Under: {category.parent.name}</div>
          )}
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      cell: category => (
        <Badge variant={category.type === 'INCOME' ? 'default' : 'secondary'}>
          {category.type}
        </Badge>
      ),
    },
    {
      key: 'usage',
      header: 'Usage',
      cell: category => (
        <div className="text-sm">
          <div>{category._count.transactions} transactions</div>
          {category._count.children > 0 && (
            <div className="text-xs text-muted-foreground">
              {category._count.children} subcategories
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'color',
      header: 'Color',
      cell: category => (
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full border"
            style={{ backgroundColor: category.color }}
          />
          <span className="text-xs text-muted-foreground">{category.color}</span>
        </div>
      ),
    },
  ];
}

export function createCategoryFilterFields(
  filters: CategoryFilters,
  onFiltersChange: (filters: CategoryFilters) => void,
): FilterField[] {
  return [
    createSelectFilter(
      'type',
      filters.type,
      value =>
        onFiltersChange({
          ...filters,
          type: value === 'all' ? undefined : (value as 'INCOME' | 'EXPENSE'),
        }),
      [
        { value: 'INCOME', label: 'Income' },
        { value: 'EXPENSE', label: 'Expense' },
      ],
      'types',
    ),
    {
      key: 'includeInactive',
      type: 'custom',
      onChange: () => {},
      render: () => (
        <Button
          variant={filters.includeInactive ? 'default' : 'outline'}
          size="sm"
          onClick={() =>
            onFiltersChange({
              ...filters,
              includeInactive: !filters.includeInactive,
            })
          }
          className="h-9"
        >
          {filters.includeInactive ? (
            <Eye className="w-4 h-4 mr-2" />
          ) : (
            <EyeOff className="w-4 h-4 mr-2" />
          )}
          {filters.includeInactive ? 'Show All' : 'Active Only'}
        </Button>
      ),
    },
  ];
}
