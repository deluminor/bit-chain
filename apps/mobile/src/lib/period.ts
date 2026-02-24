import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export type PeriodKey = 'week' | 'month' | '3months' | 'year' | 'all';

export interface PeriodOption {
  key: PeriodKey;
  label: string;
  short: string;
}

export const PERIOD_OPTIONS: ReadonlyArray<PeriodOption> = [
  { key: 'week', label: 'This week', short: 'Week' },
  { key: 'month', label: 'This month', short: 'Month' },
  { key: '3months', label: 'Last 3 months', short: '3M' },
  { key: 'year', label: 'Last year', short: 'Year' },
  { key: 'all', label: 'All time', short: 'All' },
];

export interface DateRange {
  dateFrom?: string;
  dateTo?: string;
}

function startOfWeekMonday(d: Date): Date {
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day;
  const r = new Date(d);
  r.setDate(d.getDate() + diff);
  r.setHours(0, 0, 0, 0);
  return r;
}

function startOfMonth(d: Date): Date {
  const r = new Date(d.getFullYear(), d.getMonth(), 1);
  r.setHours(0, 0, 0, 0);
  return r;
}

function endOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(23, 59, 59, 999);
  return r;
}

function subMonths(d: Date, n: number): Date {
  const r = new Date(d);
  r.setMonth(r.getMonth() - n);
  r.setDate(1);
  r.setHours(0, 0, 0, 0);
  return r;
}

function subYears(d: Date, n: number): Date {
  const r = new Date(d);
  r.setFullYear(r.getFullYear() - n);
  return r;
}

const SHORT_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function fmtShort(d: Date): string {
  return `${SHORT_MONTHS[d.getMonth()]} ${d.getDate()}`;
}

/**
 * Returns ISO date strings for the given period key.
 * `dateFrom` is undefined for 'all'.
 */
export function getPeriodRange(key: PeriodKey): DateRange {
  const now = new Date();
  const end = endOfDay(now).toISOString();

  switch (key) {
    case 'week':
      return { dateFrom: startOfWeekMonday(now).toISOString(), dateTo: end };
    case 'month':
      return { dateFrom: startOfMonth(now).toISOString(), dateTo: end };
    case '3months':
      return { dateFrom: subMonths(now, 3).toISOString(), dateTo: end };
    case 'year':
      return { dateFrom: subYears(now, 1).toISOString(), dateTo: end };
    case 'all':
    default:
      return {};
  }
}

/**
 * Returns a human-readable label like "Jan 1 – Feb 23" or "All time".
 */
export function getPeriodLabel(key: PeriodKey): string {
  if (key === 'all') return 'All time';
  const { dateFrom, dateTo } = getPeriodRange(key);
  const from = dateFrom ? fmtShort(new Date(dateFrom)) : '–';
  const to = dateTo ? fmtShort(new Date(dateTo)) : 'today';
  return `${from} – ${to}`;
}

const PERIOD_STORAGE_KEY = 'bit_chain_period';

interface PeriodState {
  period: PeriodKey;
  setPeriod: (key: PeriodKey) => Promise<void>;
  hydrate: () => Promise<void>;
}

export const usePeriodStore = create<PeriodState>(set => ({
  period: 'month',

  setPeriod: async key => {
    set({ period: key });
    try {
      await AsyncStorage.setItem(PERIOD_STORAGE_KEY, key);
    } catch {
      /* ignore */
    }
  },

  hydrate: async () => {
    try {
      const stored = (await AsyncStorage.getItem(PERIOD_STORAGE_KEY)) as PeriodKey | null;
      if (stored && PERIOD_OPTIONS.some(o => o.key === stored)) {
        set({ period: stored });
      }
    } catch {
      /* ignore */
    }
  },
}));
