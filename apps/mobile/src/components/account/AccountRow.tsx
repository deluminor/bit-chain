import { Text, View } from 'react-native';
import { PrivacyAmount } from '~/src/components/ui';
import { ACCOUNT_TYPE_META, ACCOUNT_TYPE_META_FALLBACK } from '~/src/constants/accountTypes';
import { colors, fontSize } from '~/src/design/tokens';
import { formatCurrency } from '~/src/utils/format';
import { rowStyles as styles } from './_styles';
import type { AccountRowProps } from './_types';

export type { AccountRowData } from './_types';

export function AccountRow({ account }: AccountRowProps) {
  const meta = ACCOUNT_TYPE_META[account.type] ?? ACCOUNT_TYPE_META_FALLBACK;
  const color = account.color ?? meta.defaultColor;
  const balanceColor = account.balance < 0 ? colors.expense : colors.textPrimary;

  return (
    <View style={styles.row}>
      <View style={[styles.avatar, { backgroundColor: `${color}20` }]}>
        <Text style={styles.avatarIcon}>{meta.icon}</Text>
      </View>

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {account.name}
          </Text>
          {account.isMonobank && (
            <View style={styles.monobankTag}>
              <Text style={styles.monobankText}>Mono</Text>
            </View>
          )}
        </View>
        <Text style={styles.type}>
          {meta.label} · {account.transactionCount} txns
        </Text>
      </View>

      <View style={styles.balanceWrap}>
        <PrivacyAmount
          value={formatCurrency(account.balance, account.currency)}
          color={balanceColor}
          size={fontSize.base}
          style={styles.balance}
        />
        <Text style={styles.currency}>{account.currency}</Text>
      </View>
    </View>
  );
}
