import type { TransactionRowData } from '~/src/components/transaction/TransactionRow';
import { formatRelativeDate } from '~/src/utils/format';
import type { TransactionSection } from './_types';

export function groupByDate(transactions: TransactionRowData[]): TransactionSection[] {
  const map = new Map<string, TransactionRowData[]>();
  for (const tx of transactions) {
    const key = formatRelativeDate(tx.date);
    const arr = map.get(key) ?? [];
    arr.push(tx);
    map.set(key, arr);
  }
  return Array.from(map.entries()).map(([title, data]) => ({ title, data }));
}
