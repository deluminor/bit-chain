import { BudgetEmptyState } from '@/route-modules/(app)/budget/_components';
import { styles } from '@/route-modules/(app)/budget/_styles';
import { Stack, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BudgetCard, ErrorScreen, LoadingScreen, SectionHeader } from '~/src/components/ui';
import { colors } from '~/src/design/tokens';
import { useBudgets } from '~/src/hooks/useBudgets';

export default function BudgetScreen() {
  const router = useRouter();
  const { data, isLoading, error, refetch, isRefetching } = useBudgets();

  if (isLoading && !data) return <LoadingScreen />;
  if (error && !data) return <ErrorScreen message="Failed to load budgets" onRetry={refetch} />;

  const budgets = data?.budgets || [];
  const activeBudgets = budgets.filter(b => b.isActive);
  const inactiveBudgets = budgets.filter(b => !b.isActive);

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View
              style={[
                styles.headerTitleWrap,
                Platform.OS !== 'ios' && styles.headerTitleWrapAndroid,
              ]}
            >
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
                style={[styles.headerBtn, styles.headerBtnPrimary]}
                onPress={() => router.push('/budget/edit')}
                hitSlop={8}
              >
                <Text style={[styles.headerIcon, styles.headerIconPrimary]}>+</Text>
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
        ListEmptyComponent={BudgetEmptyState}
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
              <View style={[styles.section, styles.sectionInactive]}>
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
