import type { MonobankAccount } from '@bit-chain/api-contracts';
import { Switch, Text, View } from 'react-native';
import { colors } from '~/src/design/tokens';
import { formatCurrency } from '~/src/utils/format';
import { accountsStyles as styles } from './_styles';

export function MonobankAccountRow({
  account,
  onToggle,
  isPending,
}: {
  account: MonobankAccount;
  onToggle: (id: string, enabled: boolean) => void;
  isPending: boolean;
}) {
  const balance = formatCurrency(account.balance / 100, account.currency);

  return (
    <View style={styles.accountRow}>
      <View style={styles.accountInfo}>
        <Text style={styles.accountName} numberOfLines={1}>
          {account.name}
        </Text>
        <Text style={styles.accountMeta}>
          {account.currency} · {balance}
        </Text>
        {account.maskedPan.length > 0 && (
          <Text style={styles.accountPan}>{account.maskedPan[0]}</Text>
        )}
      </View>
      <Switch
        value={account.importEnabled}
        onValueChange={value => onToggle(account.id, value)}
        disabled={isPending}
        trackColor={{ false: colors.bgMuted, true: colors.brandDim }}
        thumbColor={account.importEnabled ? '#93c5fd' : colors.textMuted}
        ios_backgroundColor={colors.bgMuted}
      />
    </View>
  );
}
