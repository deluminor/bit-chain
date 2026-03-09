import { Text, View } from 'react-native';
import { PrivacyAmount } from '~/src/components/ui';
import { colors, fontSize } from '~/src/design/tokens';
import { formatCurrency, formatRelativeDate } from '~/src/utils/format';
import { TYPE_CONFIG } from './_constants';
import { rowStyles as styles } from './_styles';
import type { TransactionRowProps } from './_types';

export type { TransactionRowData } from './_types';

export function TransactionRow({ transaction, hideDate = false }: TransactionRowProps) {
  const { color, sign, bgColor, icon } = TYPE_CONFIG[transaction.type];

  const label = transaction.description ?? transaction.categoryName ?? 'Transaction';
  const amount = `${sign}${formatCurrency(transaction.amount, transaction.currency)}`;
  const dotColor = transaction.categoryColor ?? colors.bgMuted;

  return (
    <View style={styles.row}>
      <View style={[styles.iconWrap, { backgroundColor: bgColor }]}>
        <Text style={[styles.icon, { color }]}>{icon}</Text>
      </View>

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

      <View style={styles.rightCol}>
        <PrivacyAmount value={amount} color={color} size={fontSize.base} style={styles.amount} />
        {!hideDate && <Text style={styles.date}>{formatRelativeDate(transaction.date)}</Text>}
      </View>
    </View>
  );
}
