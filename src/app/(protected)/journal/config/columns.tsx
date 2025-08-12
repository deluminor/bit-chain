import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ScreenshotThumbnail } from '@/features/positions/components/ScreenshotGallery';
import { useDefaultCategory } from '@/features/positions/queries/categories';
import { Trade } from '@/features/positions/types/position';
import { useMemo } from 'react';
import {
  formatCurrency,
  formatDate,
  getCategoryColorClass,
  getResultColorClass,
  getRiskColorClass,
  getSideColorClass,
} from '../utils/formatters';

export function useColumns() {
  const { data: defaultCategory } = useDefaultCategory();
  const defaultCategoryId = defaultCategory?.id || '';

  return useMemo(() => {
    return [
      {
        key: 'date',
        header: 'Date',
        className: 'w-[100px]',
        cell: (trade: Trade) => formatDate(trade.date),
      },
      {
        key: 'symbol',
        header: 'Symbol',
        className: 'text-center',
        cell: (trade: Trade) => (
          <span className="font-medium text-center block">{trade.symbol}</span>
        ),
      },
      {
        key: 'side',
        header: 'Side',
        className: 'text-center',
        cell: (trade: Trade) => (
          <span
            className={`px-2 block text-center py-1 rounded-full text-xs font-medium ${getSideColorClass(
              trade.side,
            )}`}
          >
            {trade.side.toLowerCase()}
          </span>
        ),
      },
      {
        key: 'pnl',
        header: 'P/L',
        className: 'text-right',
        cell: (trade: Trade) => (
          <span className={`block text-right ${getResultColorClass(trade.result)}`}>
            {formatCurrency(trade.pnl)}
          </span>
        ),
      },
      {
        key: 'screenshots',
        header: 'Images',
        className: 'text-center w-[40px]',
        cell: (trade: Trade) => {
          if (!trade.screenshots || trade.screenshots.length === 0) {
            return <span className="text-center block text-muted-foreground text-xs">-</span>;
          }

          return (
            <div className="flex justify-center">
              <ScreenshotThumbnail screenshots={trade.screenshots} className="hover:bg-muted/40" />
            </div>
          );
        },
      },
      {
        key: 'riskPercent',
        header: 'Risk %',
        className: 'text-center',
        cell: (trade: Trade) => (
          <span className={`block text-center ${getRiskColorClass(trade.riskPercent)}`}>
            {trade.riskPercent}%
          </span>
        ),
      },
      {
        key: 'entryPrice',
        header: 'Entry Price',
        className: 'text-right',
        cell: (trade: Trade) => (
          <span className="block text-right">{formatCurrency(trade.entryPrice)}</span>
        ),
      },
      {
        key: 'exitPrice',
        header: 'Exit Price',
        className: 'text-right',
        cell: (trade: Trade) => (
          <span className="block text-right">{formatCurrency(trade.exitPrice)}</span>
        ),
      },

      {
        key: 'stopLoss',
        header: 'Stop Loss',
        className: 'text-right',
        cell: (trade: Trade) => (
          <span className="block text-right">{formatCurrency(trade.stopLoss)}</span>
        ),
      },
      {
        key: 'positionSize',
        header: 'Size',
        className: 'text-center',
        cell: (trade: Trade) => <span className="block text-center">{trade.positionSize}</span>,
      },
      {
        key: 'leverage',
        header: 'Leverage',
        className: 'text-center',
        cell: (trade: Trade) => (
          <span className="block text-center">{trade.leverage || 'N/A'}</span>
        ),
      },
      {
        key: 'investment',
        header: 'Investment',
        className: 'text-right',
        cell: (trade: Trade) =>
          trade.investment ? (
            <span className="block text-right">{formatCurrency(trade.investment)}</span>
          ) : (
            <span className="block text-right">N/A</span>
          ),
      },
      {
        key: 'commission',
        header: 'Commission',
        className: 'text-center',
        cell: (trade: Trade) => (
          <span className="block text-center">{formatCurrency(trade.commission)}</span>
        ),
      },
      {
        key: 'result',
        header: 'Result',
        className: 'text-center',
        cell: (trade: Trade) => (
          <span
            className={`block text-center px-2 py-1 rounded-full text-xs font-medium ${getResultColorClass(trade.result)}`}
          >
            {trade.result.toLowerCase()}
          </span>
        ),
      },
      {
        key: 'category',
        header: 'Category',
        className: 'text-center',
        cell: (trade: Trade) => {
          const categoryName = trade.category.name;
          const categoryId = trade.category.id;

          return (
            <span
              className={`block text-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColorClass(
                categoryName,
                categoryId,
                defaultCategoryId,
              )}`}
            >
              {categoryName}
            </span>
          );
        },
      },
      {
        key: 'comment',
        header: 'Comment',
        className: 'max-w-[100px]',
        cell: (trade: Trade) =>
          trade.comment ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="block max-w-[70px] truncate cursor-pointer">{trade.comment}</span>
              </TooltipTrigger>
              <TooltipContent side="left">
                <span className="whitespace-pre-line break-words max-w-xs block">
                  {trade.comment}
                </span>
              </TooltipContent>
            </Tooltip>
          ) : (
            '-'
          ),
      },
    ];
  }, [defaultCategoryId]);
}
