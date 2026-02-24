import { formatCurrency } from '@/app/(protected)/journal/utils/formatters';
import { Trade, TRADE_RESULTS } from '../types/position';
import { calculateWinRate } from '../utils/calculations';

interface PositionStatsProps {
  trades: Trade[];
}

export function PositionStats({ trades }: PositionStatsProps) {
  const stats = trades.reduce(
    (acc, trade) => {
      acc.totalTrades++;
      acc.totalPnl += trade.pnl;

      if (trade.result === TRADE_RESULTS.WIN) {
        acc.winTrades++;
      } else if (trade.result === TRADE_RESULTS.LOSS) {
        acc.lossTrades++;
      }

      if (trade.result !== TRADE_RESULTS.PENDING) {
        acc.completedTrades++;
        if (trade.result === TRADE_RESULTS.WIN) {
          acc.completedWinTrades++;
        }
      }

      return acc;
    },
    {
      totalTrades: 0,
      winTrades: 0,
      lossTrades: 0,
      totalPnl: 0,
      completedTrades: 0,
      completedWinTrades: 0,
    },
  );

  const winRate = calculateWinRate(trades);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="bg-card p-4 rounded-lg shadow">
        <p className="text-sm font-medium text-muted-foreground">Total P/L</p>
        <p
          className={`text-2xl font-bold truncate ${stats.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}
          title={formatCurrency(stats.totalPnl)}
        >
          {formatCurrency(stats.totalPnl)}
        </p>
      </div>
      <div className="bg-card p-4 rounded-lg shadow">
        <p className="text-sm font-medium text-muted-foreground">Win Rate</p>
        <p className="text-2xl font-bold truncate" title={`${winRate}%`}>
          {winRate}%
        </p>
      </div>
      <div className="bg-card p-4 rounded-lg shadow">
        <p className="text-sm font-medium text-muted-foreground">Win Trades</p>
        <p
          className="text-2xl font-bold text-green-600 truncate"
          title={stats.winTrades.toString()}
        >
          {stats.winTrades}
        </p>
      </div>
      <div className="bg-card p-4 rounded-lg shadow">
        <p className="text-sm font-medium text-muted-foreground">Loss Trades</p>
        <p className="text-2xl font-bold text-red-600 truncate" title={stats.lossTrades.toString()}>
          {stats.lossTrades}
        </p>
      </div>
      <div className="bg-card p-4 rounded-lg shadow">
        <p className="text-sm font-medium text-muted-foreground">Total Trades</p>
        <p className="text-2xl font-bold truncate" title={stats.totalTrades.toString()}>
          {stats.totalTrades}
        </p>
      </div>
    </div>
  );
}
