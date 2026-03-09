import type { RecentTransaction } from '@bit-chain/api-contracts';
import type { TransactionRowData } from '~/src/components/transaction/TransactionRow';
import { Pressable, Text } from 'react-native';
import { styles } from './_styles';

export function toRowData(tx: RecentTransaction): TransactionRowData {
  return {
    id: tx.id,
    amount: tx.amount,
    type: tx.type,
    description: tx.description,
    date: tx.date,
    currency: tx.currency,
    accountName: tx.accountName,
    categoryName: tx.categoryName,
  };
}

export function MonobankBanner({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={styles.monobankBanner} onPress={onPress}>
      <Text style={styles.bannerTitle}>Connect Monobank</Text>
      <Text style={styles.bannerSubtitle}>Import your transactions automatically →</Text>
    </Pressable>
  );
}
