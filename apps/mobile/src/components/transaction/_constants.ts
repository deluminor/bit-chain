import { colors } from '~/src/design/tokens';
import type { TransactionRowData } from './_types';

export const TYPE_CONFIG: Record<
  TransactionRowData['type'],
  { color: string; sign: string; bgColor: string; icon: string }
> = {
  INCOME: { color: colors.income, sign: '+', bgColor: colors.incomeSubtle, icon: '↑' },
  EXPENSE: { color: colors.expense, sign: '-', bgColor: colors.expenseSubtle, icon: '↓' },
  TRANSFER: { color: colors.transfer, sign: '', bgColor: colors.transferSubtle, icon: '↔' },
};
