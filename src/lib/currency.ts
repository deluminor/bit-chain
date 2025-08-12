// Currency conversion and exchange rate service
import { formatLargeNumber } from './utils';

export interface ExchangeRate {
  base: string;
  rates: Record<string, number>;
  timestamp: number;
}

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  decimals: number;
}

// Supported currencies with their symbols and details
export const SUPPORTED_CURRENCIES: Record<string, CurrencyInfo> = {
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', decimals: 2 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', decimals: 2 },
  UAH: { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia', decimals: 2 },
  HUF: { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint', decimals: 0 },
};

// Base currency for the application (all balances will be shown in EUR)
export const BASE_CURRENCY = 'EUR';

class CurrencyService {
  private exchangeRates: ExchangeRate | null = null;
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async getExchangeRates(force = false): Promise<ExchangeRate> {
    const now = Date.now();

    if (!force && this.exchangeRates && now - this.lastFetch < this.CACHE_DURATION) {
      return this.exchangeRates;
    }

    try {
      // Try multiple free exchange rate APIs for reliability
      const apis = [
        // ExchangeRate-API (free, no API key required)
        `https://api.exchangerate-api.com/v4/latest/${BASE_CURRENCY}`,
        // Currencylayer free tier (1000 requests/month)
        `http://api.currencylayer.com/live?access_key=YOUR_API_KEY&source=${BASE_CURRENCY}`,
        // Alternative free API
        `https://open.er-api.com/v6/latest/${BASE_CURRENCY}`,
      ];

      let response;
      let data;

      // Try each API until one works
      for (const apiUrl of apis) {
        try {
          // Skip APIs that require API keys for now (can be configured later)
          if (apiUrl.includes('YOUR_API_KEY')) continue;

          response = await fetch(apiUrl, {
            cache: 'no-cache',
            headers: {
              Accept: 'application/json',
            },
          });

          if (response.ok) {
            data = await response.json();
            break;
          }
        } catch (apiError) {
          console.warn(`API ${apiUrl} failed:`, apiError);
          continue;
        }
      }

      if (!data || !response?.ok) {
        throw new Error('All exchange rate APIs failed');
      }

      this.exchangeRates = {
        base: data.base || BASE_CURRENCY,
        rates: data.rates || {},
        timestamp: now,
      };

      this.lastFetch = now;
      console.log(
        '✅ Exchange rates updated successfully:',
        Object.keys(this.exchangeRates.rates).length,
        'currencies',
      );
      return this.exchangeRates;
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);

      // Fallback to cached rates if available
      if (this.exchangeRates) {
        console.warn('Using cached exchange rates');
        return this.exchangeRates;
      }

      // Ultimate fallback with current approximate rates (updated August 2025)
      console.warn('Using fallback exchange rates');
      return {
        base: BASE_CURRENCY,
        rates: {
          EUR: 1,
          USD: 1.09, // 1 EUR = 1.09 USD
          UAH: 44.5, // 1 EUR = 44.5 UAH
          HUF: 395, // 1 EUR = 395 HUF
        },
        timestamp: now,
      };
    }
  }

  async convertToBaseCurrency(amount: number, fromCurrency: string): Promise<number> {
    if (fromCurrency === BASE_CURRENCY) {
      return amount;
    }

    const rates = await this.getExchangeRates();
    const rate = rates.rates[fromCurrency];

    if (!rate) {
      console.warn(`Exchange rate not found for ${fromCurrency}, using 1:1 conversion`);
      return amount;
    }

    // Convert from currency to EUR
    return amount / rate;
  }

  async convertFromBaseCurrency(amount: number, toCurrency: string): Promise<number> {
    if (toCurrency === BASE_CURRENCY) {
      return amount;
    }

    const rates = await this.getExchangeRates();
    const rate = rates.rates[toCurrency];

    if (!rate) {
      console.warn(`Exchange rate not found for ${toCurrency}, using 1:1 conversion`);
      return amount;
    }

    // Convert from EUR to target currency
    return amount * rate;
  }

  async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    // Convert to base currency first, then to target currency
    const amountInBase = await this.convertToBaseCurrency(amount, fromCurrency);
    return this.convertFromBaseCurrency(amountInBase, toCurrency);
  }

  getCurrencyInfo(currencyCode: string): CurrencyInfo {
    return (
      SUPPORTED_CURRENCIES[currencyCode] || {
        code: currencyCode,
        symbol: currencyCode,
        name: currencyCode,
        decimals: 2,
      }
    );
  }

  formatCurrency(
    amount: number,
    currency: string = BASE_CURRENCY,
    options: {
      useLargeNumberFormat?: boolean;
      showSymbol?: boolean;
      showCode?: boolean;
    } = {},
  ): string {
    const { useLargeNumberFormat = true, showSymbol = true, showCode = false } = options;
    const currencyInfo = this.getCurrencyInfo(currency);

    let result = '';

    if (useLargeNumberFormat && Math.abs(amount) >= 1000) {
      // Use formatLargeNumber with proper currency symbol
      result = formatLargeNumber(amount, showSymbol ? currencyInfo.symbol : '');
    } else {
      // Format with proper decimals for the currency
      const formattedAmount = amount.toLocaleString('en-US', {
        minimumFractionDigits: currencyInfo.decimals,
        maximumFractionDigits: currencyInfo.decimals,
      });

      if (showSymbol) {
        result += currencyInfo.symbol;
      }
      result += formattedAmount;
    }

    if (showCode) {
      result += ` ${currencyInfo.code}`;
    }

    return result;
  }

  // New method specifically for EUR display with 1,000.00 format
  formatEuroAmount(amount: number, options: { showSymbol?: boolean } = {}): string {
    const { showSymbol = true } = options;
    const currencyInfo = this.getCurrencyInfo(BASE_CURRENCY);

    // Always format as standard 1,000.00 format for EUR
    const formattedAmount = amount.toLocaleString('en-US', {
      minimumFractionDigits: currencyInfo.decimals,
      maximumFractionDigits: currencyInfo.decimals,
    });

    return showSymbol ? `${currencyInfo.symbol}${formattedAmount}` : formattedAmount;
  }

  // New method for display amounts with proper formatting
  formatDisplayAmount(
    amount: number,
    currency: string = BASE_CURRENCY,
    context: 'summary' | 'detailed' = 'summary',
  ): string {
    const currencyInfo = this.getCurrencyInfo(currency);

    if (context === 'summary') {
      // For summary stats, always use standard format for EUR
      if (currency === BASE_CURRENCY) {
        return this.formatEuroAmount(amount);
      }
      // For other currencies in summary, still convert to standard format
      return `${currencyInfo.symbol}${amount.toLocaleString('en-US', {
        minimumFractionDigits: currencyInfo.decimals,
        maximumFractionDigits: currencyInfo.decimals,
      })}`;
    }

    // For detailed view, use the regular formatting with K/M/B for large amounts
    return this.formatCurrency(amount, currency, { useLargeNumberFormat: true });
  }
}

