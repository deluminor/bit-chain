import { BASE_CURRENCY } from './currency.constants';
import { currencyService } from './currency.service';
import type { CurrencyDisplayContext, CurrencyFormatOptions } from './currency.types';

export function formatCurrency(
  amount: number,
  currency: string = BASE_CURRENCY,
  options?: CurrencyFormatOptions,
): string {
  return currencyService.formatCurrency(amount, currency, options);
}

export function formatBalance(amount: number, currency: string = BASE_CURRENCY): string {
  return formatCurrency(amount, currency, { useLargeNumberFormat: true });
}

export function formatEuroAmount(amount: number, options?: { showSymbol?: boolean }): string {
  return currencyService.formatEuroAmount(amount, options);
}

export function formatDisplayAmount(
  amount: number,
  currency: string = BASE_CURRENCY,
  context: CurrencyDisplayContext = 'summary',
): string {
  return currencyService.formatDisplayAmount(amount, currency, context);
}

export function formatSummaryAmount(amount: number): string {
  const currencyInfo = currencyService.getCurrencyInfo(BASE_CURRENCY);
  const formattedAmount = amount.toLocaleString('en-US', {
    minimumFractionDigits: currencyInfo.decimals,
    maximumFractionDigits: currencyInfo.decimals,
  });

  return `${currencyInfo.symbol} ${formattedAmount}`;
}
