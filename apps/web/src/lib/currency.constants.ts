import type { CurrencyInfo } from './currency.types';

export const BASE_CURRENCY = 'EUR';

export const SUPPORTED_CURRENCIES: Record<string, CurrencyInfo> = {
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', decimals: 2 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', decimals: 2 },
  UAH: { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia', decimals: 2 },
  HUF: { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint', decimals: 0 },
};

export const FALLBACK_RATES: Record<string, number> = {
  USD: 0.9,
  UAH: 0.025,
  GBP: 1.15,
  PLN: 0.23,
  CZK: 0.04,
  CHF: 1.05,
  CAD: 0.68,
  JPY: 0.0062,
  HUF: 0.0027,
};

export const FALLBACK_EXCHANGE_RATES: Record<string, number> = {
  EUR: 1,
  USD: 1.09,
  UAH: 44.5,
  HUF: 395,
};
