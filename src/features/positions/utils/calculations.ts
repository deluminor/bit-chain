import { TRADE_RESULTS, TRADE_SIDES } from '../types/position';

export function calculatePnl({
  side,
  entryPrice,
  exitPrice,
  positionSize,
  commission = 0,
  // leverage = 1,
}: {
  side: TRADE_SIDES;
  entryPrice: number;
  exitPrice: number;
  positionSize: number;
  commission?: number;
}): number {
  if (!entryPrice || !exitPrice || !positionSize) return 0;

  const rawPnL =
    side === TRADE_SIDES.LONG
      ? (exitPrice - entryPrice) * positionSize
      : (entryPrice - exitPrice) * positionSize;

  const netPnL = rawPnL - commission;
  return Math.round(netPnL * 100) / 100;
}

export function calculateRiskPercent({
  side,
  entryPrice,
  stopLoss,
  positionSize,
  deposit,
}: {
  side: TRADE_SIDES;
  entryPrice: number;
  stopLoss: number;
  positionSize: number;
  deposit: number;
}): number {
  if (!stopLoss) return 100;
  if (!entryPrice || !positionSize || !deposit) return 0;

  const potentialLoss =
    side === TRADE_SIDES.LONG
      ? (entryPrice - stopLoss) * positionSize
      : (stopLoss - entryPrice) * positionSize;

  const leveragedLoss = potentialLoss;
  const percent = (leveragedLoss / deposit) * 100;

  return Math.round(percent * 100) / 100;
}

export function calculateInvestment({
  entryPrice,
  positionSize,
  leverage = 1,
}: {
  entryPrice: number;
  positionSize: number;
  leverage: number;
}): number {
  if (!entryPrice || !positionSize || !leverage) return 0;

  const investment = (entryPrice * positionSize) / leverage;

  return Math.round(investment * 100) / 100;
}

export function calculateWinRate(trades: Array<{ result: TRADE_RESULTS }>): number {
  const completedTrades = trades.filter(t => t.result !== TRADE_RESULTS.PENDING);
  if (completedTrades.length === 0) return 0;

  const winningTrades = completedTrades.filter(t => t.result === TRADE_RESULTS.WIN).length;
  return Math.round((winningTrades / completedTrades.length) * 100);
}

export function handleNumericInput(e: React.ChangeEvent<HTMLInputElement>) {
  const input = e.target;
  const value = input.value;

  // Allow only digits, the first decimal point, and proper placement of the decimal point
  let processedValue = '';
  let hasDecimal = false;

  for (let i = 0; i < value.length; i++) {
    const char = value.charAt(i);

    // Allow digits
    if (/\d/.test(char)) {
      processedValue += char;
    }
    // Handle decimal points and commas (convert comma to decimal point)
    else if ((char === '.' || char === ',') && !hasDecimal) {
      processedValue += '.';
      hasDecimal = true;
    }
    // Ignore other characters
  }

  // Update input value
  input.value = processedValue;
}

export function formatNumberWithSpaces(value: string | number | undefined): string {
  if (value === undefined || value === null || value === '') return '';

  // Convert to string and handle both comma and dot as decimal separator
  const stringValue = String(value).replace(/,/g, '.');

  // Split into integer and decimal parts
  const parts = stringValue.split('.');
  const integerPart = parts[0] || '0';
  const decimalPart = parts.length > 1 ? parts[1] : undefined;

  // Format integer part with spaces as thousand separators
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  // Return the formatted number
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
}

export function parseFormattedNumber(formattedValue: string): number {
  if (!formattedValue) return 0;

  // Remove spaces and replace commas with dots
  const cleanValue = formattedValue.replace(/\s/g, '').replace(/,/g, '.');

  // Handle case when input ends with decimal point (e.g., "22.")
  if (cleanValue.endsWith('.')) {
    return parseFloat(cleanValue + '0');
  }

  // Parse to number
  return parseFloat(cleanValue);
}

export type PositionStatus = 'OPEN' | 'CLOSED' | 'IN_PROGRESS';

export interface PositionMetrics {
  pnl: number;
  result: number;
  riskPercentage: number;
  investment: number;
  status: PositionStatus;
}

export function calculatePositionMetrics(
  entryPrice: number,
  exitPrice: number | undefined,
  size: number,
  leverage: number,
  side: 'LONG' | 'SHORT',
  commission: number = 0,
): PositionMetrics {
  const investment = size * entryPrice;
  const leveragedInvestment = investment * leverage;

  if (!exitPrice) {
    return {
      pnl: 0,
      result: 0,
      riskPercentage: 0,
      investment: leveragedInvestment,
      status: 'IN_PROGRESS',
    };
  }

  const priceDifference = side === 'LONG' ? exitPrice - entryPrice : entryPrice - exitPrice;

  const pnl = priceDifference * size * leverage - commission;
  const result = (pnl / leveragedInvestment) * 100;

  // Risk percentage calculation (assuming stop loss is set)
  const riskPercentage = 0; // This will be calculated when stop loss is implemented

  return {
    pnl,
    result,
    riskPercentage,
    investment: leveragedInvestment,
    status: 'CLOSED',
  };
}
