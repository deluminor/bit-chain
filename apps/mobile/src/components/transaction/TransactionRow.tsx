import { StyleSheet, Text, View } from 'react-native';
import { PrivacyAmount } from '~/src/components/ui';
import { colors, fontSize, fontWeight, radius, spacing } from '~/src/design/tokens';
import { formatCurrency, formatRelativeDate } from '~/src/utils/format';

export interface TransactionRowData {
  id: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  description: string | null;
  date: string;
  currency: string;
  accountName: string;
  categoryName: string | null;
  categoryColor?: string | null;
}

interface TransactionRowProps {
  transaction: TransactionRowData;
  hideDate?: boolean;
}

const TYPE_CONFIG: Record<
  TransactionRowData['type'],
  { color: string; sign: string; bgColor: string; icon: string }
> = {
  INCOME: { color: colors.income, sign: '+', bgColor: colors.incomeSubtle, icon: '↑' },
  EXPENSE: { color: colors.expense, sign: '-', bgColor: colors.expenseSubtle, icon: '↓' },
  TRANSFER: { color: colors.transfer, sign: '', bgColor: colors.transferSubtle, icon: '↔' },
};

export function TransactionRow({ transaction, hideDate = false }: TransactionRowProps) {
  const { color, sign, bgColor, icon } = TYPE_CONFIG[transaction.type];

  const label = transaction.description ?? transaction.categoryName ?? 'Transaction';
  const amount = `${sign}${formatCurrency(transaction.amount, transaction.currency)}`;
  const dotColor = transaction.categoryColor ?? colors.bgMuted;

  return (
    <View style={styles.row}>
      {/* Left: type icon */}
      <View style={[styles.iconWrap, { backgroundColor: bgColor }]}>
        <Text style={[styles.icon, { color }]}>{icon}</Text>
      </View>

      {/* Center: description + category/account */}
      <View style={styles.meta}>
        <Text style={styles.description} numberOfLines={1}>
          {label}
        </Text>
        <View style={styles.subtitleRow}>
          {transaction.categoryName != null && (
            <View style={[styles.categoryDot, { backgroundColor: dotColor }]} />
          )}
          <Text style={styles.account} numberOfLines={1}>
            {transaction.categoryName ?? transaction.accountName}
          </Text>
        </View>
      </View>

      {/* Right column: amount (top) + date (bottom) — both right-aligned */}
      <View style={styles.rightCol}>
        <PrivacyAmount value={amount} color={color} size={fontSize.base} style={styles.amount} />
        {!hideDate && <Text style={styles.date}>{formatRelativeDate(transaction.date)}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  icon: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  description: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    flexShrink: 0,
  },
  account: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    flex: 1,
  },

  // Right column: amount + date stacked, right-aligned
  rightCol: {
    alignItems: 'flex-end',
    gap: 2,
    flexShrink: 0,
  },
  amount: {
    fontWeight: fontWeight.semibold,
  },
  date: {
    color: colors.textDisabled,
    fontSize: fontSize.xs,
  },
});
