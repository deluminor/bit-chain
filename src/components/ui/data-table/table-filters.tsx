'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, RefreshCw, Search, XCircle } from 'lucide-react';
import { ReactNode } from 'react';
import { DateRange } from 'react-day-picker';

export interface FilterOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FilterField {
  key: string;
  type: 'search' | 'select' | 'date-range' | 'custom';
  label?: string;
  placeholder?: string;
  value?: any;
  options?: FilterOption[];
  onChange: (value: any) => void;
  className?: string;
  render?: () => ReactNode; // For custom filter fields
}

export interface TableFiltersProps {
  fields: FilterField[];
  onClearFilters?: () => void;
  onRefresh?: () => void;
  isFetching?: boolean;
  hasActiveFilters?: boolean;

  // Card wrapper
  title?: string | ReactNode;
  description?: string | ReactNode;
  showCard?: boolean;

  // Layout
  gridColumns?: string; // e.g., "grid-cols-1 md:grid-cols-4"
  className?: string;
  layout?: 'grid' | 'flex';
}

export function TableFilters({
  fields,
  onClearFilters,
  onRefresh,
  isFetching = false,
  hasActiveFilters = false,
  title = (
    <>
      <Filter className="h-5 w-5" />
      Filters
    </>
  ),
  description = 'Filter and search your data',
  showCard = true,
  gridColumns = 'grid-cols-1 md:grid-cols-4',
  className = '',
  layout = 'grid',
}: TableFiltersProps) {
  const renderField = (field: FilterField) => {
    const baseClassName = `${field.className || ''} ${layout === 'flex' ? 'w-full' : ''}`;

    switch (field.type) {
      case 'search':
        return (
          <div className={`relative ${baseClassName}`}>
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={field.placeholder || 'Search...'}
              value={field.value || ''}
              onChange={e => field.onChange(e.target.value)}
              className="pl-9"
            />
          </div>
        );

      case 'select':
        return (
          <Select value={field.value || 'all'} onValueChange={field.onChange}>
            <SelectTrigger className={baseClassName}>
              <SelectValue placeholder={field.placeholder || 'Select option'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All {field.label?.toLowerCase() || 'options'}</SelectItem>
              {field.options?.map(option => (
                <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'date-range':
        return (
          <div className={baseClassName}>
            <DatePicker
              dateRange={field.value}
              onDateRangeChange={field.onChange}
              placeholder={field.placeholder || 'Select date range'}
              mode="range"
              showPresets
            />
          </div>
        );

      case 'custom':
        return <div className={baseClassName}>{field.render?.()}</div>;

      default:
        return null;
    }
  };

  const filtersContent = (
    <div
      className={`${
        layout === 'grid' ? `grid ${gridColumns}` : 'flex flex-wrap items-center'
      } gap-4 ${className}`}
    >
      {fields.map(field => (
        <div key={field.key} className={layout === 'flex' ? 'min-w-[150px]' : undefined}>
          {renderField(field)}
        </div>
      ))}

      {/* Clear filters button */}
      {hasActiveFilters && onClearFilters && (
        <Button variant="outline" size="sm" onClick={onClearFilters} className="h-9 gap-2">
          <XCircle className="h-4 w-4" />
          Reset filters
        </Button>
      )}

      {/* Refresh button */}
      {onRefresh && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isFetching}
          className="h-9 ml-auto"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      )}
    </div>
  );

  if (!showCard) {
    return filtersContent;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent>{filtersContent}</CardContent>
    </Card>
  );
}

// Helper function to create common filter fields
export const createSearchFilter = (
  key: string,
  value: string,
  onChange: (value: string) => void,
  placeholder = 'Search...',
): FilterField => ({
  key,
  type: 'search',
  value,
  onChange,
  placeholder,
});

export const createSelectFilter = (
  key: string,
  value: string | undefined,
  onChange: (value: string) => void,
  options: FilterOption[],
  label?: string,
  placeholder?: string,
): FilterField => ({
  key,
  type: 'select',
  value,
  onChange,
  options,
  label,
  placeholder,
});

export const createDateRangeFilter = (
  key: string,
  value: DateRange | undefined,
  onChange: (value: DateRange | undefined) => void,
  placeholder = 'Select date range',
): FilterField => ({
  key,
  type: 'date-range',
  value,
  onChange,
  placeholder,
});

export const createCustomFilter = (
  key: string,
  render: () => ReactNode,
  className?: string,
): FilterField => ({
  key,
  type: 'custom',
  render,
  className,
  onChange: () => undefined,
});
