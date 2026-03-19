import { Badge } from '@/components/ui/badge';
import {
  BASE_CURRENCY,
  convertToBaseCurrencySafe,
  formatCurrency,
  formatEuroAmount,
} from '@/lib/currency';
import { ArrowRightLeft, Calendar, Minus, Plus, Tag } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Transaction } from '../queries/transactions';

interface AmountCellProps {
  transaction: Transaction;
  amountColor: string;
  currency: string;
}

function AmountCell({ transaction, amountColor, currency }: AmountCellProps) {
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const accountCurrency = transaction.account?.currency;
  const showMonobankEquivalent =
    transaction.amountInAccountCurrency != null && accountCurrency && currency !== accountCurrency;

  useEffect(() => {
    if (showMonobankEquivalent) return;

    const convertAmount = async () => {
      if (currency === BASE_CURRENCY) {
        setConvertedAmount(transaction.amount);
        return;
      }

      setIsConverting(true);
      try {
        const converted = await convertToBaseCurrencySafe(transaction.amount, currency);
        setConvertedAmount(converted);
      } catch {
        setConvertedAmount(null);
      } finally {
        setIsConverting(false);
      }
    };

    convertAmount();
  }, [transaction.amount, currency, showMonobankEquivalent]);

  return (
    <div className={`font-semibold text-right ${amountColor}`}>
      <div>
        {transaction.type === 'EXPENSE' && '-'}
        {transaction.type === 'INCOME' && '+'}
        {formatCurrency(transaction.amount, currency, {
          useLargeNumberFormat: false,
        })}
      </div>
      {showMonobankEquivalent && (
        <div className="text-xs text-muted-foreground mt-1">
          {formatCurrency(Math.abs(transaction.amountInAccountCurrency!), accountCurrency!, {
            useLargeNumberFormat: false,
          })}
        </div>
      )}
      {!showMonobankEquivalent && currency !== BASE_CURRENCY && (
        <div className="text-xs text-muted-foreground mt-1">
          {isConverting
            ? 'Converting...'
            : convertedAmount !== null
              ? `≈ ${formatEuroAmount(convertedAmount)}`
              : 'N/A'}
        </div>
      )}
    </div>
  );
}

const transactionTypeIcons = {
  INCOME: Plus,
  EXPENSE: Minus,
  TRANSFER: ArrowRightLeft,
};

const getTransactionTypeColor = (type: string) => {
  switch (type) {
    case 'INCOME':
      return 'text-income bg-income/10';
    case 'EXPENSE':
      return 'text-expense bg-expense/10';
    case 'TRANSFER':
      return 'text-transfer bg-transfer/10';
    default:
      return 'text-muted-foreground bg-muted';
  }
};

const getAmountColor = (type: string) => {
  switch (type) {
    case 'INCOME':
      return 'text-income';
    case 'EXPENSE':
      return 'text-expense';
    case 'TRANSFER':
      return 'text-transfer';
    default:
      return 'text-muted-foreground';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  }
};

export function useTransactionColumns() {
  return useMemo(() => {
    return [
      {
        key: 'date',
        header: 'Date',
        className: 'w-[100px]',
        cell: (transaction: Transaction) => (
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">{formatDate(transaction.date)}</span>
          </div>
        ),
      },
      {
        key: 'type',
        header: 'Type',
        className: 'text-center w-[100px]',
        cell: (transaction: Transaction) => {
          const TypeIcon = transactionTypeIcons[transaction.type];
          const typeColor = getTransactionTypeColor(transaction.type);
          return (
            <div
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${typeColor}`}
            >
              <TypeIcon className="h-3 w-3" />
              {transaction.type.toLowerCase()}
            </div>
          );
        },
      },
      {
        key: 'description',
        header: 'Description',
        className: 'max-w-[200px]',
        cell: (transaction: Transaction) => (
          <div className="max-w-[200px]">
            <div className="font-medium truncate">
              {transaction.description || 'No description'}
            </div>
            {transaction.tags && transaction.tags.length > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <Tag className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {transaction.tags.slice(0, 2).join(', ')}
                  {transaction.tags.length > 2 && ` +${transaction.tags.length - 2}`}
                </span>
              </div>
            )}
          </div>
        ),
      },
      {
        key: 'category',
        header: 'Category',
        className: 'text-center w-[120px]',
        cell: (transaction: Transaction) => {
          if (!transaction.category) return '-';
          return (
            <div className="flex items-center gap-2 justify-center">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: transaction.category.color }}
              />
              <span className="text-sm truncate max-w-[80px]">{transaction.category.name}</span>
            </div>
          );
        },
      },
      {
        key: 'account',
        header: 'Account',
        className: 'w-[140px]',
        cell: (transaction: Transaction) => (
          <div className="text-sm">
            <div className="font-medium truncate">{transaction.account.name}</div>
            <Badge variant="outline" className="text-xs mt-1">
              {transaction.currency || transaction.account.currency}
            </Badge>
          </div>
        ),
      },
      {
        key: 'amount',
        header: 'Amount',
        className: 'text-right w-[160px]',
        cell: (transaction: Transaction) => {
          const amountColor = getAmountColor(transaction.type);
          const currency = transaction.currency || transaction.account.currency;

          return (
            <AmountCell transaction={transaction} amountColor={amountColor} currency={currency} />
          );
        },
      },
    ];
  }, []);
}
