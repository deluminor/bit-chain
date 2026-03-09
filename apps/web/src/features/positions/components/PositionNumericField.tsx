import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { HelpTooltip } from './HelpTooltip';
import type { PositionFormValues } from '../types/position';
import type { UseFormReturn } from 'react-hook-form';

export type NumericFieldName =
  | 'entryPrice'
  | 'positionSize'
  | 'stopLoss'
  | 'leverage'
  | 'exitPrice'
  | 'commission'
  | 'deposit';

interface PositionNumericFieldProps {
  form: UseFormReturn<PositionFormValues>;
  name: NumericFieldName;
  label: string;
  rawInputs: Record<string, string>;
  onNumericChange: (name: NumericFieldName, value: string) => void;
  onNumericBlur: (name: NumericFieldName) => void;
  helpText?: string;
  formatInitialWithSpaces?: boolean;
  formatWithSpaces: (value: string) => string;
}

export function PositionNumericField({
  form,
  name,
  label,
  rawInputs,
  onNumericChange,
  onNumericBlur,
  helpText,
  formatInitialWithSpaces = false,
  formatWithSpaces,
}: PositionNumericFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const rawValue =
          rawInputs[name] !== undefined
            ? rawInputs[name]
            : field.value !== undefined && field.value !== null
              ? formatInitialWithSpaces
                ? formatWithSpaces(String(field.value))
                : String(field.value)
              : '';

        return (
          <FormItem>
            {helpText ? (
              <div className="flex items-center gap-2">
                <FormLabel>{label}</FormLabel>
                <HelpTooltip text={helpText} />
              </div>
            ) : (
              <FormLabel>{label}</FormLabel>
            )}
            <FormControl>
              <Input
                {...field}
                type="text"
                value={rawValue}
                onChange={event => onNumericChange(name, event.target.value)}
                onBlur={() => onNumericBlur(name)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
