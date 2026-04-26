import { endOfMonth, endOfYear, startOfMonth, startOfYear, subMonths, subYears } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum THEME {
  LIGHT = 'light',
  DARK = 'dark',
}

export type DatePreset =
  | 'this_month'
  | 'last_month'
  | 'this_year'
  | 'last_year'
  | 'all_time'
  | 'custom';

export const DATE_PRESET_LABELS: Record<DatePreset, string> = {
  this_month: 'This Month',
  last_month: 'Last Month',
  this_year: 'This Year',
  last_year: 'Last Year',
  all_time: 'All Time',
  custom: 'Custom',
};

export function getDateRangeFromPreset(preset: DatePreset): DateRange | undefined {
  const now = new Date();

  switch (preset) {
    case 'this_month':
      return {
        from: startOfMonth(now),
        to: endOfMonth(now),
      };
    case 'last_month': {
      const lastMonth = subMonths(now, 1);
      return {
        from: startOfMonth(lastMonth),
        to: endOfMonth(lastMonth),
      };
    }
    case 'this_year':
      return {
        from: startOfYear(now),
        to: now,
      };
    case 'last_year': {
      const lastYear = subYears(now, 1);
      return {
        from: startOfYear(lastYear),
        to: endOfYear(lastYear),
      };
    }
    case 'all_time':
      return undefined;
    case 'custom':
      return undefined; // Custom is handled separately
    default:
      return undefined;
  }
}

const DEFAULT_TRADE_FILTERS = {
  tradeFilters: {
    side: undefined,
    category: undefined,
    result: undefined,
  },
};

const DEFAULT_DATE_PRESET: DatePreset = 'this_month';

interface SerializedDateRange {
  from?: string;
  to?: string;
}

interface State {
  theme: THEME;
  isNavigationOpen: boolean;
  globalDatePreset: DatePreset;
  selectedDateRange?: DateRange;
  tradeFilters: {
    side?: string;
    category?: string;
    result?: string;
  };

  // Actions
  setTheme: (theme: THEME) => void;
  toggleNavigation: () => void;
  setNavigationOpen: (isOpen: boolean) => void;
  setGlobalDatePreset: (preset: DatePreset) => void;
  setSelectedDateRange: (dateRange?: DateRange) => void;
  setCustomDateRange: (dateRange: DateRange | undefined) => void;
  setTradeFilters: (filters: Partial<State['tradeFilters']>) => void;
  resetTradeFilters: () => void;
}

export const useStore = create<State>()(
  persist(
    set => ({
      theme: THEME.DARK,
      isNavigationOpen: true,
      globalDatePreset: DEFAULT_DATE_PRESET,
      selectedDateRange: getDateRangeFromPreset(DEFAULT_DATE_PRESET),
      ...DEFAULT_TRADE_FILTERS,

      // Actions
      setTheme: theme => set({ theme }),
      toggleNavigation: () => set(state => ({ isNavigationOpen: !state.isNavigationOpen })),
      setNavigationOpen: isOpen => set({ isNavigationOpen: isOpen }),
      setGlobalDatePreset: preset =>
        set({
          globalDatePreset: preset,
          selectedDateRange: getDateRangeFromPreset(preset),
        }),
      setSelectedDateRange: dateRange => set({ selectedDateRange: dateRange }),
      setCustomDateRange: dateRange =>
        set({
          globalDatePreset: 'custom',
          selectedDateRange: dateRange,
        }),
      setTradeFilters: filters =>
        set(state => ({
          tradeFilters: { ...state.tradeFilters, ...filters },
        })),
      resetTradeFilters: () => set({ ...DEFAULT_TRADE_FILTERS }),
    }),
    {
      name: 'bitchain-storage',
      partialize: state => ({
        theme: state.theme,
        isNavigationOpen: state.isNavigationOpen,
        globalDatePreset: state.globalDatePreset,
        // Serialize dates for localStorage
        customDateRange:
          state.globalDatePreset === 'custom' && state.selectedDateRange
            ? {
                from: state.selectedDateRange.from?.toISOString(),
                to: state.selectedDateRange.to?.toISOString(),
              }
            : undefined,
        tradeFilters: state.tradeFilters,
      }),
      // Deserialize dates from localStorage
      onRehydrateStorage: () => state => {
        if (state) {
          // Restore date range based on preset or custom dates
          if (state.globalDatePreset === 'custom') {
            const stored = (state as unknown as { customDateRange?: SerializedDateRange })
              .customDateRange;
            if (stored) {
              state.selectedDateRange = {
                from: stored.from ? new Date(stored.from) : undefined,
                to: stored.to ? new Date(stored.to) : undefined,
              };
            }
          } else {
            state.selectedDateRange = getDateRangeFromPreset(state.globalDatePreset);
          }
        }
      },
    },
  ),
);
