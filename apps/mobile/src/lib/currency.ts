import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export type CurrencyCode = 'UAH' | 'HUF' | 'EUR' | 'USD';

const SUPPORTED_CURRENCIES: readonly CurrencyCode[] = ['UAH', 'HUF', 'EUR', 'USD'] as const;

export const BASE_CURRENCY: CurrencyCode = 'EUR';

const CURRENCY_STORAGE_KEY = 'bit_chain_base_currency';

interface CurrencyState {
  baseCurrency: CurrencyCode;
  /** All currencies that can be selected in settings. */
  availableCurrencies: readonly CurrencyCode[];
  /** Update base currency and persist to AsyncStorage. */
  setBaseCurrency: (code: CurrencyCode) => Promise<void>;
  /** Hydrate base currency from AsyncStorage on app start. */
  hydrate: () => Promise<void>;
}

export const useCurrencyStore = create<CurrencyState>(set => ({
  baseCurrency: 'UAH',
  availableCurrencies: SUPPORTED_CURRENCIES,

  setBaseCurrency: async code => {
    set({ baseCurrency: code });
    try {
      await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, code);
    } catch {
      // Ignore storage errors — state is still updated in memory
    }
  },

  hydrate: async () => {
    try {
      const stored = (await AsyncStorage.getItem(CURRENCY_STORAGE_KEY)) as CurrencyCode | null;
      if (stored && SUPPORTED_CURRENCIES.includes(stored)) {
        set({ baseCurrency: stored });
      }
    } catch {
      // Ignore — fallback to default UAH
    }
  },
}));

export interface ExchangeRate {
  base: CurrencyCode;
  rates: Record<string, number>;
  timestamp: number;
}

let cachedRates: ExchangeRate | null = null;
let lastFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches FX rates using the same public APIs and semantics as the web app.
 * Base currency is EUR; rates map is compatible with apps/web `currencyService`.
 */
export async function getExchangeRates(force = false): Promise<ExchangeRate> {
  const now = Date.now();

  if (!force && cachedRates && now - lastFetch < CACHE_DURATION) {
    return cachedRates;
  }

  try {
    const apis = [
      // ExchangeRate-API (free, no API key required)
      `https://api.exchangerate-api.com/v4/latest/${BASE_CURRENCY}`,
      // Alternative free API
      `https://open.er-api.com/v6/latest/${BASE_CURRENCY}`,
    ];

    let response: Response | undefined;
    let data: any;

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

    cachedRates = {
      base: (data.base as CurrencyCode | undefined) ?? BASE_CURRENCY,
      rates: data.rates ?? {},
      timestamp: now,
    };
    lastFetch = now;
    return cachedRates;
  } catch {
    // Ultimate fallback with current approximate rates (kept in sync with web)
    cachedRates = {
      base: BASE_CURRENCY,
      rates: {
        EUR: 1,
        USD: 1.09, // 1 EUR = 1.09 USD
        UAH: 44.5, // 1 EUR = 44.5 UAH
        HUF: 395, // 1 EUR = 395 HUF
      },
      timestamp: now,
    };
    lastFetch = now;
    return cachedRates;
  }
}

/**
 * Converts an amount from `fromCurrency` into the shared base currency (EUR),
 * using the same rate semantics as the web `currencyService`.
 */
export async function convertToBaseCurrency(amount: number, fromCurrency: string): Promise<number> {
  if (fromCurrency === BASE_CURRENCY) {
    return amount;
  }

  const rates = await getExchangeRates();
  const rate = rates.rates[fromCurrency];

  if (!rate) {
    // No rate available — fall back to 1:1 to avoid NaN
    return amount;
  }

  // API returns how many units of `fromCurrency` one EUR buys,
  // so to convert X fromCurrency → EUR we divide by the rate.
  return amount / rate;
}

/**
 * Converts an amount from the shared base currency (EUR) into `toCurrency`.
 */
export async function convertFromBaseCurrency(
  amount: number,
  toCurrency: CurrencyCode,
): Promise<number> {
  if (toCurrency === BASE_CURRENCY) {
    return amount;
  }

  const rates = await getExchangeRates();
  const rate = rates.rates[toCurrency];

  if (!rate) {
    return amount;
  }

  // EUR → target currency
  return amount * rate;
}

/**
 * Converts an amount between arbitrary currencies via the base currency (EUR).
 */
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
