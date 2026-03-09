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

export interface CurrencyFormatOptions {
  useLargeNumberFormat?: boolean;
  showSymbol?: boolean;
  showCode?: boolean;
}

export type CurrencyDisplayContext = 'summary' | 'detailed';

export interface CurrencyInputValidationOptions {
  allowNegative?: boolean;
  allowZero?: boolean;
}

export interface CurrencyInputValidationResult {
  isValid: boolean;
  value: number;
  error?: string;
}
