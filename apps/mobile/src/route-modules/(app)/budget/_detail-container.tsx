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
  PrivacyAmount,
  ProgressBar,
  SectionHeader,
  Separator,
} from '~/src/components/ui';
import { colors } from '~/src/design/tokens';
import { useBudgets, useCreateBudget, useDeleteBudget } from '~/src/hooks/useBudgets';
import { BASE_CURRENCY } from '~/src/lib/currency';
import { formatCurrency, formatShortDate } from '~/src/utils/format';
import { styles } from './_detail-styles';

export default function BudgetDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, error, refetch, isRefetching } = useBudgets();
  const { mutate: createBudget, isPending: isCopying } = useCreateBudget();
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

  const handleCopyToNextMonth = () => {
    if (budget.period !== 'MONTHLY') {
      Alert.alert('Not supported', 'Only monthly budgets can be copied to the next month.');
      return;
    }

    const sourceStart = new Date(budget.startDate);
    const sourceEnd = new Date(budget.endDate);
    const sourceMidpoint = new Date((sourceStart.getTime() + sourceEnd.getTime()) / 2);

    const nextMonthStart = new Date(
      Date.UTC(sourceMidpoint.getUTCFullYear(), sourceMidpoint.getUTCMonth() + 1, 1, 0, 0, 0, 0),
    );
    const nextMonthEnd = new Date(
      Date.UTC(
        sourceMidpoint.getUTCFullYear(),
        sourceMidpoint.getUTCMonth() + 2,
        0,
        23,
        59,
        59,
        999,
      ),
    );

    const nextMonthLabel = nextMonthStart.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });

    createBudget(
      {
        name: `${nextMonthLabel} Budget`,
        period: 'MONTHLY',
        startDate: nextMonthStart.toISOString(),
        endDate: nextMonthEnd.toISOString(),
        currency: budget.currency,
        totalPlanned: budget.totalPlanned,
        categories: budget.categories.map(category => ({
          categoryId: category.categoryId,
          planned: category.planned,
        })),
        isTemplate: false,
        templateName: null,
        autoApply: false,
      },
      {
        onSuccess: () => {
          Alert.alert('Budget copied', `Created budget for ${nextMonthLabel}.`);
          void refetch();
        },
        onError: copyError => Alert.alert('Copy failed', copyError.message),
      },
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
                style={[styles.headerBtn, isCopying && { opacity: 0.5 }]}
                onPress={handleCopyToNextMonth}
                disabled={isCopying}
                hitSlop={8}
              >
                {isCopying ? (
                  <ActivityIndicator size="small" color={colors.textSecondary} />
                ) : (
                  <Text style={styles.headerIcon}>⧉</Text>
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
              <PrivacyAmount
                value={formatCurrency(budget.totalActualBase, BASE_CURRENCY)}
                style={[styles.spentAmount, isOverBudget && styles.overSpent]}
                color={isOverBudget ? colors.expense : colors.textPrimary}
              />
            </View>
            <View style={styles.amountPlannedWrap}>
              <Text style={styles.amountLabel}>Planned</Text>
              <PrivacyAmount
                value={formatCurrency(budget.totalPlannedBase, BASE_CURRENCY)}
                style={styles.plannedAmount}
                color={colors.textSecondary}
              />
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
          {[...budget.categories]
            .sort((a, b) => b.plannedBase - a.plannedBase)
            .map((cat, idx) => {
              const catProgress =
                cat.plannedBase > 0 ? Math.min((cat.actualBase / cat.plannedBase) * 100, 100) : 0;
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
                  <View>
                    <View style={styles.catRow}>
                      <View style={styles.catInfo}>
                        <Text style={styles.catIcon}>{'📁'}</Text>
                        <Text style={styles.catName} numberOfLines={1}>
                          {cat.category.name}
                        </Text>
                      </View>
                      <View style={styles.catAmounts}>
                        <PrivacyAmount
                          value={formatCurrency(cat.actualBase, BASE_CURRENCY)}
                          style={[styles.catSpent, catOver && styles.catOverSpent]}
                          color={catOver ? colors.expense : colors.textPrimary}
                        />
                        <Text style={styles.catPlanned}>/</Text>
                        <PrivacyAmount
                          value={formatCurrency(cat.plannedBase, BASE_CURRENCY)}
                          style={styles.catPlanned}
                          color={colors.textMuted}
                        />
                      </View>
                    </View>
                    <View style={styles.catProgressWrap}>
                      <ProgressBar
                        progress={catProgress}
                        color={catOver ? colors.expense : cat.category.color || colors.brand}
                        height={6}
                      />
                    </View>
                  </View>
                  {idx < budget.categories.length - 1 && <Separator />}
                </Pressable>
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
