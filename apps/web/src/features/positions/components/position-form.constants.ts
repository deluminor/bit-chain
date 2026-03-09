import type { NumericFieldName } from './PositionNumericField';

export interface NumericFieldConfig {
  name: NumericFieldName;
  label: string;
  helpText?: string;
  formatInitialWithSpaces?: boolean;
}

export const NUMERIC_FIELD_CONFIG: NumericFieldConfig[] = [
  { name: 'entryPrice', label: 'Entry Price', formatInitialWithSpaces: true },
  {
    name: 'positionSize',
    label: 'Position Size',
    helpText: 'Enter the amount of cryptocurrency you bought (e.g., 0.32 BTC)',
  },
  { name: 'stopLoss', label: 'Stop Loss' },
  { name: 'leverage', label: 'Leverage' },
  { name: 'exitPrice', label: 'Exit Price' },
  { name: 'commission', label: 'Commission' },
  {
    name: 'deposit',
    label: 'Total Deposit',
    helpText: 'Enter your total account deposit to calculate risk percentage relative to stop loss',
  },
];
