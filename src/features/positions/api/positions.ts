import axiosInstance from '@/lib/axios';
import { Category, Screenshot, Trade, TRADE_RESULTS, TRADE_SIDES } from '../types/position';

function mapTradeToPosition(trade: Record<string, unknown>): Trade {
  return {
    id: trade.id as string,
    date: new Date((trade.date as string) || ''),
    symbol: trade.symbol as string,
    side: trade.side as TRADE_SIDES,
    entryPrice: (trade.entryPrice as number) || 0,
    exitPrice: (trade.exitPrice as number) || 0,
    stopLoss: (trade.stopLoss as number) || 0,
    commission: (trade.commission as number) || 0,
    positionSize: (trade.positionSize as number) || 0,
    leverage: trade.leverage as number,
    category: trade.category as Category,
    pnl: (trade.pnl as number) || 0,
    result: trade.result as TRADE_RESULTS,
    deposit: (trade.deposit as number) || 0,
    riskPercent: (trade.riskPercent as number) || 0,
    investment: (trade.investment as number) || 0,
    comment: trade.comment as string | undefined,
    screenshots: (trade.screenshots as Screenshot[]) || [],
  };
}

export async function getPositionsByUserId(): Promise<Trade[]> {
  const { data } = await axiosInstance.get('/trades');
  return data.trades.map(mapTradeToPosition);
}

export async function createPosition(data: Omit<Trade, 'id'>): Promise<Trade> {
  const { category, screenshots, ...restData } = data;
  const apiData = {
    ...restData,
    categoryName: typeof category === 'object' && category !== null ? category.name : 'solo',
    screenshots: screenshots || [],
  };

  const { data: response } = await axiosInstance.post('/trades', apiData);
  return mapTradeToPosition(response.trade);
}

export async function updatePosition(id: string, data: Partial<Trade>): Promise<Trade> {
  const { category, screenshots, ...restData } = data;
  const apiData = {
    ...restData,
    ...(category && {
      categoryName: typeof category === 'object' && category !== null ? category.name : 'solo',
    }),
    ...(screenshots && { screenshots }),
  };

  const { data: response } = await axiosInstance.put(`/trades/${id}`, apiData);
  return mapTradeToPosition(response.trade);
}

export async function deletePosition(id: string): Promise<void> {
  await axiosInstance.delete(`/trades/${id}`);
}
