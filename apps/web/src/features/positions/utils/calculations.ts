import { TRADE_RESULTS, TRADE_SIDES } from '../types/position';

export function calculatePnl({
  side,
  entryPrice,
  exitPrice,
  positionSize,
  commission = 0,
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

  return Math.round((rawPnL - commission) * 100) / 100;
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

  return Math.round((potentialLoss / deposit) * 100 * 100) / 100;
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
  return Math.round(((entryPrice * positionSize) / leverage) * 100) / 100;
}

export function calculateWinRate(trades: Array<{ result: TRADE_RESULTS }>): number {
  const completedTrades = trades.filter(t => t.result !== TRADE_RESULTS.PENDING);
  if (completedTrades.length === 0) return 0;

  const winningTrades = completedTrades.filter(t => t.result === TRADE_RESULTS.WIN).length;
  return Math.round((winningTrades / completedTrades.length) * 100);
}

export function parseFormattedNumber(formattedValue: string): number {
  if (!formattedValue) return 0;

  const cleanValue = formattedValue.replace(/\s/g, '').replace(/,/g, '.');

  if (cleanValue.endsWith('.')) {
    return parseFloat(cleanValue + '0');
  }

  return parseFloat(cleanValue);
}
