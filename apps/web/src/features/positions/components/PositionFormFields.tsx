import { getRiskColorClass } from '@/app/(protected)/journal/utils/formatters';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { useCategories } from '../queries/categories';
import { PositionFormValues, TRADE_SIDES, TRADE_SIDES_LIST } from '../types/position';
import { calculateRiskPercent, parseFormattedNumber } from '../utils/calculations';
import { HelpTooltip } from './HelpTooltip';
import { ScreenshotsUploader } from './ScreenshotsUploader';

interface PositionFormFieldsProps {
  form: UseFormReturn<PositionFormValues>;
}

// Helper function for handling numeric input with decimal support
const handleDecimalInput = (value: string): string => {
  // Allow only numbers, decimal points, and commas
  const cleanValue = value.replace(/[^\d.,]/g, '');

  // If there are multiple commas, treat all but the last one as thousand separators
  const parts = cleanValue.split(/[.,]/);
  if (parts.length > 2) {
    // Join all parts except the last one with dots (for decimal)
    const integerPart = parts.slice(0, -1).join('');
    const decimalPart = parts[parts.length - 1];
    return `${integerPart}.${decimalPart}`;
  }

  // If there's only one separator, use it as decimal point
  if (parts.length === 2) {
    return `${parts[0]}.${parts[1]}`;
  }

  return parts[0] || '';
};

// Format a numeric string with spaces as thousand separators, preserving decimal part
const formatWithSpaces = (value: string): string => {
  if (!value) return '';
  const parts = value.split('.');
  const integerPart = parts[0] || '0';
  // Remove leading zeros except for '0.'
  const cleanedInteger = integerPart.replace(/^0+(?!$)/, '');
  const formattedInteger = cleanedInteger.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  if (parts.length > 1) {
    return `${formattedInteger}.${parts[1]}`;
  }
  return formattedInteger;
};

