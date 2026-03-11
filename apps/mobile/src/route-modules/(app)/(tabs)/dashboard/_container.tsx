import { MonobankBanner, toRowData } from '@/route-modules/(app)/(tabs)/dashboard/_components';
import { QUICK_ACTIONS } from '@/route-modules/(app)/(tabs)/dashboard/_constants';
import { styles } from '@/route-modules/(app)/(tabs)/dashboard/_styles';
import { Tabs, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  SectionHeader,
  Separator,
  SyncButton,
  type ActiveComparisonLineChartPoint,
  type ActiveLineChartPoint,
  type ComparisonLineChartPoint,
  type LineChartPoint,
} from '~/src/components/ui';
import { colors } from '~/src/design/tokens';
import { useBudgets } from '~/src/hooks/useBudgets';
import { useConvertedStats } from '~/src/hooks/useConvertedStats';
import {
  useDashboard,
  useDashboardExpensesTrend,
  useDashboardHistory,
} from '~/src/hooks/useDashboard';
import { useMonobankSync } from '~/src/hooks/useMonobank';
import { convertCurrency, useCurrencyStore } from '~/src/lib/currency';
import { getPeriodLabel, getPeriodRange, usePeriodStore } from '~/src/lib/period';
import { usePrivacyStore } from '~/src/lib/privacy';
import { formatCurrency, formatRelativeDate } from '~/src/utils/format';

