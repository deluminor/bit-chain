import type { RecentTransaction } from '@bit-chain/api-contracts';
import { Tabs, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  TransactionRow,
  type TransactionRowData,
} from '~/src/components/transaction/TransactionRow';
import {
  ArcGauge,
  BarChartWidget,
  Card,
  ErrorScreen,
  LineChartWidget,
  LoadingScreen,
  PrivacyAmount,
  SectionHeader,
  Separator,
} from '~/src/components/ui';
import { colors } from '~/src/design/tokens';
import { useConvertedStats } from '~/src/hooks/useConvertedStats';
import { useDashboard } from '~/src/hooks/useDashboard';
import { useMonobankSync } from '~/src/hooks/useMonobank';
import { convertCurrency, useCurrencyStore } from '~/src/lib/currency';
import { getPeriodLabel, getPeriodRange, usePeriodStore } from '~/src/lib/period';
import { formatCurrency, formatRelativeDate } from '~/src/utils/format';
import { QUICK_ACTIONS } from './constants';
import { styles } from './styles';

function toRowData(tx: RecentTransaction): TransactionRowData {
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

function MonobankBanner({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={styles.monobankBanner} onPress={onPress}>
      <View>
        <Text style={styles.bannerTitle}>Connect Monobank</Text>
        <Text style={styles.bannerSubtitle}>Import your transactions automatically →</Text>
      </View>
    </Pressable>
  );
}

function SyncButton({ isSyncing, onPress }: { isSyncing: boolean; onPress: () => void }) {
  return (
    <Pressable
      style={[styles.syncBtn, isSyncing && styles.syncBtnDisabled]}
      onPress={onPress}
      disabled={isSyncing}
    >
      <Text style={styles.syncBtnText}>{isSyncing ? '…' : '↻'}</Text>
    </Pressable>
  );
}

export default function DashboardScreen() {
  const period = usePeriodStore(s => s.period);
  const dateRange = useMemo(() => getPeriodRange(period), [period]);
  const periodLabel = getPeriodLabel(period);

  const { data, isLoading, error, refetch, isRefetching } = useDashboard({
    dateFrom: dateRange.dateFrom,
    dateTo: dateRange.dateTo,
  });
  const { mutate: sync, isPending: isSyncing } = useMonobankSync();
  const router = useRouter();
  const baseCurrency = useCurrencyStore(s => s.baseCurrency);
  const [totalInBase, setTotalInBase] = useState<number | null>(null);

  const convertedStats = useConvertedStats(data?.periodStats ?? null);
  const insets = useSafeAreaInsets();

  const handleSync = () => {
    sync(
      {},
      {
        onSuccess: result => {
          if (result.synced) {
            Alert.alert('Synced ✓', `Imported ${result.imported} new transactions.`);
          } else {
            Alert.alert('Up to date', 'No new transactions found.');
          }
        },
        onError: err => {
          const msg =
            err.message === 'RATE_LIMITED'
              ? 'Please wait 65 seconds before syncing again.'
              : 'Could not sync Monobank data. Try again later.';
          Alert.alert('Sync failed', msg);
        },
      },
    );
  };

  const refetchCb = useCallback(() => {
    refetch();
    sync({}, { onError: () => {} }); // trigger sync silently
  }, [refetch, sync]);

  // Recalculate total balance across all currencies using FX rates so that
  // the hero Total Balance matches the same logic as on the web.
  // NOTE: must be declared before any early returns to satisfy Rules of Hooks.
  useEffect(() => {
    let isMounted = true;

    const recompute = async () => {
      if (!data || data.balances.length === 0) {
        if (isMounted) setTotalInBase(0);
        return;
      }

      let sum = 0;
      for (const b of data.balances) {
        sum += await convertCurrency(b.totalBalance, b.currency, baseCurrency);
      }

      if (isMounted) {
        setTotalInBase(sum);
      }
    };

    void recompute();

    return () => {
      isMounted = false;
    };
  }, [data, baseCurrency]);

  if (isLoading && !data) return <LoadingScreen />;
  if (error && !data) return <ErrorScreen message="Failed to load dashboard." onRetry={refetch} />;

  const totalBalance = totalInBase != null ? formatCurrency(totalInBase, baseCurrency) : '—';

  // Stats are already converted to baseCurrency by useConvertedStats
  const incomeVal = convertedStats.income || 0;
  const expensesVal = convertedStats.expenses || 0;
  const netFlowValue = convertedStats.netFlow || 0;
  const netFlow = data?.periodStats ? formatCurrency(netFlowValue, baseCurrency) : '—';

  // Chart Data Preparation
  const barChartData = [
    { label: 'Inc', value: incomeVal },
    { label: 'Exp', value: expensesVal },
    { label: 'Net', value: Math.max(0, netFlowValue) },
  ];

  const totalArc = incomeVal + expensesVal || 1;
  const arcSegments: { value: number; color: string; label: string }[] = [
    { value: incomeVal, color: colors.income, label: 'Income' },
    { value: expensesVal, color: colors.expense, label: 'Expenses' },
  ].filter(s => s.value > 0);

  // Fallback for empty state
  if (arcSegments.length === 0) {
    arcSegments.push({ value: 1, color: colors.bgMuted, label: 'No Data' });
  }

  // Mock static sparkline data based on netflow trend
  const sparklineData =
    netFlowValue > 0
      ? [20, 35, 25, 60, 45, 80, 75]
      : netFlowValue < 0
        ? [80, 60, 75, 45, 30, 40, 20]
        : [40, 40, 40, 40, 40, 40, 40];
  const netTrend: 'up' | 'down' | 'neutral' = netFlowValue >= 0 ? 'up' : 'down';

  const lastSync = data?.monobank.lastSyncAt ? formatRelativeDate(data.monobank.lastSyncAt) : null;

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Tabs.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { paddingTop: insets.top - 14 }]}>
        <View>
          <Text style={styles.headerTitleText}>Dashboard</Text>
          <Text style={styles.headerSubtitleText}>{periodLabel}</Text>
        </View>
        <View style={styles.headerActions}>
          <SyncButton isSyncing={isSyncing} onPress={handleSync} />
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching || isSyncing}
            onRefresh={refetchCb}
            tintColor={colors.brand}
          />
        }
        contentContainerStyle={styles.scroll}
      >
        {data && !data.monobank.connected && (
          <MonobankBanner onPress={() => router.push('/(app)/monobank/connect')} />
        )}

        <Card style={styles.heroCard} padding="lg">
          <Text style={styles.heroLabel}>Total Value</Text>
          <PrivacyAmount value={totalBalance} style={styles.heroValue} />
          <Text style={styles.heroMeta}>
            {data?.totalAccounts ?? 0} active {data?.totalAccounts === 1 ? 'account' : 'accounts'}
          </Text>
        </Card>

        {/* Portfolio Performance */}
        <Card padding="md">
          <Text style={[styles.heroLabel, { marginBottom: 16 }]}>Portfolio Performance</Text>
          <BarChartWidget data={barChartData} height={120} barColor={colors.brand} />
        </Card>

        {/* Asset Allocation & Market Update Row */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Card padding="md" style={{ flex: 1, alignItems: 'center' }}>
            <Text style={[styles.heroLabel, { marginBottom: 12, alignSelf: 'flex-start' }]}>
              Cash Flow
            </Text>
            <ArcGauge
              segments={arcSegments}
              size={130}
              strokeWidth={12}
              title={netFlow}
              subtitle="Net Flow"
            />
          </Card>

          <Card padding="md" style={{ flex: 1 }}>
            <Text style={[styles.heroLabel, { marginBottom: 12 }]}>Market Trend</Text>
            <LineChartWidget data={sparklineData} height={100} lineColor={colors.income} />
          </Card>
        </View>

        <View>
          <SectionHeader title="Quick Actions" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsRow}
          >
            {QUICK_ACTIONS.map(action => (
              <Pressable
                key={action.id}
                style={styles.quickActionCard}
                onPress={() => router.push(action.route)}
              >
                <View style={styles.quickActionIconWrap}>
                  <Text style={styles.quickActionIcon}>{action.icon}</Text>
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {data && data.balances.length > 1 && (
          <>
            <SectionHeader title="By Currency" />
            <Card padding="sm">
              {data.balances.map((b, idx) => (
                <View key={b.currency}>
                  <View style={styles.balanceRow}>
                    <Text style={styles.balanceCurrency}>{b.currency}</Text>
                    <Text style={styles.balanceAccounts}>
                      {b.accountCount} {b.accountCount === 1 ? 'account' : 'accounts'}
                    </Text>
                    <PrivacyAmount
                      value={formatCurrency(b.totalBalance, b.currency)}
                      style={styles.balanceAmount}
                    />
                  </View>
                  {idx < data.balances.length - 1 && <Separator />}
                </View>
              ))}
            </Card>
          </>
        )}

        <SectionHeader
          title="Recent Transactions"
          actionLabel="See all"
          onAction={() => router.push('/(app)/(tabs)/transactions')}
        />

        {data && data.recentTransactions.length === 0 ? (
          <Card padding="lg">
            <Text style={styles.emptyText}>No transactions yet</Text>
          </Card>
        ) : (
          <Card padding="sm">
            {data?.recentTransactions.map((tx, idx) => (
              <View key={tx.id}>
                <Pressable
                  onPress={() =>
                    router.push({ pathname: '/transaction/edit', params: { id: tx.id } })
                  }
                >
                  <TransactionRow transaction={toRowData(tx)} />
                </Pressable>
                {idx < (data?.recentTransactions.length ?? 0) - 1 && <Separator />}
              </View>
            ))}
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