export const currencyService = new CurrencyService();

// Enhanced formatting utilities
export function formatCurrency(
  amount: number,
  currency: string = BASE_CURRENCY,
  options?: {
    useLargeNumberFormat?: boolean;
    showSymbol?: boolean;
    showCode?: boolean;
  },
): string {
  return currencyService.formatCurrency(amount, currency, options);
}

export function formatBalance(amount: number, currency: string = BASE_CURRENCY): string {
  return formatCurrency(amount, currency, { useLargeNumberFormat: true });
}

// New utility functions for consistent formatting
export function formatEuroAmount(amount: number, options?: { showSymbol?: boolean }): string {
  return currencyService.formatEuroAmount(amount, options);
}

export function formatDisplayAmount(
  amount: number,
  currency: string = BASE_CURRENCY,
  context: 'summary' | 'detailed' = 'summary',
): string {
  return currencyService.formatDisplayAmount(amount, currency, context);
}

export function formatSummaryAmount(amount: number): string {
  return currencyService.formatEuroAmount(amount);
}

export function parseNumberInput(input: string): number {
  if (!input || input.trim() === '') return 0;

  // Handle various number formats (commas, spaces, etc.)
  let cleaned = input.trim();

  // Handle negative sign at the beginning
  const isNegative = cleaned.startsWith('-');
  if (isNegative) {
    cleaned = cleaned.substring(1);
  }

  // Remove all non-numeric chars except decimals
  cleaned = cleaned
    .replace(/[^\d.,]/g, '') // Remove all non-numeric chars except decimals
    .replace(/,/g, '.') // Convert commas to dots for decimal
    .replace(/\.(?=.*\.)/g, ''); // Remove all dots except the last one

  const parsed = parseFloat(cleaned);
  const result = isNaN(parsed) ? 0 : parsed;

  return isNegative ? -result : result;
}

export function validateCurrencyInput(
  input: string,
  currency: string,
  options: { allowNegative?: boolean; allowZero?: boolean } = {},
): { isValid: boolean; value: number; error?: string } {
  const { allowNegative = false, allowZero = false } = options;

  if (!input.trim()) {
    return { isValid: false, value: 0, error: 'Amount is required' };
  }

  const value = parseNumberInput(input);
  const currencyInfo = currencyService.getCurrencyInfo(currency);

  if (isNaN(value)) {
    return { isValid: false, value: 0, error: 'Please enter a valid number' };
  }

  if (!allowNegative && value < 0) {
    return { isValid: false, value: 0, error: 'Please enter a positive number' };
  }

  if (!allowZero && value === 0) {
    return { isValid: false, value: 0, error: 'Amount must be greater than 0' };
  }

  // Check if the number has too many decimal places for the currency
  const decimalPlaces = (input.split('.')[1] || '').length;
  if (decimalPlaces > currencyInfo.decimals) {
    return {
      isValid: false,
      value: 0,
      error: `${currencyInfo.name} supports maximum ${currencyInfo.decimals} decimal places`,
    };
  }

  return { isValid: true, value };
}

// Hook for currency conversion
export function useCurrencyConverter() {
  const convertToBase = async (amount: number, fromCurrency: string) => {
    return currencyService.convertToBaseCurrency(amount, fromCurrency);
  };

  const convertFromBase = async (amount: number, toCurrency: string) => {
    return currencyService.convertFromBaseCurrency(amount, toCurrency);
  };

  const convert = async (amount: number, fromCurrency: string, toCurrency: string) => {
    return currencyService.convertCurrency(amount, fromCurrency, toCurrency);
  };

  return {
    convertToBase,
    convertFromBase,
    convert,
    formatCurrency,
    formatBalance,
    getCurrencyInfo: currencyService.getCurrencyInfo.bind(currencyService),
  };
}
