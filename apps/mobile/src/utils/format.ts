const CURRENCY_SYMBOLS: Readonly<Record<string, string>> = {
  EUR: '€',
  USD: '$',
  UAH: '₴',
  HUF: 'Ft',
  GBP: '£',
  BTC: '₿',
  ETH: 'Ξ',
};

/**
 * Returns the symbol for a given ISO currency code.
 * Falls back to the currency code itself if unknown.
 *
 * @param currency - ISO 4217 currency code (e.g. "EUR")
 */
export function getCurrencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency] ?? currency;
}

/**
 * Formats a number as a localized currency string.
 *
 * @param amount   - Numeric value to format
 * @param currency - ISO 4217 currency code
 * @param options.compact - Abbreviate large numbers (e.g. 1.2k)
 * @param options.signDisplay - Show explicit + sign for positive values
 *
 * @example
 * formatCurrency(2427.53, 'EUR')          // "€ 2,427.53"
 * formatCurrency(1500000, 'UAH', { compact: true }) // "₴1,500.0k"
 */
export function formatCurrency(
  amount: number,
  currency: string,
  options?: { compact?: boolean; signDisplay?: boolean }
): string {
  const symbol = getCurrencySymbol(currency);
  const sign   = options?.signDisplay && amount > 0 ? '+' : '';

  if (options?.compact && Math.abs(amount) >= 1_000) {
    const divided  = amount / 1_000;
    const decimals = Math.abs(divided) >= 100 ? 0 : 1;
    return `${sign}${symbol}${divided.toFixed(decimals)}k`;
  }

  const formatted = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  const prefix = amount < 0 ? '-' : sign;
  return `${prefix}${symbol}${formatted}`;
}

/**
 * Formats an ISO datetime string to a human-readable relative/absolute date.
 * Returns "Today", "Yesterday", or "MMM D" for older dates.
 *
 * @param isoString - ISO 8601 date string
 */
export function formatRelativeDate(isoString: string): string {
  const date     = new Date(isoString);
  const now      = new Date();
  const today    = startOfDay(now);
  const yesterday = new Date(today.getTime() - 86_400_000);
  const dateDay  = startOfDay(date);

  if (dateDay.getTime() === today.getTime())     return 'Today';
  if (dateDay.getTime() === yesterday.getTime()) return 'Yesterday';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
    year:  date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

/**
 * Formats an ISO datetime string as "HH:mm".
 *
 * @param isoString - ISO 8601 date string
 */
export function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour:   '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Formats an ISO datetime string as "DD.MM.YYYY".
 *
 * @param isoString - ISO 8601 date string
 */
export function formatShortDate(isoString: string): string {
  const date = new Date(isoString);
  const dd   = String(date.getDate()).padStart(2, '0');
  const mm   = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

/**
 * Abbreviates large integers (e.g. 12345 → "12.3k").
 *
 * @param value - Number to abbreviate
 */
export function formatCompactNumber(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(1)}k`;
  }
  return String(value);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
