import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ResetFiltersButton } from '@/features/positions/components/ResetFiltersButton';
import { Loader2, RefreshCw } from 'lucide-react';
import { useCategories } from '../queries/categories';
import { TRADE_RESULTS_LIST, TRADE_SIDES_LIST } from '../types/position';

interface PositionFiltersProps {
  sideFilter: string | undefined;
  categoryFilter: string | undefined;
  resultFilter: string | undefined;
  onResultFilterChange: (value: string) => void;
  onSideFilterChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
  onRefetch?: () => void;
  isFetching?: boolean;
}

const ALL = 'all';

export function PositionFilters({
  sideFilter,
  categoryFilter,
  resultFilter,
  onResultFilterChange,
  onSideFilterChange,
  onCategoryFilterChange,
  onRefetch,
  isFetching = false,
}: PositionFiltersProps) {
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();

  return (
    <div className="flex items-center justify-between w-full gap-4">
      <div className="flex flex-wrap gap-4 w-full md:w-auto">
        <div className="min-w-150px">
          <Select value={sideFilter || ALL} onValueChange={onSideFilterChange}>
            <SelectTrigger className="w-full text-xs h-9">
              <SelectValue placeholder="Select side" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sides</SelectItem>
              {TRADE_SIDES_LIST.map(side => (
                <SelectItem key={side} value={side}>
                  {side.toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-150px">
          <Select value={categoryFilter || ALL} onValueChange={onCategoryFilterChange}>
            <SelectTrigger className="w-full text-xs h-9">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {isCategoriesLoading ? (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Loading...</span>
                </div>
              ) : (
                categories?.map(category => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-150px">
          <Select value={resultFilter || ALL} onValueChange={onResultFilterChange}>
            <SelectTrigger className="w-full text-xs h-9">
              <SelectValue placeholder="Select result" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All results</SelectItem>
              {TRADE_RESULTS_LIST.map(result => (
                <SelectItem key={result} value={result}>
                  {result.toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-150px">
          <ResetFiltersButton />
        </div>
      </div>
      {onRefetch && (
        <Button
          variant="outline"
          size="icon"
          onClick={onRefetch}
          className="h-9 w-9"
          disabled={isFetching}
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-smooth-spin' : ''}`} />
        </Button>
      )}
    </div>
  );
}
