import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useAccounts } from '~/src/hooks/useAccounts';
import { Card, StatCard, LoadingScreen, ErrorScreen } from '~/src/components/ui';
import { colors, fontSize, fontWeight, radius, spacing } from '~/src/design/tokens';
import { formatCurrency } from '~/src/utils/format';

// Account type metadata (shared with AccountRow, extracted here for reuse)
const TYPE_META: Record<string, { label: string; icon: string; defaultColor: string }> = {
  BANK_CARD:  { label: 'Bank Card', icon: '💳', defaultColor: '#3b82f6' },
  CASH:       { label: 'Cash', icon: '💵', defaultColor: '#22c55e' },
  INVESTMENT: { label: 'Investment', icon: '📈', defaultColor: '#a855f7' },
  CRYPTO:     { label: 'Crypto', icon: '₿',  defaultColor: '#f59e0b' },
  SAVINGS:    { label: 'Savings', icon: '🏦', defaultColor: '#06b6d4' },
};

export default function AccountDetailScreen() {
  const { id }           = useLocalSearchParams<{ id: string }>();
  const navigation       = useNavigation();
  const { data, isLoading, error, refetch } = useAccounts();

  const account = data?.accounts.find((a) => a.id === id);

  // Update header title to the account name
  useEffect(() => {
    if (account?.name) {
      navigation.setOptions({ title: account.name });
    }
  }, [account?.name, navigation]);

  if (isLoading && !data) return <LoadingScreen />;
  if (error && !data)     return <ErrorScreen message="Failed to load accounts." onRetry={refetch} />;
  if (!account) {
    return (
      <ErrorScreen message={`Account not found.\nID: ${id}`} />
    );
  }

  const meta  = TYPE_META[account.type] ?? { label: account.type, icon: '💰', defaultColor: '#64748b' };
  const color = account.color ?? meta.defaultColor;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Identity card ─────────────────────── */}
        <Card padding="lg">
          <View style={[styles.avatar, { backgroundColor: `${color}20` }]}>
            <Text style={styles.avatarIcon}>{meta.icon}</Text>
          </View>
          <Text style={styles.accountName}>{account.name}</Text>
          <Text style={styles.accountType}>{meta.label}</Text>

          {account.description != null && (
            <Text style={styles.description}>{account.description}</Text>
          )}
        </Card>

        {/* ── Balance stats ─────────────────────── */}
        <View style={styles.statsRow}>
          <StatCard
            label="Balance"
            value={formatCurrency(account.balance, account.currency)}
            valueColor={account.balance < 0 ? colors.expense : colors.textPrimary}
            style={styles.statCard}
          />
          <StatCard
            label="Transactions"
            value={String(account.transactionCount)}
            style={styles.statCard}
          />
        </View>

        {/* ── Meta info ─────────────────────────── */}
        <Card padding="base">
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Currency</Text>
            <Text style={styles.metaValue}>{account.currency}</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Status</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: account.isActive ? colors.successSubtle : colors.bgMuted },
            ]}>
              <Text style={[
                styles.statusText,
                { color: account.isActive ? colors.success : colors.textMuted },
              ]}>
                {account.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
          {account.isMonobank && (
            <>
              <View style={styles.metaDivider} />
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Source</Text>
                <View style={styles.monobankTag}>
                  <Text style={styles.monobankText}>Monobank</Text>
                </View>
              </View>
            </>
          )}
        </Card>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: colors.bgBase,
  },
  scroll: {
    padding:       spacing.base,
    gap:           spacing.md,
    paddingBottom: spacing['5xl'],
  },

  // Identity card
  avatar: {
    width:          64,
    height:         64,
    borderRadius:   radius.xl,
    alignItems:     'center',
    justifyContent: 'center',
    marginBottom:   spacing.md,
  },
  avatarIcon: {
    fontSize: 28,
  },
  accountName: {
    color:      colors.textPrimary,
    fontSize:   fontSize['3xl'],
    fontWeight: fontWeight.bold,
  },
  accountType: {
    color:    colors.textMuted,
    fontSize: fontSize.base,
    marginTop: 2,
  },
  description: {
    color:    colors.textSecondary,
    fontSize: fontSize.base,
    marginTop: spacing.sm,
    lineHeight: fontSize.base * 1.5,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap:           spacing.md,
  },
  statCard: { flex: 1 },

  // Meta rows
  metaRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  metaDivider: {
    height:          StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  metaLabel: {
    color:    colors.textMuted,
    fontSize: fontSize.base,
  },
  metaValue: {
    color:      colors.textPrimary,
    fontSize:   fontSize.base,
    fontWeight: fontWeight.medium,
  },
  statusBadge: {
    borderRadius:    radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical:   2,
  },
  statusText: {
    fontSize:   fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  monobankTag: {
    backgroundColor: colors.brandSubtle,
    borderRadius:    radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical:   2,
  },
  monobankText: {
    color:      colors.brand,
    fontSize:   fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
});
