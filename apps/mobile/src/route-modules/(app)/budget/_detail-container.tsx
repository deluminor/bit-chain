import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Card,
  ErrorScreen,
  LoadingScreen,
  ProgressBar,
  SectionHeader,
  Separator,
} from '~/src/components/ui';
import { colors } from '~/src/design/tokens';
import { useBudgets, useDeleteBudget } from '~/src/hooks/useBudgets';
import { formatCurrency, formatShortDate } from '~/src/utils/format';
import { styles } from './_detail-styles';

export default function BudgetDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, error, refetch, isRefetching } = useBudgets();
  const { mutate: deleteBudget, isPending: isDeleting } = useDeleteBudget();

  const budget = data?.budgets.find(item => item.id === id);

  if (isLoading) return <LoadingScreen label="Loading budget..." />;
  if (error || !budget) {
    return (
      <ErrorScreen
        message="Budget not found or could not be loaded."
        onRetry={() => router.back()}
      />
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Budget',
      `Are you sure you want to delete "${budget.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteBudget(budget.id, {
              onSuccess: () => router.back(),
              onError: err => Alert.alert('Deletion Failed', err.message),
            });
          },
        },
      ],
    );
  };

  const isOverBudget = budget.totalActualBase > budget.totalPlannedBase;
  const mainProgress =
    budget.totalPlannedBase > 0
      ? Math.min((budget.totalActualBase / budget.totalPlannedBase) * 100, 100)
      : 0;

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
              <Text style={styles.headerTitleText} numberOfLines={1}>
                {budget.name}
              </Text>
              <Text style={styles.headerSubtitleText}>
                {formatShortDate(budget.startDate)} - {formatShortDate(budget.endDate)}
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
                style={styles.headerBtn}
                onPress={() => router.push({ pathname: '/budget/edit', params: { id: budget.id } })}
                hitSlop={8}
              >
                <Text style={styles.headerIcon}>✎</Text>
              </Pressable>
            </View>
          ),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Card padding="lg" style={styles.overviewCard}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.amountsRow}>
            <View>
              <Text style={styles.amountLabel}>Spent</Text>
              <Text style={[styles.spentAmount, isOverBudget && styles.overSpent]}>
                {formatCurrency(budget.totalActualBase, budget.currency)}
              </Text>
            </View>
            <View style={styles.amountPlannedWrap}>
              <Text style={styles.amountLabel}>Planned</Text>
              <Text style={styles.plannedAmount}>
                {formatCurrency(budget.totalPlannedBase, budget.currency)}
              </Text>
            </View>
          </View>
          <View style={styles.mainProgressWrap}>
            <ProgressBar
              progress={mainProgress}
              color={isOverBudget ? colors.expense : colors.brand}
              height={12}
            />
          </View>
        </Card>

        <SectionHeader title="Categories" />
        <Card padding="sm">
          {budget.categories.map((cat, idx) => {
            const catProgress =
              cat.plannedBase > 0 ? Math.min((cat.actualBase / cat.plannedBase) * 100, 100) : 0;
            const catOver = cat.actualBase > cat.plannedBase;

            return (
              <View key={cat.id}>
                <View style={styles.catRow}>
                  <View style={styles.catInfo}>
                    <Text style={styles.catIcon}>{'📁'}</Text>
                    <Text style={styles.catName} numberOfLines={1}>
                      {cat.category.name}
                    </Text>
                  </View>
                  <View style={styles.catAmounts}>
                    <Text style={[styles.catSpent, catOver && styles.catOverSpent]}>
                      {formatCurrency(cat.actualBase, budget.currency)}
                    </Text>
                    <Text style={styles.catPlanned}>
                      / {formatCurrency(cat.plannedBase, budget.currency)}
                    </Text>
                  </View>
                </View>
                <View style={styles.catProgressWrap}>
                  <ProgressBar
                    progress={catProgress}
                    color={catOver ? colors.expense : cat.category.color || colors.brand}
                    height={6}
                  />
                </View>
                {idx < budget.categories.length - 1 && <Separator />}
              </View>
            );
          })}
        </Card>

        <Pressable
          style={[styles.deleteBtn, isDeleting && styles.disabledBtn]}
          onPress={handleDelete}
          disabled={isDeleting}
        >
          <Text style={styles.deleteBtnText}>{isDeleting ? 'Deleting...' : 'Delete Budget'}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
