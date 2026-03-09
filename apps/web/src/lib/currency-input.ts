import type {
  CurrencyInputValidationOptions,
  CurrencyInputValidationResult,
} from './currency.types';
import { formatBalance, formatCurrency } from './currency-format';
import { currencyService } from './currency.service';

export function parseNumberInput(input: string): number {
  if (!input || input.trim() === '') {
    return 0;
  }

  let cleaned = input.trim();

  const isNegative = cleaned.startsWith('-');
  if (isNegative) {
    cleaned = cleaned.substring(1);
  }

  cleaned = cleaned
    .replace(/[^\d.,]/g, '')
    .replace(/,/g, '.')
    .replace(/\.(?=.*\.)/g, '');

  const parsed = parseFloat(cleaned);
  const result = Number.isNaN(parsed) ? 0 : parsed;

  return isNegative ? -result : result;
}

export function validateCurrencyInput(
  input: string,
  currency: string,
  options: CurrencyInputValidationOptions = {},
): CurrencyInputValidationResult {
  const { allowNegative = false, allowZero = false } = options;

  if (!input.trim()) {
    return { isValid: false, value: 0, error: 'Amount is required' };
  }

  const value = parseNumberInput(input);
  const currencyInfo = currencyService.getCurrencyInfo(currency);

  if (Number.isNaN(value)) {
    return { isValid: false, value: 0, error: 'Please enter a valid number' };
  }

  if (!allowNegative && value < 0) {
    return { isValid: false, value: 0, error: 'Please enter a positive number' };
  }

  if (!allowZero && value === 0) {
    return { isValid: false, value: 0, error: 'Amount must be greater than 0' };
  }

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
