'use client';

import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { useState, useEffect } from 'react';
import { DatePreset, DATE_PRESET_LABELS, useStore } from '@/store';
import { useIsClient } from '@/hooks/useIsClient';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const DATE_PRESETS: { preset: DatePreset; label: string }[] = [
  { preset: 'this_month', label: 'This Month' },
  { preset: 'last_month', label: 'Last Month' },
  { preset: 'this_year', label: 'This Year' },
  { preset: 'last_year', label: 'Last Year' },
  { preset: 'all_time', label: 'All Time' },
];

export function GlobalDateFilter() {
  const { globalDatePreset, selectedDateRange, setGlobalDatePreset, setCustomDateRange } =
    useStore();
  const isClient = useIsClient();
  const [isOpen, setIsOpen] = useState(false);
  const [localRange, setLocalRange] = useState<DateRange | undefined>(selectedDateRange);

  // Sync local range with store
  useEffect(() => {
    setLocalRange(selectedDateRange);
  }, [selectedDateRange]);

  if (!isClient) {
    return (
      <Button variant="outline" className="h-9 justify-start text-left" disabled>
        <CalendarIcon className="mr-2 h-4 w-4" />
        <span>Loading...</span>
      </Button>
    );
  }

  const formatDateRangeDisplay = () => {
    if (globalDatePreset === 'all_time' || !selectedDateRange) {
      return 'All Time';
    }
    if (globalDatePreset !== 'custom') {
      return DATE_PRESET_LABELS[globalDatePreset];
    }
    if (selectedDateRange.from && selectedDateRange.to) {
      return `${format(selectedDateRange.from, 'dd.MM.yy')} - ${format(selectedDateRange.to, 'dd.MM.yy')}`;
    }
    if (selectedDateRange.from) {
      return `From ${format(selectedDateRange.from, 'dd.MM.yy')}`;
    }
    return 'Select date range';
  };

  const handlePresetClick = (preset: DatePreset) => {
    setGlobalDatePreset(preset);
    setIsOpen(false);
  };

  const handleCalendarSelect = (range: DateRange | undefined) => {
    setLocalRange(range);
    if (range?.from && range?.to) {
      setCustomDateRange(range);
      // Close popover after selecting full range
      setTimeout(() => setIsOpen(false), 300);
    } else if (range?.from && !range?.to) {
      // Keep popover open for selecting end date
      setCustomDateRange(range);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'h-9 justify-start text-left text-xs font-normal min-w-[180px]',
            'border-input dark:bg-input/30 bg-transparent shadow-xs',
            'hover:bg-accent/50 transition-colors',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
          <span className="truncate">{formatDateRangeDisplay()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" sideOffset={8}>
        {/* Presets */}
        <div className="p-3 border-b border-border/50">
          <div className="grid grid-cols-3 gap-2 mb-2">
            {DATE_PRESETS.slice(0, 3).map(({ preset, label }) => (
              <Button
                key={preset}
                variant={globalDatePreset === preset ? 'default' : 'outline'}
                size="sm"
                className="text-xs h-8"
                onClick={() => handlePresetClick(preset)}
              >
                {label}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {DATE_PRESETS.slice(3).map(({ preset, label }) => (
              <Button
                key={preset}
                variant={globalDatePreset === preset ? 'default' : 'outline'}
                size="sm"
                className="text-xs h-8"
                onClick={() => handlePresetClick(preset)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Calendar for custom selection */}
        <div className="p-3">
          <Calendar
            mode="range"
            selected={localRange}
            onSelect={handleCalendarSelect}
            numberOfMonths={2}
            className="rounded border border-border/50"
            defaultMonth={localRange?.from || new Date()}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
