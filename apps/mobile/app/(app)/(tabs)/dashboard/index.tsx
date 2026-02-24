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
import { useDashboard, useDashboardHistory } from '~/src/hooks/useDashboard';
import { useMonobankSync } from '~/src/hooks/useMonobank';
import { convertCurrency, useCurrencyStore } from '~/src/lib/currency';
import { getPeriodLabel, getPeriodRange, usePeriodStore } from '~/src/lib/period';
import { formatCurrency, formatRelativeDate } from '~/src/utils/format';
import { QUICK_ACTIONS } from './_constants';
import { styles } from './_styles';

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
  const { data: historyData, refetch: refetchHistory } = useDashboardHistory();
  const { mutate: sync, isPending: isSyncing } = useMonobankSync();
  const router = useRouter();
  const baseCurrency = useCurrencyStore(s => s.baseCurrency);
  const [totalInBase, setTotalInBase] = useState<number | null>(null);
  const [sparklineData, setSparklineData] = useState<number[]>([0, 0]);

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
    refetchHistory();
    sync({}, { onError: () => {} }); // trigger sync silently
  }, [refetch, refetchHistory, sync]);

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

  // Recalculate historical balances into base currency for Market Trend
  useEffect(() => {
    let isMounted = true;

    const recomputeHistory = async () => {
      if (!historyData?.history || historyData.history.length === 0) {
        if (isMounted) setSparklineData([0, 0]);
        return;
      }

      const pts: number[] = [];
      for (const point of historyData.history) {
        let total = 0;
        for (const [curr, balance] of Object.entries(point.balances || {})) {
          total += (await convertCurrency(balance as number, curr, baseCurrency)) || 0;
        }
        pts.push(total);
      }

      if (isMounted) {
        // Ensure it starts from 0 based on user request to show the full growth from nothing
        if (pts.length > 0 && pts[0] !== 0) {
          pts.unshift(0);
        }
        // LineChartWidget needs at least 2 points
        setSparklineData(pts.length > 1 ? pts : [0, ...pts]);
      }
    };

    void recomputeHistory();

    return () => {
      isMounted = false;
    };
  }, [historyData, baseCurrency]);

  if (isLoading && !data) return <LoadingScreen />;
  if (error && !data) return <ErrorScreen message="Failed to load dashboard." onRetry={refetch} />;

  const totalBalance = totalInBase != null ? formatCurrency(totalInBase, baseCurrency) : '—';

  // Stats are already converted to baseCurrency by useConvertedStats
  const netFlowValue = convertedStats.netFlow || 0;
  const netFlow = data?.periodStats ? formatCurrency(netFlowValue, baseCurrency) : '—';

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

        {/* Market Trend */}
        <Card padding="md">
          <Text style={[styles.heroLabel, { marginBottom: 16 }]}>Total Value Trend</Text>
          <LineChartWidget data={sparklineData} height={120} lineColor={colors.brand} />
        </Card>

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
