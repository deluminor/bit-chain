import { TRADE_SIDES } from './types/position';

export interface PositionFormValues {
  date: string;
  symbol: string;
  side: TRADE_SIDES;
  entryPrice: number;
  exitPrice?: number;
  stopLoss?: number;
  commission?: number;
  positionSize: number;
  leverage?: number;
  category?: string;
  deposit?: number;
}
