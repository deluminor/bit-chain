import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BudgetCard, ErrorScreen, LoadingScreen, SectionHeader } from '~/src/components/ui';
import { colors, fontSize, fontWeight, radius, spacing } from '~/src/design/tokens';
import { useBudgets } from '~/src/hooks/useBudgets';

export default function BudgetScreen() {
  const router = useRouter();
  const { data, isLoading, error, refetch, isRefetching } = useBudgets();

  if (isLoading && !data) return <LoadingScreen />;
  if (error && !data) return <ErrorScreen message="Failed to load budgets" onRetry={refetch} />;

  const budgets = data?.budgets || [];
  const activeBudgets = budgets.filter(b => b.isActive);
  const inactiveBudgets = budgets.filter(b => !b.isActive);

  // Group budgets for SectionList or custom rendering
  const renderEmpty = () => (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyIcon}>💸</Text>
      <Text style={styles.emptyTitle}>No budgets yet</Text>
      <Text style={styles.emptyMessage}>Create a budget to better track your spending goals.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      {/* Native Stack Header configuration */}
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View style={{ alignItems: Platform.OS === 'ios' ? 'center' : 'flex-start' }}>
              <Text style={styles.headerTitleText}>Budgets</Text>
              <Text style={styles.headerSubtitleText}>
                {budgets.length ? `${budgets.length} total` : 'Plan your spending'}
              </Text>
            </View>
          ),
          headerRight: () => (
            <View style={styles.headerActions}>
              <Pressable
                style={[styles.headerBtn, isRefetching && { opacity: 0.5 }]}
                onPress={() => refetch()}
                disabled={isRefetching}
                hitSlop={8}
              >
                {isRefetching ? (
                  <ActivityIndicator size="small" color={colors.textSecondary} />
                ) : (
                  <Text style={styles.headerIcon}>↻</Text>
                )}
              </Pressable>
              <Pressable
                style={[
                  styles.headerBtn,
                  { backgroundColor: colors.brand, borderColor: colors.brand },
                ]}
                onPress={() => router.push('/budget/edit')}
                hitSlop={8}
              >
                <Text style={[styles.headerIcon, { color: colors.white }]}>+</Text>
              </Pressable>
            </View>
          ),
        }}
      />

      <FlatList
        data={budgets.length > 0 ? [{ id: 'active' }, { id: 'inactive' }] : []}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.brand} />
        }
        ListEmptyComponent={renderEmpty}
        renderItem={({ item }) => {
          if (item.id === 'active' && activeBudgets.length > 0) {
            return (
              <View style={styles.section}>
                <SectionHeader title="Active Budgets" />
                <View style={styles.cardsWrap}>
                  {activeBudgets.map(b => (
                    <Pressable
                      key={b.id}
                      onPress={() =>
                        router.push({ pathname: '/budget/[id]', params: { id: b.id } })
                      }
                    >
                      <BudgetCard budget={b} />
                    </Pressable>
                  ))}
                </View>
              </View>
            );
          }

          if (item.id === 'inactive' && inactiveBudgets.length > 0) {
            return (
              <View style={[styles.section, { opacity: 0.7 }]}>
                <SectionHeader title="Past Budgets" />
                <View style={styles.cardsWrap}>
                  {inactiveBudgets.map(b => (
                    <Pressable
                      key={b.id}
                      onPress={() =>
                        router.push({ pathname: '/budget/[id]', params: { id: b.id } })
                      }
                    >
                      <BudgetCard budget={b} />
                    </Pressable>
                  ))}
                </View>
              </View>
            );
          }

          return null;
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginRight: Platform.OS === 'ios' ? 0 : spacing.sm,
  },
  headerBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: fontWeight.medium,
  },
  headerTitleText: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: fontWeight.semibold,
  },
  headerSubtitleText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  listContent: {
    paddingTop: spacing.xs,
    paddingBottom: spacing['4xl'],
    flexGrow: 1,
  },
  section: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.xl,
  },
  cardsWrap: {
    gap: spacing.md,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['3xl'],
    marginTop: spacing['2xl'],
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptyMessage: {
    fontSize: fontSize.base,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