function formatTrendLabel(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '—';

  const now = new Date();
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

function prependZeroAnchor(points: ReadonlyArray<LineChartPoint>): LineChartPoint[] {
  if (points.length === 0) return [];

  const firstPoint = points[0]!;
  if (!Number.isFinite(firstPoint.value) || firstPoint.value === 0) {
    return [...points];
  }

  let anchorIsoDate = firstPoint.isoDate;
  if (typeof firstPoint.isoDate === 'string') {
    const firstTs = Date.parse(firstPoint.isoDate);
    if (Number.isFinite(firstTs)) {
      anchorIsoDate = new Date(firstTs - 24 * 60 * 60 * 1000).toISOString();
    }
  }

  return [
    {
      value: 0,
      label: 'Start',
      isoDate: anchorIsoDate,
    },
    ...points,
  ];
}

function roundToCents(value: number): number {
  return Math.round(value * 100) / 100;
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
  const { data: expensesTrendData, refetch: refetchExpensesTrend } = useDashboardExpensesTrend();
  const { data: budgetsData } = useBudgets();
  const { mutate: sync, isPending: isSyncing } = useMonobankSync();
  const router = useRouter();
  const baseCurrency = useCurrencyStore(s => s.baseCurrency);
  const isPrivate = usePrivacyStore(s => s.isPrivate);
  const [totalInBase, setTotalInBase] = useState<number | null>(null);
  const [trendPoints, setTrendPoints] = useState<LineChartPoint[]>([]);
  const [expenseComparisonPoints, setExpenseComparisonPoints] = useState<
    ComparisonLineChartPoint[]
  >([]);
  const [activeExpensePoint, setActiveExpensePoint] =
    useState<ActiveComparisonLineChartPoint | null>(null);
  const [activeTrendPoint, setActiveTrendPoint] = useState<ActiveLineChartPoint | null>(null);
  const [isTrendDragging, setIsTrendDragging] = useState(false);
  const [expenseBudgetLimit, setExpenseBudgetLimit] = useState<number | null>(null);

  const convertedStats = useConvertedStats(data?.periodStats ?? null);
  const insets = useSafeAreaInsets();

  const currentMonthBudgets = useMemo(() => {
    const budgets = budgetsData?.budgets ?? [];
    const now = new Date();
    const currentUtcMonthStartTs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0);
    const nextUtcMonthStartTs = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth() + 1,
      1,
      0,
      0,
      0,
      0,
    );
    const currentLocalMonthStartTs = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0,
    ).getTime();
    const nextLocalMonthStartTs = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1,
      0,
      0,
      0,
      0,
    ).getTime();

    const monthlyBudgets = budgets.filter(budget => budget.isActive && budget.period === 'MONTHLY');

    const parsedMonthlyBudgets = monthlyBudgets
      .map(budget => ({
        budget,
        startTs: Date.parse(budget.startDate),
        endTs: Date.parse(budget.endDate),
      }))
      .filter(item => Number.isFinite(item.startTs) && Number.isFinite(item.endTs))
      .filter(item => {
        const overlapsUtcMonth =
          item.startTs < nextUtcMonthStartTs && item.endTs >= currentUtcMonthStartTs;
        const overlapsLocalMonth =
          item.startTs < nextLocalMonthStartTs && item.endTs >= currentLocalMonthStartTs;

        return overlapsUtcMonth || overlapsLocalMonth;
      })
      .map(item => item.budget);

    const currentRegularBudgets = parsedMonthlyBudgets.filter(budget => !budget.isTemplate);
    if (currentRegularBudgets.length > 0) {
      return currentRegularBudgets;
    }

    if (parsedMonthlyBudgets.length > 0) {
      return parsedMonthlyBudgets;
    }

    const fallbackSorted = monthlyBudgets
      .map(budget => ({
        budget,
        startTs: Date.parse(budget.startDate),
      }))
      .filter(item => Number.isFinite(item.startTs))
      .sort((left, right) => right.startTs - left.startTs);

    const latestRegular = fallbackSorted.find(item => !item.budget.isTemplate)?.budget;
    if (latestRegular) {
      return [latestRegular];
    }

    const latestAny = fallbackSorted[0]?.budget;
    return latestAny ? [latestAny] : [];
  }, [budgetsData?.budgets]);

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
    sync({}, { onError: () => {} }); // trigger sync silently
  }, [refetch, refetchHistory, refetchExpensesTrend, sync]);

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

      if (isMounted) setTotalInBase(roundToCents(sum));
    };

    void recompute();

    return () => {
      isMounted = false;
    };
  }, [data, baseCurrency]);

  useEffect(() => {
    let isMounted = true;

    const recomputeHistory = async () => {
      if (!historyData?.history || historyData.history.length === 0) {
        if (isMounted) setTrendPoints([]);
        return;
      }

      const factor =
        baseCurrency === 'EUR' ? 1 : await convertCurrency(1, 'EUR', baseCurrency).catch(() => 1);

      const normalized: LineChartPoint[] = [];
      let lastValid: number | null = null;

      for (const point of historyData.history) {
        const pointDate = typeof point.date === 'string' ? point.date : new Date().toISOString();
        const pointLabel = formatTrendLabel(pointDate);
        let eurValue = Number(point.totalEUR);

        if (!Number.isFinite(eurValue)) {
          const balancesObj =
            point && typeof point === 'object' && 'balances' in point
              ? (point as { balances?: Record<string, unknown> }).balances
              : undefined;

          if (balancesObj && typeof balancesObj === 'object') {
            const entries = Object.entries(balancesObj)
              .map(([key, raw]) => [key, Number(raw)] as const)
              .filter(([, value]) => Number.isFinite(value));

            if (entries.length > 0) {
              const hasCurrencyKeys = entries.every(([key]) => /^[A-Z]{3}$/.test(key));

              if (hasCurrencyKeys) {
                let sumInEur = 0;
                for (const [currency, amount] of entries) {
                  sumInEur += await convertCurrency(amount, currency, 'EUR').catch(() => amount);
                }
                eurValue = sumInEur;
              } else {
                eurValue = entries.reduce((sum, [, amount]) => sum + amount, 0);
              }
            }
          }
        }

        if (Number.isFinite(eurValue)) {
          const converted = roundToCents(eurValue * factor);
          if (Number.isFinite(converted)) {
            normalized.push({
              value: converted,
              label: pointLabel,
              isoDate: pointDate,
            });
            lastValid = converted;
            continue;
          }
        }

        if (lastValid !== null) {
          normalized.push({
            value: lastValid,
            label: pointLabel,
            isoDate: pointDate,
          });
        }
      }

      if (!isMounted) return;
      if (normalized.length === 0) {
        setTrendPoints([]);
        return;
      }

      const currentValue =
        totalInBase !== null && Number.isFinite(totalInBase)
          ? roundToCents(totalInBase)
          : normalized[normalized.length - 1]!.value;
      const latestPoint = normalized[normalized.length - 1]!;
      const withCurrent: LineChartPoint[] = [
        ...normalized.slice(0, -1),
        {
          ...latestPoint,
          value: currentValue,
        },
      ];
      const anchoredTrend = prependZeroAnchor(withCurrent);

      if (anchoredTrend.length > 1) {
        setTrendPoints(anchoredTrend);
        return;
      }

      const only = anchoredTrend[0]!;
      setTrendPoints([
        {
          ...only,
          label: only.label || 'Start',
        },
        {
          ...only,
          label: 'Now',
        },
      ]);
    };

    void recomputeHistory();

    return () => {
      isMounted = false;
    };
  }, [historyData, baseCurrency, totalInBase]);

  useEffect(() => {
    let isMounted = true;

    const recomputeExpenseTrend = async () => {
      if (!expensesTrendData?.points || expensesTrendData.points.length === 0) {
        if (isMounted) {
          setExpenseComparisonPoints([]);
          setActiveExpensePoint(null);
          setExpenseBudgetLimit(null);
        }
        return;
      }

      const factor =
        baseCurrency === 'EUR' ? 1 : await convertCurrency(1, 'EUR', baseCurrency).catch(() => 1);
      const todayDay = new Date().getUTCDate();

      const normalized: ComparisonLineChartPoint[] = expensesTrendData.points.map(point => ({
        day: point.day,
        label: point.label,
        currentValue: point.day <= todayDay ? roundToCents(point.currentExpenseEUR * factor) : null,
        previousValue: roundToCents(point.previousExpenseEUR * factor),
      }));

      if (!isMounted) return;
      setExpenseComparisonPoints(normalized);
      setActiveExpensePoint(null);

      let resolvedBudgetLimit: number | null = null;
      if (currentMonthBudgets.length > 0) {
        const convertedBudgetLimits = await Promise.all(
          currentMonthBudgets.map(async budget => {
            const plannedBase = Number(budget.totalPlannedBase);
            if (Number.isFinite(plannedBase) && plannedBase >= 0) {
              const converted = await convertCurrency(plannedBase, 'EUR', baseCurrency).catch(
                () => plannedBase,
              );
              return roundToCents(converted);
            }

            const planned = Number(budget.totalPlanned);
            if (!Number.isFinite(planned) || planned < 0) {
              return null;
            }

            const converted = await convertCurrency(planned, budget.currency, baseCurrency).catch(
              () => planned,
            );
            return roundToCents(converted);
          }),
        );

        const totalLimit = convertedBudgetLimits.reduce<number>(
          (sum, value) => sum + (typeof value === 'number' ? value : 0),
          0,
        );
        resolvedBudgetLimit = totalLimit > 0 ? roundToCents(totalLimit) : null;
      }

      setExpenseBudgetLimit(resolvedBudgetLimit);
    };

    void recomputeExpenseTrend();

    return () => {
      isMounted = false;
    };
  }, [currentMonthBudgets, expensesTrendData, baseCurrency]);

  const trendStats = useMemo(() => {
    const series = trendPoints.map(point => point.value).filter(Number.isFinite);
    const firstVal = series[0] ?? 0;
    const latestVal =
      totalInBase !== null && Number.isFinite(totalInBase)
        ? totalInBase
        : (series[series.length - 1] ?? 0);
    const focusedVal = activeTrendPoint?.value ?? latestVal;
    const overallChangeAbs = latestVal - firstVal;
    const overallChangePct = firstVal > 0 ? (overallChangeAbs / firstVal) * 100 : 0;
    const focusedChangeAbs = focusedVal - firstVal;
    const minVal = series.length > 0 ? Math.min(...series, focusedVal, latestVal) : 0;
    const maxVal = series.length > 0 ? Math.max(...series, focusedVal, latestVal) : 0;

    return {
      firstVal,
      latestVal,
      focusedVal,
      overallChangeAbs,
      overallChangePct,
      focusedChangeAbs,
      minVal,
      maxVal,
      isOverallPositive: overallChangeAbs >= 0,
      isFocusedPositive: focusedChangeAbs >= 0,
      hasData: series.some(v => Math.abs(v) > 0),
      showPct: firstVal > 0 && series.length > 1,
      activeLabel: activeTrendPoint?.label ?? 'All time',
    };
  }, [trendPoints, totalInBase, activeTrendPoint]);

  const expenseTrendStats = useMemo(() => {
    const latestCurrentPoint = [...expenseComparisonPoints]
      .reverse()
      .find(point => typeof point.currentValue === 'number' && Number.isFinite(point.currentValue));
    const fallbackCurrentTotal = latestCurrentPoint?.currentValue ?? 0;
    const fallbackDay = latestCurrentPoint?.day ?? new Date().getUTCDate();
    const fallbackPreviousValue = expenseComparisonPoints.find(
      point => point.day === fallbackDay,
    )?.previousValue;
    const fallbackPreviousTotal =
      typeof fallbackPreviousValue === 'number' && Number.isFinite(fallbackPreviousValue)
        ? fallbackPreviousValue
        : 0;

    const currentTotal = activeExpensePoint?.current?.value ?? fallbackCurrentTotal;
    const previousTotal = activeExpensePoint?.previous?.value ?? fallbackPreviousTotal;
    const currentDay = activeExpensePoint?.current?.day ?? fallbackDay;
    const currentPointLabel = activeExpensePoint?.current?.label ?? String(currentDay);
    const previousPointLabel = activeExpensePoint?.previous?.label ?? String(currentDay);
    const delta = roundToCents(currentTotal - previousTotal);
    const deltaPct = previousTotal > 0 ? (delta / previousTotal) * 100 : null;

    return {
      currentTotal,
      previousTotal,
      currentDay,
      currentPointLabel,
      previousPointLabel,
      delta,
      deltaPct,
      isHigherThanPrevious: delta > 0,
      hasData: expenseComparisonPoints.length > 0,
      currentMonthLabel: expensesTrendData?.currentMonthLabel ?? 'Current month',
      previousMonthLabel: expensesTrendData?.previousMonthLabel ?? 'Previous month',
      comparedDays: expensesTrendData?.comparedDays ?? expenseComparisonPoints.length,
    };
  }, [expenseComparisonPoints, expensesTrendData, activeExpensePoint]);

  const budgetLimitStatus = useMemo(() => {
    if (!expenseBudgetLimit || expenseBudgetLimit <= 0) {
      return null;
    }

    const usagePercent = (expenseTrendStats.currentTotal / expenseBudgetLimit) * 100;

    return {
      usagePercent,
      isApproaching: usagePercent >= 80 && usagePercent < 100,
      isOverLimit: usagePercent >= 100,
    };
  }, [expenseBudgetLimit, expenseTrendStats.currentTotal]);

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

          {!isPrivate && expenseBudgetLimit !== null && (
            <View style={styles.expensesBudgetLimitRow}>
              <Text style={styles.expensesBudgetLimitLabel}>
                Budget limit: {formatCurrency(expenseBudgetLimit, baseCurrency)}
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
                    ? `Over by ${formatCurrency(expenseTrendStats.currentTotal - expenseBudgetLimit, baseCurrency)}`
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
              referenceValue={isPrivate ? null : expenseBudgetLimit}
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
                {!isPrivate && expenseBudgetLimit !== null && (
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
