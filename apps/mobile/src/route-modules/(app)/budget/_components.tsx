import { Text, View } from 'react-native';
import { styles } from './_styles';

export function BudgetEmptyState() {
  return (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyIcon}>💸</Text>
      <Text style={styles.emptyTitle}>No budgets yet</Text>
      <Text style={styles.emptyMessage}>Create a budget to better track your spending goals.</Text>
    </View>
  );
}
