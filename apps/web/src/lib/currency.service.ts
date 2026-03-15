import { BASE_CURRENCY, FALLBACK_EXCHANGE_RATES, SUPPORTED_CURRENCIES } from './currency.constants';
import type {
  CurrencyDisplayContext,
  CurrencyFormatOptions,
  CurrencyInfo,
  ExchangeRate,
} from './currency.types';
import { formatLargeNumber } from './utils';

export class CurrencyService {
  private exchangeRates: ExchangeRate | null = null;
  private lastFetch = 0;
  private readonly cacheDuration = 5 * 60 * 1000;

  async getExchangeRates(force = false): Promise<ExchangeRate> {
    const now = Date.now();

    if (!force && this.exchangeRates && now - this.lastFetch < this.cacheDuration) {
      return this.exchangeRates;
    }

    try {
      const apis = [
        `https://api.exchangerate-api.com/v4/latest/${BASE_CURRENCY}`,
        `https://open.er-api.com/v6/latest/${BASE_CURRENCY}`,
      ];

      let response: Response | undefined;
      let data: { base?: string; rates?: Record<string, number> } | undefined;

      for (const apiUrl of apis) {
        try {
          response = await fetch(apiUrl, {
            cache: 'no-cache',
            headers: { Accept: 'application/json' },
          });

          if (response.ok) {
            data = (await response.json()) as { base?: string; rates?: Record<string, number> };
            break;
          }
        } catch (apiError) {
          console.warn(`API ${apiUrl} failed:`, apiError);
        }
      }

      if (!data || !response?.ok) {
        throw new Error('All exchange rate APIs failed');
      }

      const apiRates = data.rates ?? {};
      this.exchangeRates = {
        base: data.base || BASE_CURRENCY,
        rates: { ...FALLBACK_EXCHANGE_RATES, ...apiRates },
        timestamp: now,
      };
      this.lastFetch = now;

      return this.exchangeRates;
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);

      if (this.exchangeRates) {
        console.warn('Using cached exchange rates');
        return this.exchangeRates;
      }

      console.warn('Using fallback exchange rates');
      return {
        base: BASE_CURRENCY,
        rates: FALLBACK_EXCHANGE_RATES,
        timestamp: now,
      };
    }
  }

  async convertToBaseCurrency(amount: number, fromCurrency: string): Promise<number> {
    if (fromCurrency === BASE_CURRENCY) {
      return amount;
    }

    const rates = await this.getExchangeRates();
    const rate = rates.rates[fromCurrency] ?? FALLBACK_EXCHANGE_RATES[fromCurrency];

    if (!rate || rate <= 0) {
      console.warn(`Exchange rate not found for ${fromCurrency}, using 1:1 conversion`);
      return amount;
    }

    return amount / rate;
  }

  async convertFromBaseCurrency(amount: number, toCurrency: string): Promise<number> {
    if (toCurrency === BASE_CURRENCY) {
      return amount;
    }

    const rates = await this.getExchangeRates();
    const rate = rates.rates[toCurrency] ?? FALLBACK_EXCHANGE_RATES[toCurrency];

    if (!rate || rate <= 0) {
      console.warn(`Exchange rate not found for ${toCurrency}, using 1:1 conversion`);
      return amount;
    }

    return amount * rate;
  }

  async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    if (fromCurrency === toCurrency) {
      return amount;
    }

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
    currency = BASE_CURRENCY,
    options: CurrencyFormatOptions = {},
  ): string {
    const { useLargeNumberFormat = true, showSymbol = true, showCode = false } = options;
    const currencyInfo = this.getCurrencyInfo(currency);

    let result = '';

    if (useLargeNumberFormat && Math.abs(amount) >= 1000) {
      result = formatLargeNumber(amount, showSymbol ? currencyInfo.symbol : '');
    } else {
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

  formatEuroAmount(amount: number, options: { showSymbol?: boolean } = {}): string {
    const { showSymbol = true } = options;
    const currencyInfo = this.getCurrencyInfo(BASE_CURRENCY);

    const formattedAmount = amount.toLocaleString('en-US', {
      minimumFractionDigits: currencyInfo.decimals,
      maximumFractionDigits: currencyInfo.decimals,
    });

    return showSymbol ? `${currencyInfo.symbol}${formattedAmount}` : formattedAmount;
  }

  formatDisplayAmount(
    amount: number,
    currency = BASE_CURRENCY,
    _context: CurrencyDisplayContext = 'summary',
  ): string {
    return this.formatCurrency(amount, currency, { useLargeNumberFormat: true });
  }
}

export const currencyService = new CurrencyService();
