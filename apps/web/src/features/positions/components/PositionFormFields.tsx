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
import { useWatch, type UseFormReturn } from 'react-hook-form';
import { useCategories } from '../queries/categories';
import { PositionFormValues, TRADE_SIDES, TRADE_SIDES_LIST } from '../types/position';
import { calculateRiskPercent, parseFormattedNumber } from '../utils/calculations';
import { ScreenshotsUploader } from './ScreenshotsUploader';
import { PositionNumericField, type NumericFieldName } from './PositionNumericField';
import { PositionRiskSummary } from './PositionRiskSummary';
import { NUMERIC_FIELD_CONFIG } from './position-form.constants';

interface PositionFormFieldsProps {
  form: UseFormReturn<PositionFormValues>;
}

const handleDecimalInput = (value: string): string => {
  const cleanValue = value.replace(/[^\d.,]/g, '');
  const parts = cleanValue.split(/[.,]/);
  if (parts.length > 2) {
    return `${parts.slice(0, -1).join('')}.${parts[parts.length - 1]}`;
  }
  if (parts.length === 2) {
    return `${parts[0]}.${parts[1]}`;
  }
  return parts[0] || '';
};

const formatWithSpaces = (value: string): string => {
  if (!value) return '';
  const parts = value.split('.');
  const integerPart = parts[0] || '0';
  const cleanedInteger = integerPart.replace(/^0+(?!$)/, '');
  const formattedInteger = cleanedInteger.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return parts.length > 1 ? `${formattedInteger}.${parts[1]}` : formattedInteger;
};

export function PositionFormFields({ form }: PositionFormFieldsProps) {
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

  const handleNumericFieldChange = (name: NumericFieldName, value: string) => {
    const processedValue = handleDecimalInput(value);
    const formattedValue = formatWithSpaces(processedValue);

    setRawInputs(prev => ({ ...prev, [name]: formattedValue }));

    if (processedValue) {
      form.setValue(name, parseFormattedNumber(processedValue));
    } else {
      form.setValue(name, undefined);
    }
  };

  const handleBlur = (name: NumericFieldName) => {
    const rawValue = rawInputs[name] || '';
    if (rawValue) {
      setRawInputs(prev => ({ ...prev, [name]: formatWithSpaces(rawValue) }));
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
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

      {NUMERIC_FIELD_CONFIG.map(config => (
        <PositionNumericField
          key={config.name}
          form={form}
          name={config.name}
          label={config.label}
          helpText={config.helpText}
          formatInitialWithSpaces={config.formatInitialWithSpaces}
          rawInputs={rawInputs}
          onNumericChange={handleNumericFieldChange}
          onNumericBlur={handleBlur}
          formatWithSpaces={formatWithSpaces}
        />
      ))}

      <FormField
        control={form.control}
        name="category"
        render={({ field }) => {
          const categoryValue =
            typeof field.value === 'object' && field.value !== null
              ? (field.value as { name: string }).name
              : field.value;

          return (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={value => {
                  const selectedCategory = categories?.find(category => category.name === value);
                  field.onChange(selectedCategory ?? value);
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
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

      <PositionRiskSummary riskPercent={riskPercent} />

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