export function PositionFormFields({ form }: PositionFormFieldsProps) {
  // Track the raw text input values before parsing to numbers
  const [rawInputs, setRawInputs] = useState<Record<string, string>>({});
  const [riskPercent, setRiskPercent] = useState<number>(0);

  const watchedValues = useWatch({
    control: form.control,
    name: ['side', 'entryPrice', 'stopLoss', 'positionSize', 'deposit'],
  });

  const { data: categories, isLoading: isCategoriesLoading } = useCategories();

  useEffect(() => {
    const [side, entryPrice, stopLoss, positionSize, deposit] = watchedValues;

    const risk = calculateRiskPercent({
      side: side || TRADE_SIDES.LONG,
      entryPrice: entryPrice || 0,
      stopLoss: stopLoss || 0,
      positionSize: positionSize || 0,
      deposit: deposit || 0,
    });

    setRiskPercent(risk);
  }, [watchedValues]);

  // Set initial raw values when form values change
  useEffect(() => {
    const formValues = form.getValues();
    const initialRawInputs: Record<string, string> = {};

    Object.keys(formValues).forEach(key => {
      const value = formValues[key as keyof PositionFormValues];
      if (typeof value === 'number') {
        initialRawInputs[key] = value.toString();
      }
    });

    setRawInputs(prev => ({ ...prev, ...initialRawInputs }));
  }, [form]);

  // Custom handling for numeric fields to preserve decimal point and format with spaces
  const handleNumericFieldChange = (name: keyof PositionFormValues, value: string) => {
    // Clean and format value
    const processedValue = handleDecimalInput(value);
    const formattedValue = formatWithSpaces(processedValue);
    setRawInputs(prev => ({ ...prev, [name]: formattedValue }));
    // Parse number for form
    if (processedValue) {
      const numericValue = parseFormattedNumber(processedValue);
      form.setValue(name, numericValue);
    } else {
      form.setValue(name, undefined);
    }
  };

  const handleBlur = (name: keyof PositionFormValues) => {
    // Format the value with spaces when blurring
    const rawValue = rawInputs[name] || '';
    if (rawValue) {
      // Format with spaces on blur
      const formattedValue = formatWithSpaces(rawValue);
      setRawInputs(prev => ({ ...prev, [name]: formattedValue }));
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date</FormLabel>
            <FormControl>
              <DatePicker
                mode="default"
                date={field.value}
                onDateChange={field.onChange}
                placeholder="All time"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      /> */}

      <FormField
        control={form.control}
        name="symbol"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Symbol</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="side"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Side</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {TRADE_SIDES_LIST.map(side => (
                  <SelectItem key={side} value={side}>
                    {side.toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="entryPrice"
        render={({ field }) => {
          const fieldName = 'entryPrice';
          const rawValue =
            rawInputs[fieldName] !== undefined
              ? rawInputs[fieldName]
              : field.value !== undefined && field.value !== null
                ? formatWithSpaces(String(field.value))
                : '';
          return (
            <FormItem>
              <FormLabel>Entry Price</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  value={rawValue}
                  onChange={e => handleNumericFieldChange(fieldName, e.target.value)}
                  onBlur={() => handleBlur(fieldName)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        control={form.control}
        name="positionSize"
        render={({ field }) => {
          const fieldName = 'positionSize';
          const rawValue =
            rawInputs[fieldName] !== undefined
              ? rawInputs[fieldName]
              : field.value !== undefined && field.value !== null
                ? String(field.value)
                : '';

          return (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel>Position Size</FormLabel>
                <HelpTooltip text="Enter the amount of cryptocurrency you bought (e.g., 0.32 BTC)" />
              </div>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  value={rawValue}
                  onChange={e => {
                    const processedValue = handleDecimalInput(e.target.value);
                    handleNumericFieldChange(fieldName, processedValue);
                  }}
                  onBlur={() => handleBlur(fieldName)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        control={form.control}
        name="stopLoss"
        render={({ field }) => {
          const fieldName = 'stopLoss';
          const rawValue =
            rawInputs[fieldName] !== undefined
              ? rawInputs[fieldName]
              : field.value !== undefined && field.value !== null
                ? String(field.value)
                : '';

          return (
            <FormItem>
              <FormLabel>Stop Loss</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  value={rawValue}
                  onChange={e => {
                    const processedValue = handleDecimalInput(e.target.value);
                    handleNumericFieldChange(fieldName, processedValue);
                  }}
                  onBlur={() => handleBlur(fieldName)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        control={form.control}
        name="leverage"
        render={({ field }) => {
          const fieldName = 'leverage';
          const rawValue =
            rawInputs[fieldName] !== undefined
              ? rawInputs[fieldName]
              : field.value !== undefined && field.value !== null
                ? String(field.value)
                : '';

          return (
            <FormItem>
              <FormLabel>Leverage</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  value={rawValue}
                  onChange={e => {
                    const processedValue = handleDecimalInput(e.target.value);
                    handleNumericFieldChange(fieldName, processedValue);
                  }}
                  onBlur={() => handleBlur(fieldName)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        control={form.control}
        name="exitPrice"
        render={({ field }) => {
          const fieldName = 'exitPrice';
          const rawValue =
            rawInputs[fieldName] !== undefined
              ? rawInputs[fieldName]
              : field.value !== undefined && field.value !== null
                ? String(field.value)
                : '';

          return (
            <FormItem>
              <FormLabel>Exit Price</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  value={rawValue}
                  onChange={e => {
                    const processedValue = handleDecimalInput(e.target.value);
                    handleNumericFieldChange(fieldName, processedValue);
                  }}
                  onBlur={() => handleBlur(fieldName)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        control={form.control}
        name="commission"
        render={({ field }) => {
          const fieldName = 'commission';
          const rawValue =
            rawInputs[fieldName] !== undefined
              ? rawInputs[fieldName]
              : field.value !== undefined && field.value !== null
                ? String(field.value)
                : '';

          return (
            <FormItem>
              <FormLabel>Commission</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  value={rawValue}
                  onChange={e => {
                    const processedValue = handleDecimalInput(e.target.value);
                    handleNumericFieldChange(fieldName, processedValue);
                  }}
                  onBlur={() => handleBlur(fieldName)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        control={form.control}
        name="category"
        render={({ field }) => {
          // Handle category which can be either a string or an object with name property
          const categoryValue =
            typeof field.value === 'object' && field.value !== null
              ? (field.value as { name: string }).name
              : field.value;

          return (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={value => {
                  // Find the selected category to get its ID
                  const selectedCategory = categories?.find(cat => cat.name === value);
                  if (selectedCategory) {
                    // Pass the full category object with ID
                    field.onChange(selectedCategory);
                  } else {
                    // If not found, just pass the name
                    field.onChange(value);
                  }
                }}
                defaultValue={categoryValue}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isCategoriesLoading ? (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Loading categories...</span>
                    </div>
                  ) : categories?.length ? (
                    categories.map(category => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="solo">solo</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        control={form.control}
        name="deposit"
        render={({ field }) => {
          const fieldName = 'deposit';
          const rawValue =
            rawInputs[fieldName] !== undefined
              ? rawInputs[fieldName]
              : field.value !== undefined && field.value !== null
                ? String(field.value)
                : '';

          return (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel>Total Deposit</FormLabel>
                <HelpTooltip text="Enter your total account deposit to calculate risk percentage relative to stop loss" />
              </div>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  value={rawValue}
                  onChange={e => {
                    const processedValue = handleDecimalInput(e.target.value);
                    handleNumericFieldChange(fieldName, processedValue);
                  }}
                  onBlur={() => handleBlur(fieldName)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <div className="flex flex-col space-y-2 justify-end col-span-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Risk Percentage:</span>
          <span className={`font-medium ${getRiskColorClass(riskPercent)}`}>{riskPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${
              riskPercent <= 10 ? 'bg-green-500' : riskPercent <= 20 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(riskPercent, 100)}%` }}
          ></div>
        </div>
      </div>

      <FormField
        control={form.control}
        name="comment"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Comment</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Add a comment about this trade..."
                maxLength={255}
                className="resize-none"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <ScreenshotsUploader form={form} />
    </div>
  );
}
