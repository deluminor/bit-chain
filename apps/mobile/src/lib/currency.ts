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

    cachedRates = {
      base: baseCurrency,
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

export async function convertToBaseCurrency(amount: number, fromCurrency: string): Promise<number> {
  if (fromCurrency === BASE_CURRENCY) {
    return amount;
  }

  const rates = await getExchangeRates();
  const rate = rates.rates[fromCurrency];

  if (!rate) {
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
  const rate = rates.rates[toCurrency];

  if (!rate) {
    return amount;
  }

  // EUR → target currency
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
