import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLargeNumber(num: number, currencySymbol: string = '') {
  // if (num >= 1e12) return `${currencySymbol}${(num / 1e12).toFixed(2)}T`;
  // if (num >= 1e9) return `${currencySymbol}${(num / 1e9).toFixed(2)}B`;
  // if (num >= 1e6) return `${currencySymbol}${(num / 1e6).toFixed(2)}M`;
  // if (num >= 1e3) return `${currencySymbol}${(num / 1e3).toFixed(2)}K`;
  // For numbers < 1000, use standard 1,000.00 format instead of just toLocaleString
  return `${currencySymbol}${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
