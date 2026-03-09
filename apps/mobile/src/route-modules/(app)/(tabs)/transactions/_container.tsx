'use client';
import { PAGE_SIZE } from '@/route-modules/(app)/(tabs)/transactions/_constants';
import { styles } from '@/route-modules/(app)/(tabs)/transactions/_styles';
import { groupByDate } from '@/route-modules/(app)/(tabs)/transactions/_utils';
import { useQueryClient } from '@tanstack/react-query';
import { Tabs, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  SectionList,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  TransactionRow,
  type TransactionRowData,
} from '~/src/components/transaction/TransactionRow';
import { ErrorScreen, LoadingScreen, Separator, SummaryCard } from '~/src/components/ui';
import { colors } from '~/src/design/tokens';
import { useConvertedStats } from '~/src/hooks/useConvertedStats';
import { useMonobankSync } from '~/src/hooks/useMonobank';
import {
  TRANSACTIONS_QUERY_KEY,
  TRANSACTION_FILTERS,
  useTransactions,
  type TransactionFilter,
} from '~/src/hooks/useTransactions';
import { getPeriodLabel, getPeriodRange, usePeriodStore } from '~/src/lib/period';
import { formatCurrency } from '~/src/utils/format';

export default function TransactionsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: sync, isPending: isSyncing } = useMonobankSync();

  const period = usePeriodStore(s => s.period);
  const dateRange = useMemo(() => getPeriodRange(period), [period]);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<TransactionFilter>('ALL');
  const [page, setPage] = useState(1);

  // Accumulated transaction rows for infinite scroll.
  const [items, setItems] = useState<TransactionRowData[]>([]);

  // Track the latest page for which we accepted items, to deduplicate concurrent fetches.
  const acceptedPageRef = useRef(0);

  const { data, isLoading, isRefetching, isFetching, error, isPlaceholderData } = useTransactions({
    type: filter !== 'ALL' ? filter : undefined,
    search: search || undefined,
    page,
    pageSize: PAGE_SIZE,
    dateFrom: dateRange.dateFrom,
    dateTo: dateRange.dateTo,
  });
  const convertedStats = useConvertedStats(data?.stats ?? null);

  // Invalidates ALL transaction query entries (all pages/filters) so that when
  // page resets to 1 the fresh data is fetched from the server, not served from cache.
  const refetchCb = useCallback(async () => {
    acceptedPageRef.current = 0;
    setPage(1);
    await queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
    sync({}, { onError: () => {} });
  }, [queryClient, sync]);

  useEffect(() => {
    if (!data || isPlaceholderData) return;

    if (data.page === 1) {
      acceptedPageRef.current = 1;
      setItems(data.transactions);
      return;
    }

    // Guard: only append if this page is the expected next page.
    if (data.page !== acceptedPageRef.current + 1) return;

    acceptedPageRef.current = data.page;

    setItems(prev => {
      const seen = new Set(prev.map(tx => tx.id));
      const next: TransactionRowData[] = [...prev];
      for (const tx of data.transactions) {
        if (!seen.has(tx.id)) next.push(tx);
      }
      return next;
    });
  }, [data, isPlaceholderData]);

  useEffect(() => {
    setPage(1);
    acceptedPageRef.current = 0;
  }, [period, filter, search]);

  const sections = useMemo(() => groupByDate(items), [items]);

  const income = convertedStats.income;
  const expenses = convertedStats.expenses;
  const netFlow = convertedStats.netFlow;
  const currency = convertedStats.currency;
  const total = data?.total ?? 0;

  const periodLabel = getPeriodLabel(period);
  const netFlowColor = netFlow >= 0 ? colors.income : colors.expense;
  const insets = useSafeAreaInsets();

  // Full-screen loader only for first load; pagination shows an inline footer.
  if (isLoading && !data) return <LoadingScreen label="Loading transactions…" />;
  if (error && !data) {
    const msg = error instanceof Error ? error.message : 'UNKNOWN_ERROR';
    return <ErrorScreen message={`Failed to load: ${msg}`} onRetry={refetchCb} />;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <Tabs.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { paddingTop: insets.top - 14 }]}>
        <View>
          <Text style={styles.headerTitleText}>Transactions</Text>
          <Text style={styles.headerSubtitleText}>{periodLabel}</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            style={[styles.headerBtn, (isRefetching || isSyncing) && { opacity: 0.5 }]}
            onPress={refetchCb}
            disabled={isRefetching || isSyncing}
            hitSlop={8}
          >
            {isRefetching || isSyncing ? (
              <ActivityIndicator size="small" color={colors.textSecondary} />
            ) : (
              <Text style={styles.headerIcon}>↻</Text>
            )}
          </Pressable>
          <Pressable
            style={[styles.headerBtn, { backgroundColor: colors.brand, borderColor: colors.brand }]}
            onPress={() => router.push('/transaction/edit')}
            hitSlop={8}
          >
            <Text style={[styles.headerIcon, { color: colors.white }]}>+</Text>
          </Pressable>
        </View>
      </View>
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching || isFetching || isSyncing}
            onRefresh={refetchCb}
            tintColor={colors.brand}
          />
        }
        // ── Optimisation for long lists
        windowSize={5}
        maxToRenderPerBatch={20}
        initialNumToRender={20}
        removeClippedSubviews
        contentContainerStyle={styles.scroll}
        onEndReached={() => {
          if (data?.hasMore && !isFetching && !isRefetching) {
            setPage(p => p + 1);
          }
        }}
        onEndReachedThreshold={0.4}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <SummaryCard
              metrics={[
                {
                  label: 'Income',
                  value: formatCurrency(income, currency),
                  valueColor: colors.income,
                },
                {
                  label: 'Expenses',
                  value: formatCurrency(expenses, currency),
                  valueColor: colors.expense,
                },
                {
                  label: 'Net Flow',
                  value: formatCurrency(netFlow, currency),
                  valueColor: netFlowColor,
                },
              ]}
            />

            <View style={styles.countWrap}>
              <Text style={styles.countText}>
                {total} transaction{total !== 1 ? 's' : ''}
              </Text>
            </View>

            <View style={styles.searchWrap}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search transactions..."
                placeholderTextColor={colors.textDisabled}
                value={search}
                onChangeText={(v: string) => {
                  setSearch(v);
                  setPage(1);
                }}
                returnKeyType="search"
                clearButtonMode="while-editing"
              />
            </View>

            <FlatList
              data={[...TRANSACTION_FILTERS]}
              keyExtractor={f => f.key}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}
              renderItem={({ item: f }) => (
                <Pressable
                  style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
                  onPress={() => {
                    setFilter(f.key);
                    setPage(1);
                  }}
                >
                  <Text style={[styles.filterLabel, filter === f.key && styles.filterLabelActive]}>
                    {f.label}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        }
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionTitle}>{section.title.toUpperCase()}</Text>
        )}
        renderItem={({ item, index, section }) => (
          <Pressable
            style={[
              styles.rowCard,
              index === 0 && styles.rowCardFirst,
              index === section.data.length - 1 && styles.rowCardLast,
            ]}
            onPress={() => router.push({ pathname: '/transaction/edit', params: { id: item.id } })}
          >
            <TransactionRow transaction={item} hideDate />
            {index < section.data.length - 1 && <Separator />}
          </Pressable>
        )}
        // ── Load more indicator (inline, no full reload)
        ListFooterComponent={
          data?.hasMore && isFetching ? (
            <View style={styles.loadMore}>
              <ActivityIndicator size="small" color={colors.brand} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No transactions found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
