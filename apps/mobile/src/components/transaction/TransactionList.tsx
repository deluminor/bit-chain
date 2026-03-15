import type { TransactionsQuery } from '@bit-chain/api-contracts';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { TransactionRowData } from '~/src/components/transaction/TransactionRow';
import { TransactionRow } from '~/src/components/transaction/TransactionRow';
import { Separator } from '~/src/components/ui';
import { colors, radius, spacing } from '~/src/design/tokens';
import { useTransactions } from '~/src/hooks/useTransactions';
import { TRANSACTIONS_QUERY_KEY } from '~/src/lib/query-keys';
import { groupByDate } from './_list-utils';

const DEFAULT_PAGE_SIZE = 50;

export interface TransactionListProps {
  filters: Partial<Omit<TransactionsQuery, 'page' | 'pageSize'>>;
  ListHeaderComponent?: React.ReactElement | null;
  onRefresh?: () => void | Promise<void>;
  showLoadMore?: boolean;
}

export function TransactionList({
  filters,
  ListHeaderComponent,
  onRefresh,
  showLoadMore = true,
}: TransactionListProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<TransactionRowData[]>([]);
  const acceptedPageRef = useRef(0);

  const queryFilters = useMemo(
    () => ({
      ...filters,
      page,
      pageSize: DEFAULT_PAGE_SIZE,
    }),
    [filters, page],
  );

  const { data, isLoading, isRefetching, isFetching, error, isPlaceholderData } =
    useTransactions(queryFilters);

  const filterKey = useMemo(
    () =>
      JSON.stringify({
        type: filters.type,
        categoryId: filters.categoryId,
        accountId: filters.accountId,
        search: filters.search,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
      }),
    [
      filters.type,
      filters.categoryId,
      filters.accountId,
      filters.search,
      filters.dateFrom,
      filters.dateTo,
    ],
  );

  const refetchCb = useCallback(async () => {
    acceptedPageRef.current = 0;
    setPage(1);
    if (onRefresh) {
      await onRefresh();
    } else {
      await queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
    }
  }, [onRefresh, queryClient]);

  useEffect(() => {
    if (!data || isPlaceholderData) return;

    if (data.page === 1) {
      acceptedPageRef.current = 1;
      setItems(data.transactions);
      return;
    }

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
  }, [filterKey]);

  const sections = useMemo(() => groupByDate(items), [items]);

  const handleRowPress = useCallback(
    (id: string) => {
      router.push({ pathname: '/transaction/edit', params: { id } });
    },
    [router],
  );

  const handleEndReached = useCallback(() => {
    if (data?.hasMore && !isFetching && !isRefetching) {
      setPage(p => p + 1);
    }
  }, [data?.hasMore, isFetching, isRefetching]);

  if (isLoading && !data) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    );
  }

  if (error && !data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          {error instanceof Error ? error.message : 'Failed to load transactions'}
        </Text>
      </View>
    );
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching || isFetching}
          onRefresh={refetchCb}
          tintColor={colors.brand}
        />
      }
      windowSize={5}
      maxToRenderPerBatch={20}
      initialNumToRender={20}
      removeClippedSubviews
      contentContainerStyle={styles.scroll}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.4}
      ListHeaderComponent={ListHeaderComponent}
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
          onPress={() => handleRowPress(item.id)}
        >
          <TransactionRow transaction={item} hideDate />
          {index < section.data.length - 1 && <Separator />}
        </Pressable>
      )}
      ListFooterComponent={
        showLoadMore && data?.hasMore && isFetching ? (
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
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  scroll: {
    padding: spacing.base,
    paddingTop: spacing.xs,
    gap: spacing.sm,
    paddingBottom: spacing['5xl'],
  },
  sectionTitle: {
    color: colors.textDisabled,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: spacing.sm,
    marginBottom: 4,
  },
  rowCard: {
    backgroundColor: colors.bgSurface,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.base,
  },
  rowCardFirst: {
    borderTopWidth: 1,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  rowCardLast: {
    borderBottomWidth: 1,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  loadMore: {
    alignItems: 'center',
    paddingVertical: spacing.base,
  },
  emptyWrap: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 16,
  },
});
