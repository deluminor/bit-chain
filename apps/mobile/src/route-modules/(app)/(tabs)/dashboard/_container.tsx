import { MonobankBanner, toRowData } from '@/route-modules/(app)/(tabs)/dashboard/_components';
import { QUICK_ACTIONS } from '@/route-modules/(app)/(tabs)/dashboard/_constants';
import { styles } from '@/route-modules/(app)/(tabs)/dashboard/_styles';
import { Tabs, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { TransactionRow } from '~/src/components/transaction/TransactionRow';
import {
  Card,
  ComparisonLineChartWidget,
  ErrorScreen,
  LineChartWidget,
  LoadingScreen,
  PrivacyAmount,
  ProgressBar,
  SectionHeader,
  Separator,
  SyncButton,
  type ActiveLineChartPoint,
} from '~/src/components/ui';
import { colors } from '~/src/design/tokens';
import { useBudgets } from '~/src/hooks/useBudgets';
import { useConvertedStats } from '~/src/hooks/useConvertedStats';
import {
  useDashboard,
  useDashboardExpensesTrend,
  useDashboardHistory,
} from '~/src/hooks/useDashboard';
import {
  useCurrentMonthBudgets,
  useDashboardBudgetLimitStatus,
  useDashboardExpenseComparison,
  useDashboardExpenseTrendStats,
  useDashboardTotalInBase,
  useDashboardTrendPoints,
  useDashboardTrendStats,
} from '~/src/hooks/useDashboardCharts';
import { useMonobankSync } from '~/src/hooks/useMonobank';
import { BASE_CURRENCY, useCurrencyStore } from '~/src/lib/currency';
import { getPeriodLabel, getPeriodRange, usePeriodStore } from '~/src/lib/period';
import { usePrivacyStore } from '~/src/lib/privacy';
import { formatCurrency, formatRelativeDate, formatShortDate } from '~/src/utils/format';

export default function DashboardScreen() {
  const period = usePeriodStore(s => s.period);
  const dateRange = useMemo(() => getPeriodRange(period), [period]);
  const periodLabel = getPeriodLabel(period);

  const { data, isLoading, error, refetch, isRefetching } = useDashboard({
    dateFrom: dateRange.dateFrom,
    dateTo: dateRange.dateTo,
  });
  const { data: historyData, refetch: refetchHistory } = useDashboardHistory();
  const { data: expensesTrendData, refetch: refetchExpensesTrend } = useDashboardExpensesTrend();
  const { data: budgetsData } = useBudgets();
  const { mutate: sync, isPending: isSyncing } = useMonobankSync();
  const router = useRouter();
  const baseCurrency = useCurrencyStore(s => s.baseCurrency);
  const isPrivate = usePrivacyStore(s => s.isPrivate);
  const [activeTrendPoint, setActiveTrendPoint] = useState<ActiveLineChartPoint | null>(null);
  const [isTrendDragging, setIsTrendDragging] = useState(false);

  const totalInBase = useDashboardTotalInBase(data);
  const trendPoints = useDashboardTrendPoints(historyData, totalInBase);
  const currentMonthBudgets = useCurrentMonthBudgets(budgetsData);
  const {
    points: expenseComparisonPoints,
    budgetLimit: expenseBudgetLimit,
    setActivePoint: setActiveExpensePoint,
    activeExpensePoint,
  } = useDashboardExpenseComparison(expensesTrendData, currentMonthBudgets);
  const trendStats = useDashboardTrendStats(trendPoints, totalInBase, activeTrendPoint);
  const expenseTrendStats = useDashboardExpenseTrendStats(
    expenseComparisonPoints,
    expensesTrendData,
    activeExpensePoint,
  );
  const budgetLimitStatus = useDashboardBudgetLimitStatus(
    expenseBudgetLimit,
    expenseTrendStats.currentTotal,
  );

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
    refetchExpensesTrend();
    sync(
      {},
      {
        onError: err => {
          if (__DEV__) {
            console.warn(
              '[Dashboard] Monobank sync on pull-to-refresh failed:',
              err?.message ?? err,
            );
          }
        },
      },
    );
  }, [refetch, refetchHistory, refetchExpensesTrend, sync]);

  // Stats are already converted to baseCurrency by useConvertedStats
  const netFlowValue = convertedStats.netFlow || 0;
  const netFlow = data?.periodStats ? formatCurrency(netFlowValue, baseCurrency) : '—';

  const lastSync = data?.monobank.lastSyncAt ? formatRelativeDate(data.monobank.lastSyncAt) : null;

  if (isLoading && !data) return <LoadingScreen />;
  if (error && !data) return <ErrorScreen message="Failed to load dashboard." onRetry={refetch} />;

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
        scrollEnabled={!isTrendDragging}
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

        {/* <Card style={styles.heroCard} padding="lg">
          <Text style={styles.heroLabel}>Total Value</Text>
          <PrivacyAmount value={totalBalance} style={styles.heroValue} />
          <Text style={styles.heroMeta}>
            {data?.totalAccounts ?? 0} active {data?.totalAccounts === 1 ? 'account' : 'accounts'}
          </Text>
        </Card> */}

        <Card padding="md">
          <View style={styles.trendHeader}>
            <Text style={styles.trendTitle}>Net Worth Trend</Text>
            {trendStats.showPct && (
              <View
                style={[
                  styles.trendBadge,
                  trendStats.isOverallPositive ? styles.trendBadgeUp : styles.trendBadgeDown,
                ]}
              >
                <Text
                  style={[
                    styles.trendBadgeText,
                    { color: trendStats.isOverallPositive ? colors.income : colors.expense },
                  ]}
                >
                  {trendStats.isOverallPositive ? '↑' : '↓'}{' '}
                  {Math.abs(trendStats.overallChangePct).toFixed(1)}%
                </Text>
              </View>
            )}
          </View>

          <View style={styles.trendValues}>
            <PrivacyAmount
              value={formatCurrency(trendStats.focusedVal, baseCurrency)}
              style={styles.trendCurrentValue}
            />
            {trendStats.showPct && trendStats.focusedChangeAbs !== 0 && (
              <Text
                style={[
                  styles.trendChange,
                  { color: trendStats.isFocusedPositive ? colors.income : colors.expense },
                ]}
              >
                {trendStats.isFocusedPositive ? '+' : ''}
                {formatCurrency(trendStats.focusedChangeAbs, baseCurrency)}
              </Text>
            )}
          </View>
          <Text style={styles.trendHint}>Drag on the chart to inspect any point in time</Text>

          {/* Chart */}
          <LineChartWidget
            points={trendPoints}
            height={150}
            lineColor={
              trendStats.hasData && !trendStats.isOverallPositive ? colors.expense : colors.brand
            }
            onActivePointChange={setActiveTrendPoint}
            onInteractionChange={setIsTrendDragging}
          />

          {trendStats.hasData && (
            <View style={styles.trendFooter}>
              <Text style={styles.trendMinMax}>
                {formatCurrency(trendStats.firstVal, baseCurrency)}
              </Text>
              <Text style={styles.trendPeriodLabel}>{trendStats.activeLabel}</Text>
              <Text style={styles.trendMinMax}>
                {formatCurrency(trendStats.latestVal, baseCurrency)}
              </Text>
            </View>
          )}
        </Card>

        <Card padding="md">
          <View style={styles.expensesTrendHeader}>
            <Text style={styles.expensesTrendTitle}>Monthly Expenses Trend</Text>
            <Text style={styles.expensesTrendSubtitle}>
              {expenseTrendStats.currentMonthLabel} vs {expenseTrendStats.previousMonthLabel}
            </Text>
          </View>

          <View style={styles.expensesTrendValues}>
            <PrivacyAmount
              value={formatCurrency(expenseTrendStats.currentTotal, baseCurrency)}
              style={styles.expensesTrendCurrentValue}
            />
            {expenseTrendStats.hasData && expenseTrendStats.delta !== 0 && (
              <Text
                style={[
                  styles.expensesTrendDelta,
                  {
                    color: expenseTrendStats.isHigherThanPrevious ? colors.expense : colors.income,
                  },
                ]}
              >
                {expenseTrendStats.isHigherThanPrevious ? '+' : '-'}
                {formatCurrency(Math.abs(expenseTrendStats.delta), baseCurrency)}
                {expenseTrendStats.deltaPct !== null &&
                  ` (${Math.abs(expenseTrendStats.deltaPct).toFixed(1)}%)`}
              </Text>
            )}
          </View>

          <Text style={styles.expensesTrendMeta}>
            {expenseTrendStats.currentMonthLabel} ({expenseTrendStats.currentPointLabel}):{' '}
            {formatCurrency(expenseTrendStats.currentTotal, baseCurrency)} ·{' '}
            {expenseTrendStats.previousMonthLabel} ({expenseTrendStats.previousPointLabel}):{' '}
            {formatCurrency(expenseTrendStats.previousTotal, baseCurrency)}
          </Text>

          {expenseBudgetLimit !== null && (
            <View style={styles.expensesBudgetLimitRow}>
              <Text style={styles.expensesBudgetLimitLabel}>
                Budget limit:{' '}
                {isPrivate ? '••••' : formatCurrency(expenseBudgetLimit, baseCurrency)}
              </Text>
              <Text
                style={[
                  styles.expensesBudgetLimitStatus,
                  budgetLimitStatus?.isOverLimit
                    ? styles.expensesBudgetLimitOver
                    : budgetLimitStatus?.isApproaching
                      ? styles.expensesBudgetLimitApproaching
                      : null,
                ]}
              >
                {budgetLimitStatus
                  ? budgetLimitStatus.isOverLimit
                    ? isPrivate
                      ? 'Over limit'
                      : `Over by ${formatCurrency(expenseTrendStats.currentTotal - expenseBudgetLimit, baseCurrency)}`
                    : budgetLimitStatus.isApproaching
                      ? `Approaching (${budgetLimitStatus.usagePercent.toFixed(0)}% used)`
                      : `${budgetLimitStatus.usagePercent.toFixed(0)}% used`
                  : '—'}
              </Text>
            </View>
          )}

          {expenseTrendStats.hasData ? (
            <ComparisonLineChartWidget
              points={expenseComparisonPoints}
              height={150}
              referenceValue={expenseBudgetLimit}
              referenceLineColor="rgba(239, 68, 68, 0.45)"
              onActivePointChange={setActiveExpensePoint}
              onInteractionChange={setIsTrendDragging}
            />
          ) : (
            <Text style={styles.emptyText}>No expense trend data yet</Text>
          )}

          {expenseTrendStats.hasData && (
            <View style={styles.expensesTrendLegendRow}>
              <View style={styles.expensesTrendLegendGroup}>
                <View style={styles.expensesTrendLegendItem}>
                  <View style={styles.expensesTrendLegendLineCurrent} />
                  <Text style={styles.expensesTrendLegendLabel}>
                    {expenseTrendStats.currentMonthLabel}
                  </Text>
                </View>
                <View style={styles.expensesTrendLegendItem}>
                  <View style={styles.expensesTrendLegendLinePrevious} />
                  <Text style={styles.expensesTrendLegendLabel}>
                    {expenseTrendStats.previousMonthLabel}
                  </Text>
                </View>
                {expenseBudgetLimit !== null && (
                  <View style={styles.expensesTrendLegendItem}>
                    <View style={styles.expensesTrendLegendLineBudget} />
                    <Text style={styles.expensesTrendLegendLabel}>Budget limit</Text>
                  </View>
                )}
              </View>
            </View>
          )}
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

        {currentMonthBudgets.length > 0 && (
          <>
            <SectionHeader
              title="Budget"
              actionLabel="View"
              onAction={() =>
                router.push({
                  pathname: '/budget/[id]',
                  params: { id: currentMonthBudgets[0]!.id },
                })
              }
            />
            <Card padding="sm">
              {currentMonthBudgets.map((budget, budgetIdx) => (
                <View key={budget.id}>
                  {budgetIdx > 0 && <Separator />}
                  <Text style={styles.budgetPeriod}>
                    {formatShortDate(budget.startDate)} – {formatShortDate(budget.endDate)}
                  </Text>
                  {[...budget.categories]
                    .sort((a, b) => b.plannedBase - a.plannedBase)
                    .map((cat, idx) => {
                      const catProgress =
                        cat.plannedBase > 0
                          ? Math.min((cat.actualBase / cat.plannedBase) * 100, 100)
                          : 0;
                      const catOver = cat.actualBase > cat.plannedBase;
                      return (
                        <Pressable
                          key={cat.id}
                          onPress={() =>
                            router.push({
                              pathname: '/budget/[id]/category/[categoryId]',
                              params: { id: budget.id, categoryId: cat.categoryId },
                            })
                          }
                        >
                          <View style={styles.budgetCatRow}>
                            <View style={styles.budgetCatInfo}>
                              <Text style={styles.budgetCatIcon}>📁</Text>
                              <Text style={styles.budgetCatName} numberOfLines={1}>
                                {cat.category.name}
                              </Text>
                            </View>
                            <View style={styles.budgetCatAmounts}>
                              <PrivacyAmount
                                value={formatCurrency(cat.actualBase, BASE_CURRENCY)}
                                style={[
                                  styles.budgetCatSpent,
                                  catOver && styles.budgetCatOverSpent,
                                ]}
                                color={catOver ? colors.expense : colors.textPrimary}
                              />
                              <Text style={styles.budgetCatPlanned}>/</Text>
                              <PrivacyAmount
                                value={formatCurrency(cat.plannedBase, BASE_CURRENCY)}
                                style={styles.budgetCatPlanned}
                                color={colors.textMuted}
                              />
                            </View>
                          </View>
                          <View style={styles.budgetCatProgressWrap}>
                            <ProgressBar
                              progress={catProgress}
                              color={catOver ? colors.expense : cat.category.color || colors.brand}
                              height={6}
                            />
                          </View>
                          {idx < budget.categories.length - 1 && <Separator />}
                        </Pressable>
                      );
                    })}
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
