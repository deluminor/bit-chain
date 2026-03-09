import type { MonobankAccount } from '@bit-chain/api-contracts';
import { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, EmptyState, ErrorScreen, LoadingScreen } from '~/src/components/ui';
import { colors } from '~/src/design/tokens';
import { useMonobankAccountsUpdate, useMonobankStatus } from '~/src/hooks/useMonobank';
import { MonobankAccountRow } from '@/route-modules/(app)/monobank/_components';
import { accountsStyles as styles } from '@/route-modules/(app)/monobank/_styles';

export default function MonobankAccountsScreen() {
  const { data, isLoading, error, refetch } = useMonobankStatus();
  const { mutate: updateAccounts, isPending } = useMonobankAccountsUpdate();

  const [localAccounts, setLocalAccounts] = useState<MonobankAccount[] | null>(null);
  const accounts = localAccounts ?? data?.accounts ?? [];

  const handleToggle = (accountId: string, importEnabled: boolean) => {
    const optimistic = accounts.map(a => (a.id === accountId ? { ...a, importEnabled } : a));
    setLocalAccounts(optimistic);

    updateAccounts(
      { accounts: [{ accountId, importEnabled }] },
      {
        onSuccess: result => {
          setLocalAccounts(result.accounts);
        },
        onError: () => {
          setLocalAccounts(
            accounts.map(a => (a.id === accountId ? { ...a, importEnabled: !importEnabled } : a)),
          );
          Alert.alert('Update failed', 'Could not save the change. Please try again.');
        },
      },
    );
  };

  if (isLoading && !data) return <LoadingScreen />;
  if (error && !data) return <ErrorScreen message="Failed to load accounts." onRetry={refetch} />;
  if (accounts.length === 0) {
    return (
      <EmptyState
        icon="🏦"
        title="No accounts linked"
        description="Connect Monobank first to see your accounts here."
      />
    );
  }

  const enabledCount = accounts.filter(a => a.importEnabled).length;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={accounts}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>
              {enabledCount} of {accounts.length}{' '}
              {accounts.length === 1 ? 'account' : 'accounts'} imported
            </Text>
            {isPending && <ActivityIndicator size="small" color={colors.brand} />}
          </View>
        }
        renderItem={({ item }) => (
          <Card padding="base" style={styles.card}>
            <MonobankAccountRow account={item} onToggle={handleToggle} isPending={isPending} />
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}
