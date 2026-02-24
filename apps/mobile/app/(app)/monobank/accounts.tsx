/**
 * Monobank Accounts screen — toggle which accounts are imported into the app.
 * Uses optimistic updates to give instant feedback on Switch toggles.
 */

import { useMonobankAccountsUpdate, useMonobankStatus } from '~/src/hooks/useMonobank';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import type { MonobankAccount } from '@bit-chain/api-contracts';
import { Card, LoadingScreen, ErrorScreen, EmptyState } from '~/src/components/ui';
import { colors, fontSize, fontWeight, radius, spacing } from '~/src/design/tokens';
import { formatCurrency } from '~/src/utils/format';

// ─── Account row ─────────────────────────────────────────────────────────────

interface MonobankAccountRowProps {
  account:   MonobankAccount;
  onToggle:  (id: string, enabled: boolean) => void;
  isPending: boolean;
}

function MonobankAccountRow({ account, onToggle, isPending }: MonobankAccountRowProps) {
  // Monobank returns balance in minor units (e.g. kopiykas)
  const balance = formatCurrency(account.balance / 100, account.currency);

  return (
    <View style={styles.accountRow}>
      {/* Account info */}
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

      {/* Import toggle */}
      <Switch
        value={account.importEnabled}
        onValueChange={(value) => onToggle(account.id, value)}
        disabled={isPending}
        trackColor={{ false: colors.bgMuted, true: colors.brandDim }}
        thumbColor={account.importEnabled ? '#93c5fd' : colors.textMuted}
        ios_backgroundColor={colors.bgMuted}
      />
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function MonobankAccountsScreen() {
  const { data, isLoading, error, refetch }  = useMonobankStatus();
  const { mutate: updateAccounts, isPending } = useMonobankAccountsUpdate();

  // Local optimistic state — server data is the fallback
  const [localAccounts, setLocalAccounts] = useState<MonobankAccount[] | null>(null);
  const accounts = localAccounts ?? data?.accounts ?? [];

  const handleToggle = (accountId: string, importEnabled: boolean) => {
    // Apply optimistic update immediately
    const optimistic = accounts.map((a) =>
      a.id === accountId ? { ...a, importEnabled } : a
    );
    setLocalAccounts(optimistic);

    updateAccounts(
      { accounts: [{ accountId, importEnabled }] },
      {
        onSuccess: (result) => {
          // Sync with confirmed server state
          setLocalAccounts(result.accounts);
        },
        onError: () => {
          // Revert to the state before the toggle
          setLocalAccounts(
            accounts.map((a) =>
              a.id === accountId ? { ...a, importEnabled: !importEnabled } : a
            )
          );
          Alert.alert('Update failed', 'Could not save the change. Please try again.');
        },
      }
    );
  };

  if (isLoading && !data) return <LoadingScreen />;
  if (error && !data)     return <ErrorScreen message="Failed to load accounts." onRetry={refetch} />;
  if (accounts.length === 0) {
    return (
      <EmptyState
        icon="🏦"
        title="No accounts linked"
        description="Connect Monobank first to see your accounts here."
      />
    );
  }

  const enabledCount = accounts.filter((a) => a.importEnabled).length;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>
              {enabledCount} of {accounts.length}{' '}
              {accounts.length === 1 ? 'account' : 'accounts'} imported
            </Text>
            {isPending && (
              <ActivityIndicator size="small" color={colors.brand} />
            )}
          </View>
        }
        renderItem={({ item }) => (
          <Card padding="base" style={styles.card}>
            <MonobankAccountRow
              account={item}
              onToggle={handleToggle}
              isPending={isPending}
            />
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: colors.bgBase,
  },
  list: {
    padding:       spacing.base,
    paddingBottom: spacing['5xl'],
  },

  // Summary row
  summaryRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    paddingVertical:   spacing.md,
    paddingHorizontal: spacing.xs,
    marginBottom:   spacing.sm,
  },
  summaryText: {
    color:    colors.textMuted,
    fontSize: fontSize.sm,
  },

  // Account card
  card: {
    borderRadius: radius.lg,
  },
  separator: {
    height: spacing.sm,
  },

  // Account row content
  accountRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    gap:            spacing.md,
  },
  accountInfo: { flex: 1 },
  accountName: {
    color:      colors.textPrimary,
    fontSize:   fontSize.md,
    fontWeight: fontWeight.medium,
  },
  accountMeta: {
    color:    colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  accountPan: {
    color:    colors.textDisabled,
    fontSize: fontSize.xs,
    marginTop: 2,
    fontFamily: 'monospace',
  },
});
