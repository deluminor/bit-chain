'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  FilterField,
  TableFilters,
  createSearchFilter,
  createSelectFilter,
} from '@/components/ui/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useBudgetFilters } from '@/features/finance/hooks/useBudgetFilters';
import type { Budget } from '@/features/finance/queries/budget';
import { formatEuroAmount } from '@/lib/currency';
import { Calendar, Clock, Edit, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { useMemo } from 'react';

interface BudgetListProps {
  budgets: Budget[];
  onCreate: () => void;
  onEdit?: (budget: Budget) => void;
  onDelete?: (budget: Budget) => void;
  onToggleStatus?: (budget: Budget) => void;
}

export function BudgetList({
  budgets: allBudgets,
  onEdit,
  onDelete,
  onToggleStatus,
  onCreate,
}: BudgetListProps) {
  const { filters, handleSearchChange, handleStatusFilterChange, resetFilters } =
    useBudgetFilters();

  const budgets = useMemo(() => {
    return allBudgets.filter(budget => {
      if (
        filters.searchTerm &&
        !budget.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      ) {
        return false;
      }

      if (filters.statusFilter) {
        const isActive = filters.statusFilter === 'active';
        if (budget.isActive !== isActive) return false;
      }

      return true;
    });
  }, [allBudgets, filters]);

  const clearFilters = () => {
    resetFilters();
  };

  const hasActiveFilters = Boolean(filters.searchTerm || filters.statusFilter);

  const hasRowActions = Boolean(onEdit || onDelete || onToggleStatus);

  const filterFields: FilterField[] = [
    createSearchFilter('search', filters.searchTerm, handleSearchChange, 'Search budgets...'),
    createSelectFilter(
      'status',
      filters.statusFilter,
      value =>
        handleStatusFilterChange(value === 'all' ? undefined : (value as 'active' | 'inactive')),
      [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
      'status',
    ),
  ];

  return (
    <div className="space-y-4">
      <Card className="shadow-md rounded-lg hover:shadow-lg transition-shadow">
        <div className="p-4 border-b flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <TableFilters
            fields={filterFields}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
            layout="flex"
            showCard={false}
            className="items-center w-full"
          />
        </div>
        <CardContent className="pt-4">
          {budgets.length > 0 ? (
            <div className="space-y-4">
              {budgets.map(budget => (
                <div
                  key={budget.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          budget.isActive ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      ></div>
                      <div>
                        <h4 className="font-medium">{budget.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {budget.period}
                          </Badge>
                          <span>•</span>
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(budget.startDate).toLocaleDateString()} -{' '}
                            {new Date(budget.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">
                        {formatEuroAmount(budget.totalActualBase ?? budget.totalActual)} /{' '}
                        {formatEuroAmount(budget.totalPlannedBase ?? budget.totalPlanned)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {(budget.totalPlannedBase ?? budget.totalPlanned) > 0
                          ? Math.round(
                              ((budget.totalActualBase ?? budget.totalActual) /
                                (budget.totalPlannedBase ?? budget.totalPlanned)) *
                                100,
                            )
                          : 0}
                        % used
                      </div>
                    </div>
                    {hasRowActions ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onEdit ? (
                            <DropdownMenuItem
                              onClick={() => {
                                onEdit(budget);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          ) : null}
                          {onToggleStatus ? (
                            <DropdownMenuItem
                              onClick={() => {
                                onToggleStatus(budget);
                              }}
                            >
                              <Calendar className="h-4 w-4 mr-2" />
                              {budget.isActive ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                          ) : null}
                          {onDelete && (onEdit || onToggleStatus) ? (
                            <DropdownMenuSeparator />
                          ) : null}
                          {onDelete ? (
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                onDelete(budget);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-4">
                {hasActiveFilters ? 'No budgets match your filters' : 'No budgets created yet'}
              </div>
              {!hasActiveFilters && (
                <Button onClick={onCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Budget
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
