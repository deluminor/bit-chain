'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { addDays, endOfMonth, format, startOfMonth, startOfYear, subMonths } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

export interface DatePickerProps {
  date?: Date;
  dateRange?: DateRange;
  onDateChange?: (date: Date | undefined) => void;
  onDateRangeChange?: (range: DateRange | undefined) => void;
  align?: 'start' | 'center' | 'end';
  className?: string;
  showPresets?: boolean;
  placeholder?: string;
  mode?: 'single' | 'range';
}

export function DatePicker({
  date,
  dateRange,
  onDateChange,
  onDateRangeChange,
  align = 'start',
  className,
  showPresets = false,
  placeholder = 'Select date',
  mode = 'single',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(dateRange);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date);

  // Update local state when props change
  useEffect(() => {
    setSelectedRange(dateRange);
  }, [dateRange]);

  useEffect(() => {
    setSelectedDate(date);
  }, [date]);

  // Format date display text
  const formatDateDisplay = () => {
    if (mode === 'range') {
      if (selectedRange?.from && selectedRange?.to) {
        return `${format(selectedRange.from, 'dd.MM.yyyy')} - ${format(selectedRange.to, 'dd.MM.yyyy')}`;
      }
      if (selectedRange?.from) {
        return `From ${format(selectedRange.from, 'dd.MM.yyyy')}`;
      }
      if (selectedRange?.to) {
        return `Until ${format(selectedRange.to, 'dd.MM.yyyy')}`;
      }
    } else {
      if (selectedDate) {
        return format(selectedDate, 'dd.MM.yyyy');
      }
    }
    return placeholder;
  };

  // Quick date range selection handlers
  const handleCurrentMonth = () => {
    const today = new Date();
    if (mode === 'range' && onDateRangeChange) {
      const range = {
        from: startOfMonth(today),
        to: endOfMonth(today),
      };
      setSelectedRange(range);
      onDateRangeChange(range);
    } else if (mode === 'single' && onDateChange) {
      setSelectedDate(today);
      onDateChange(today);
    }
  };

  const handlePreviousMonth = () => {
    const today = new Date();
    const prevMonth = subMonths(today, 1);
    if (mode === 'range' && onDateRangeChange) {
      const range = {
        from: startOfMonth(prevMonth),
        to: endOfMonth(prevMonth),
      };
      setSelectedRange(range);
      onDateRangeChange(range);
    } else if (mode === 'single' && onDateChange) {
      setSelectedDate(prevMonth);
      onDateChange(prevMonth);
    }
  };

  const handleCurrentYear = () => {
    const today = new Date();
    if (mode === 'range' && onDateRangeChange) {
      const range = {
        from: startOfYear(today),
        to: today,
      };
      setSelectedRange(range);
      onDateRangeChange(range);
    } else if (mode === 'single' && onDateChange) {
      setSelectedDate(today);
      onDateChange(today);
    }
  };

  const handleAllTime = () => {
    if (mode === 'range' && onDateRangeChange) {
      setSelectedRange(undefined);
      onDateRangeChange(undefined);
    } else if (mode === 'single' && onDateChange) {
      setSelectedDate(undefined);
      onDateChange(undefined);
    }
  };

  const handleLastWeek = () => {
    const today = new Date();
    if (mode === 'range' && onDateRangeChange) {
      const range = {
        from: addDays(today, -7),
        to: today,
      };
      setSelectedRange(range);
      onDateRangeChange(range);
    } else if (mode === 'single' && onDateChange) {
      setSelectedDate(addDays(today, -7));
      onDateChange(addDays(today, -7));
    }
  };

  // Handle day selection
  const handleSelect = (selected: Date | DateRange | undefined) => {
    if (mode === 'range' && onDateRangeChange) {
      const rangeValue = selected as DateRange;
      setSelectedRange(rangeValue);
      onDateRangeChange(rangeValue);

      // Don't close the popover until a full range is selected
      if (rangeValue?.from && rangeValue?.to) {
        setTimeout(() => setIsOpen(false), 300);
      }
    } else if (mode === 'single' && onDateChange) {
      const dateValue = selected as Date;
      setSelectedDate(dateValue);
      onDateChange(dateValue);
      setTimeout(() => setIsOpen(false), 300);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'h-9 w-full justify-start text-left text-xs border-input dark:bg-input/30 bg-transparent shadow-xs transition-[color,box-shadow] px-3 py-1',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-3 w-3 opacity-70 flex-shrink-0" />
          <span className="truncate">{formatDateDisplay()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-50" align={align}>
        {showPresets && (
          <div className="p-3 border-b dark:border-border/50">
            <div className="grid grid-cols-3 gap-2 mb-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={handleCurrentMonth}
              >
                This Month
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={handlePreviousMonth}
              >
                Last Month
              </Button>
              <Button variant="outline" size="sm" className="text-xs h-8" onClick={handleLastWeek}>
                Last 7 Days
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={handleCurrentYear}
              >
                This Year
              </Button>
              <Button variant="outline" size="sm" className="text-xs h-8" onClick={handleAllTime}>
                All Time
              </Button>
            </div>
          </div>
        )}
        <div className="p-3">
          {/* TODO: fix types */}
          {mode === 'range' ? (
            <Calendar
              mode="range"
              selected={selectedRange}
              onSelect={value => handleSelect(value)}
              numberOfMonths={2}
              className="rounded dark:border-border/50 border"
            />
          ) : (
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={value => handleSelect(value)}
              numberOfMonths={2}
              className="rounded dark:border-border/50 border"
            />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
