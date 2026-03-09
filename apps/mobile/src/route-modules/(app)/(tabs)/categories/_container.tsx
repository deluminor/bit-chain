import { CategoryForm, CategoryList } from '@/route-modules/(app)/(tabs)/categories/_components';
import {
  CATEGORY_FILTERS,
  DEFAULT_CATEGORY_FORM,
} from '@/route-modules/(app)/(tabs)/categories/_constants';
import { styles } from '@/route-modules/(app)/(tabs)/categories/_styles';
import type { CategoryFilter } from '@/route-modules/(app)/(tabs)/categories/_types';
import type { CategoryListItem } from '@bit-chain/api-contracts';
import { Tabs } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ErrorScreen, LoadingScreen, SummaryCard } from '~/src/components/ui';
import { colors } from '~/src/design/tokens';
import {
  useCategories as useCategoriesHook,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '~/src/hooks/useCategories';

export default function CategoriesScreen() {
  const { data, isLoading, isRefetching, error, refetch } = useCategoriesHook();
  const { mutateAsync: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutateAsync: deleteCategory } = useDeleteCategory();

  const [filter, setFilter] = useState<CategoryFilter>('ALL');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryListItem | null>(null);
  const insets = useSafeAreaInsets();

  const refetchCb = useCallback(() => refetch(), [refetch]);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEdit = (cat: CategoryListItem) => {
    setEditingCategory(cat);
    setShowForm(true);
  };

  const handleDelete = (cat: CategoryListItem) => {
    if (cat.transactionCount > 0) {
      Alert.alert(
        'Cannot Delete',
        `"${cat.name}" has ${cat.transactionCount} transaction${cat.transactionCount === 1 ? '' : 's'} and cannot be deleted.`,
      );
      return;
    }
    Alert.alert('Delete Category', `Delete "${cat.name}"? This action cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCategory(cat.id);
          } catch {
            Alert.alert('Error', 'Failed to delete category');
          }
        },
      },
    ]);
  };

  const handleSubmit = async (form: typeof DEFAULT_CATEGORY_FORM) => {
    if (!form.name.trim()) {
      Alert.alert('Validation', 'Category name is required');
      return;
    }
    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id,
          name: form.name.trim(),
          color: form.color,
          icon: form.icon.trim() || undefined,
        });
      } else {
        await createCategory({
          name: form.name.trim(),
          type: form.type,
          color: form.color,
          icon: form.icon.trim() || undefined,
        });
      }
      setShowForm(false);
    } catch {
      Alert.alert('Error', 'Failed to save category');
    }
  };

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
          <Pressable
            style={[styles.headerBtn, { backgroundColor: colors.brand, borderColor: colors.brand }]}
            onPress={handleOpenCreate}
            hitSlop={8}
          >
            <Text style={[styles.headerIcon, { color: colors.white }]}>+</Text>
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
            <CategoryList categories={filtered} onEdit={handleEdit} onDelete={handleDelete} />
          </View>
        )}
      </ScrollView>

      <CategoryForm
        visible={showForm}
        initial={editingCategory}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmit}
        isLoading={isCreating || isUpdating}
      />
    </SafeAreaView>
  );
}
