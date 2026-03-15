import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export type CurrencyCode = 'UAH' | 'HUF' | 'EUR' | 'USD';

const SUPPORTED_CURRENCIES: readonly CurrencyCode[] = ['UAH', 'HUF', 'EUR', 'USD'] as const;

export const BASE_CURRENCY: CurrencyCode = 'EUR';

const CURRENCY_STORAGE_KEY = 'bit_chain_base_currency';

interface CurrencyState {
  baseCurrency: CurrencyCode;
  availableCurrencies: readonly CurrencyCode[];
  setBaseCurrency: (code: CurrencyCode) => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useCurrencyStore = create<CurrencyState>(set => ({
  baseCurrency: BASE_CURRENCY,
  availableCurrencies: SUPPORTED_CURRENCIES,

  setBaseCurrency: async code => {
    set({ baseCurrency: code });
    try {
      await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, code);
    } catch (err) {
      if (__DEV__) {
        console.warn('[Currency] Failed to persist base currency:', err);
      }
    }
  },

  hydrate: async () => {
    try {
      const stored = (await AsyncStorage.getItem(CURRENCY_STORAGE_KEY)) as CurrencyCode | null;
      if (stored && SUPPORTED_CURRENCIES.includes(stored)) {
        set({ baseCurrency: stored });
      }
    } catch (err) {
      if (__DEV__) {
        console.warn('[Currency] Failed to hydrate base currency:', err);
      }
    }
  },
}));

export interface ExchangeRate {
  base: CurrencyCode;
  rates: Record<string, number>;
  timestamp: number;
}

function isCurrencyCode(code: unknown): code is CurrencyCode {
  return typeof code === 'string' && SUPPORTED_CURRENCIES.some(currency => currency === code);
}

function isRatesPayload(
  value: unknown,
): value is { base?: string; rates?: Record<string, number> } {
  if (typeof value !== 'object' || value === null) return false;
  if (!('rates' in value)) return false;

  const ratesValue = value.rates;
  if (typeof ratesValue !== 'object' || ratesValue === null) return false;

  return Object.values(ratesValue).every(rate => typeof rate === 'number');
}

/** Fallback rates when API fails. rates[X] = units of X per 1 EUR. */
const FALLBACK_RATES: Record<string, number> = {
  EUR: 1,
  USD: 1.15,
  UAH: 50.67,
  HUF: 391.95,
  GBP: 0.864,
  PLN: 4.27,
};

let cachedRates: ExchangeRate | null = null;
let lastFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getExchangeRates(force = false): Promise<ExchangeRate> {
  const now = Date.now();

  if (!force && cachedRates && now - lastFetch < CACHE_DURATION) {
    return cachedRates;
  }

  try {
    const apis = [
      `https://api.exchangerate-api.com/v4/latest/${BASE_CURRENCY}`,
      `https://open.er-api.com/v6/latest/${BASE_CURRENCY}`,
    ];

    let response: Response | undefined;
    let data: unknown;

    for (const apiUrl of apis) {
      try {
        response = await fetch(apiUrl, {
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          data = await response.json();
          break;
        }
      } catch {
        // Try next API
        continue;
      }
    }

    if (!data || !response?.ok) {
      throw new Error('All exchange rate APIs failed');
    }

    if (!isRatesPayload(data)) {
      throw new Error('Invalid exchange rates payload');
    }

    const baseCurrency = isCurrencyCode(data.base) ? data.base : BASE_CURRENCY;
    const apiRates = data.rates ?? {};
    const rates = { ...FALLBACK_RATES, ...apiRates };

    cachedRates = {
      base: baseCurrency,
      rates,
      timestamp: now,
    };
    lastFetch = now;
    return cachedRates;
  } catch {
    if (__DEV__) {
      console.warn('[Currency] Using fallback rates (API unavailable)');
    }
    cachedRates = {
      base: BASE_CURRENCY,
      rates: { ...FALLBACK_RATES },
      timestamp: now,
    };
    lastFetch = now;
    return cachedRates;
  }
}

export async function convertToBaseCurrency(amount: number, fromCurrency: string): Promise<number> {
  if (fromCurrency === BASE_CURRENCY) {
    return amount;
  }

  const rates = await getExchangeRates();
  const rate = rates.rates[fromCurrency] ?? FALLBACK_RATES[fromCurrency];

  if (!rate || rate <= 0) {
    if (__DEV__) {
      console.warn(`[Currency] No rate for ${fromCurrency}, using 1:1`);
    }
    return amount;
  }

  return amount / rate;
}

export async function convertFromBaseCurrency(
  amount: number,
  toCurrency: CurrencyCode,
): Promise<number> {
  if (toCurrency === BASE_CURRENCY) {
    return amount;
  }

  const rates = await getExchangeRates();
  const rate = rates.rates[toCurrency] ?? FALLBACK_RATES[toCurrency];

  if (!rate || rate <= 0) {
    if (__DEV__) {
      console.warn(`[Currency] No rate for ${toCurrency}, using 1:1`);
    }
    return amount;
  }

  return amount * rate;
}

export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: CurrencyCode,
): Promise<number> {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const amountInBase = await convertToBaseCurrency(amount, fromCurrency);
  return convertFromBaseCurrency(amountInBase, toCurrency);
}
