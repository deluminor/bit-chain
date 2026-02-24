'use client';

import { Tabs } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge, ErrorScreen, LoadingScreen, Separator, SummaryCard } from '~/src/components/ui';
import { colors } from '~/src/design/tokens';
import { useCategories as useCategoriesHook } from '~/src/hooks/useCategories';
import { CATEGORY_FILTERS } from './constants';
import { rowStyles, styles } from './styles';
import type { CategoryFilter, CategoryItem, CategoryRowProps } from './types';

function CategoryRow({ category: cat }: CategoryRowProps) {
  const isIncome = cat.type === 'INCOME';
  return (
    <View style={rowStyles.row}>
      <View style={[rowStyles.dot, { backgroundColor: cat.color ?? colors.textMuted }]} />
      <View style={rowStyles.info}>
        <View style={rowStyles.nameRow}>
          <Text style={rowStyles.name} numberOfLines={1}>
            {cat.name}
          </Text>
          {cat.isDefault && (
            <View style={rowStyles.defaultTag}>
              <Text style={rowStyles.defaultText}>DEFAULT</Text>
            </View>
          )}
        </View>
        <Text style={rowStyles.count}>
          {cat.transactionCount} {cat.transactionCount === 1 ? 'transaction' : 'transactions'}
        </Text>
      </View>
      <Badge label={isIncome ? 'INCOME' : 'EXPENSE'} variant={isIncome ? 'success' : 'error'} />
    </View>
  );
}

export default function CategoriesScreen() {
  const { data, isLoading, isRefetching, error, refetch } = useCategoriesHook();
  const [filter, setFilter] = useState<CategoryFilter>('ALL');
  const insets = useSafeAreaInsets();

  const refetchCb = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) return <LoadingScreen label="Loading categories…" />;
  if (error) {
    const msg = error instanceof Error ? error.message : 'UNKNOWN_ERROR';
    return <ErrorScreen message={`Failed to load: ${msg}`} onRetry={refetch} />;
  }

  const categories = data?.categories ?? [];
  const filtered = filter === 'ALL' ? categories : categories.filter(c => c.type === filter);

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <Tabs.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { paddingTop: insets.top - 14 }]}>
        <View>
          <Text style={styles.headerTitleText}>Categories</Text>
          <Text style={styles.headerSubtitleText}>{categories.length} total</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            style={[styles.headerBtn, isRefetching && { opacity: 0.5 }]}
            onPress={refetchCb}
            disabled={isRefetching}
            hitSlop={8}
          >
            {isRefetching ? (
              <ActivityIndicator size="small" color={colors.textSecondary} />
            ) : (
              <Text style={styles.headerIcon}>↻</Text>
            )}
          </Pressable>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.brand} />
        }
      >
        <View style={styles.headerBlock}>
          <SummaryCard
            metrics={[
              {
                label: 'Income',
                value: String(data?.incomeCount ?? 0),
                valueColor: colors.income,
                private: false,
              },
              {
                label: 'Expenses',
                value: String(data?.expenseCount ?? 0),
                valueColor: colors.expense,
                private: false,
              },
            ]}
          />

          {/* Type filters */}
          <FlatList
            data={[...CATEGORY_FILTERS]}
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

        {filtered.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No categories found</Text>
          </View>
        ) : (
          <View style={styles.listCard}>
            {filtered.map((cat, index) => (
              <View key={cat.id}>
                <CategoryRow category={cat} />
                {index < filtered.length - 1 && <Separator />}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
