'use client';

import React, { useState, useEffect, forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  SUPPORTED_CURRENCIES,
  parseNumberInput,
  validateCurrencyInput,
  formatCurrency,
} from '@/lib/currency';
import { cn } from '@/lib/utils';

interface CurrencyInputProps {
  value?: number;
  currency?: string;
  onChange?: (value: number, currency: string) => void;
  onAmountChange?: (amount: number) => void;
  onCurrencyChange?: (currency: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  showCurrencySelect?: boolean;
  defaultCurrency?: string;
  allowedCurrencies?: string[];
  showFormattedValue?: boolean;
  min?: number;
  max?: number;
  required?: boolean;
  allowNegative?: boolean;
  allowZero?: boolean;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      value = 0,
      currency = 'EUR',
      onChange,
      onAmountChange,
      onCurrencyChange,
      placeholder = '0.00',
      label,
      error,
      disabled = false,
      className,
      showCurrencySelect = true,
      defaultCurrency = 'EUR',
      allowedCurrencies,
      showFormattedValue = false,
      min,
      max,
      required = false,
      allowNegative = false,
      allowZero = true,
      ...props
    },
    ref,
  ) => {
    const [inputValue, setInputValue] = useState(value > 0 ? value.toString() : '');
    const [selectedCurrency, setSelectedCurrency] = useState(currency || defaultCurrency);
    const [validationError, setValidationError] = useState<string>('');

    // Update input when value prop changes
    useEffect(() => {
      if (value !== parseNumberInput(inputValue)) {
        setInputValue(value !== 0 ? value.toString() : '');
      }
    }, [value]);

    // Update currency when prop changes
    useEffect(() => {
      if (currency && currency !== selectedCurrency) {
        setSelectedCurrency(currency);
      }
    }, [currency]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      setInputValue(rawValue);

      // Validate the input
      const validation = validateCurrencyInput(rawValue, selectedCurrency, {
        allowNegative,
        allowZero,
      });

      if (validation.isValid) {
        setValidationError('');

        // Check min/max constraints
        if (min !== undefined && validation.value < min) {
          setValidationError(`Minimum amount is ${formatCurrency(min, selectedCurrency)}`);
          return;
        }

        if (max !== undefined && validation.value > max) {
          setValidationError(`Maximum amount is ${formatCurrency(max, selectedCurrency)}`);
          return;
        }

        // Notify parent components
        onAmountChange?.(validation.value);
        onChange?.(validation.value, selectedCurrency);
      } else {
        setValidationError(validation.error || '');
        if (rawValue === '') {
          // Allow empty input
          onAmountChange?.(0);
          onChange?.(0, selectedCurrency);
        }
      }
    };

    const handleCurrencyChange = (newCurrency: string) => {
      setSelectedCurrency(newCurrency);
      onCurrencyChange?.(newCurrency);

      // Re-validate with new currency
      const validation = validateCurrencyInput(inputValue, newCurrency, {
        allowNegative,
        allowZero,
      });
      if (validation.isValid) {
        onChange?.(validation.value, newCurrency);
      }
    };

    const displayError = error || validationError;
    const currencyOptions = allowedCurrencies || Object.keys(SUPPORTED_CURRENCIES);
    const currencyInfo = SUPPORTED_CURRENCIES[selectedCurrency];

    return (
      <div className={cn('space-y-2', className)}>
        {label && (
          <Label htmlFor={(props as any).id} className="text-sm font-medium">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}

        <div className="flex space-x-2">
          <div className="flex-1">
            <div className="relative">
              {currencyInfo && (
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  {currencyInfo.symbol}
                </span>
              )}
              <Input
                ref={ref}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(
                  currencyInfo ? 'pl-8' : '',
                  displayError ? 'border-red-500 focus:border-red-500' : '',
                )}
                {...props}
              />
            </div>

            {showFormattedValue && inputValue && !displayError && (
              <div className="text-xs text-gray-500 mt-1">
                Formatted: {formatCurrency(parseNumberInput(inputValue), selectedCurrency)}
              </div>
            )}
          </div>

          {showCurrencySelect && (
            <div className="w-24">
              <Select
                value={selectedCurrency}
                onValueChange={handleCurrencyChange}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map(code => {
                    const info = SUPPORTED_CURRENCIES[code];
                    if (!info) return null;
                    return (
                      <SelectItem key={code} value={code}>
                        <div className="flex items-center space-x-2">
                          <span>{info.symbol}</span>
                          <span className="text-xs text-gray-500">{code}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {displayError && <p className="text-red-500 text-xs mt-1">{displayError}</p>}
      </div>
    );
  },
);

CurrencyInput.displayName = 'CurrencyInput';
