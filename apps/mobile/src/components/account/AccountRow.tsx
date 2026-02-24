import type { AccountType } from '@bit-chain/api-contracts';
import { StyleSheet, Text, View } from 'react-native';
import { PrivacyAmount } from '~/src/components/ui';
import { ACCOUNT_TYPE_META, ACCOUNT_TYPE_META_FALLBACK } from '~/src/constants/accountTypes';
import { colors, fontSize, fontWeight, radius, spacing } from '~/src/design/tokens';
import { formatCurrency } from '~/src/utils/format';

export interface AccountRowData {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  description?: string | null;
  isActive: boolean;
  transactionCount: number;
  color?: string | null;
  isMonobank: boolean;
}

interface AccountRowProps {
  account: AccountRowData;
}

export function AccountRow({ account }: AccountRowProps) {
  const meta = ACCOUNT_TYPE_META[account.type] ?? ACCOUNT_TYPE_META_FALLBACK;
  const color = account.color ?? meta.defaultColor;
  const balanceColor = account.balance < 0 ? colors.expense : colors.textPrimary;

  return (
    <View style={styles.row}>
      {/* Colour avatar */}
      <View style={[styles.avatar, { backgroundColor: `${color}20` }]}>
        <Text style={styles.avatarIcon}>{meta.icon}</Text>
      </View>

      {/* Name + type */}
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

      {/* Balance — respects privacy mode */}
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

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarIcon: {
    fontSize: fontSize.xl,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  name: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    flex: 1,
  },
  monobankTag: {
    backgroundColor: colors.brandSubtle,
    borderRadius: radius.xs,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  monobankText: {
    color: colors.brand,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  type: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  balanceWrap: {
    alignItems: 'flex-end',
    gap: 1,
    flexShrink: 0,
  },
  balance: {
    fontWeight: fontWeight.bold,
  },
  currency: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
});
