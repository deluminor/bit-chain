import type { TransactionRowData } from '~/src/components/transaction/TransactionRow';

export interface TransactionSection {
  title: string;
  data:  TransactionRowData[];
}
