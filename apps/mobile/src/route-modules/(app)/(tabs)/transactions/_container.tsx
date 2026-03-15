'use client';
import { styles } from '@/route-modules/(app)/(tabs)/transactions/_styles';
import { useQueryClient } from '@tanstack/react-query';
import { Tabs, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { TransactionList } from '~/src/components/transaction/TransactionList';
import { SummaryCard } from '~/src/components/ui';
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

  const filters = useMemo(
    () => ({
      type: filter !== 'ALL' ? filter : undefined,
      search: search || undefined,
      dateFrom: dateRange.dateFrom,
      dateTo: dateRange.dateTo,
    }),
    [filter, search, dateRange.dateFrom, dateRange.dateTo],
  );

  const { data } = useTransactions({
    ...filters,
    page: 1,
    pageSize: 50,
  });
  const convertedStats = useConvertedStats(data?.stats ?? null);

  const refetchCb = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
    sync({}, { onError: () => {} });
  }, [queryClient, sync]);

  const income = convertedStats.income;
  const expenses = convertedStats.expenses;
  const netFlow = convertedStats.netFlow;
  const currency = convertedStats.currency;
  const total = data?.total ?? 0;
  const periodLabel = getPeriodLabel(period);
  const netFlowColor = netFlow >= 0 ? colors.income : colors.expense;
  const insets = useSafeAreaInsets();

  const listHeader = useMemo(
    () => (
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
            onChangeText={setSearch}
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
              onPress={() => setFilter(f.key)}
            >
              <Text style={[styles.filterLabel, filter === f.key && styles.filterLabelActive]}>
                {f.label}
              </Text>
            </Pressable>
          )}
        />
      </View>
    ),
    [income, expenses, netFlow, currency, total, netFlowColor, search, filter],
  );

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
            style={[styles.headerBtn, isSyncing && { opacity: 0.5 }]}
            onPress={refetchCb}
            disabled={isSyncing}
            hitSlop={8}
          >
            {isSyncing ? (
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
      <TransactionList filters={filters} ListHeaderComponent={listHeader} onRefresh={refetchCb} />
    </SafeAreaView>
  );
}
