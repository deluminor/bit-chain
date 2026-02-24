import { createBudgetSchema, type CreateBudgetRequest } from '@bit-chain/api-contracts';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ErrorScreen, LoadingScreen } from '~/src/components/ui';
import { colors, fontSize, fontWeight, radius, spacing } from '~/src/design/tokens';
import { useBudgets, useCreateBudget, useUpdateBudget } from '~/src/hooks/useBudgets';
import { useCategories } from '~/src/hooks/useCategories';

export default function EditBudgetScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: budgetsData, isLoading: budgetsLoading } = useBudgets();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { mutate: createBudget, isPending: isCreating } = useCreateBudget();
  const { mutate: updateBudget, isPending: isUpdating } = useUpdateBudget();

  const isEditing = !!id;
  const isSubmitting = isCreating || isUpdating;

  const existingBudget = useMemo(() => {
    if (!id || !budgetsData) return null;
    return budgetsData.budgets.find(b => b.id === id);
  }, [id, budgetsData]);

  const expenseCategories = useMemo(() => {
    if (!categoriesData) return [];
    return categoriesData.categories.filter(c => c.type === 'EXPENSE');
  }, [categoriesData]);

  // Determine initial values
  const defaultValues: Partial<CreateBudgetRequest> = useMemo(() => {
    if (existingBudget) {
      return {
        name: existingBudget.name,
        period: existingBudget.period as 'MONTHLY' | 'YEARLY' | 'CUSTOM',
        startDate: existingBudget.startDate,
        endDate: existingBudget.endDate,
        currency: existingBudget.currency,
        totalPlanned: existingBudget.totalPlannedBase,
        categories: existingBudget.categories.map(c => ({
          categoryId: c.categoryId,
          planned: c.plannedBase,
        })),
      };
    }

    // Defaults for new budget
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    return {
      name: 'Monthly Budget',
      period: 'MONTHLY',
      startDate: startOfMonth.toISOString(),
      endDate: endOfMonth.toISOString(),
      currency: 'UAH',
      totalPlanned: 0,
      categories: [],
    };
  }, [existingBudget]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateBudgetRequest>({
    resolver: zodResolver(createBudgetSchema) as any,
    defaultValues: defaultValues as any,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'categories',
  });

  if ((isEditing && budgetsLoading) || categoriesLoading) {
    return <LoadingScreen label="Loading budget data..." />;
  }

  if (isEditing && !existingBudget) {
    return <ErrorScreen message="Budget not found" onRetry={() => router.back()} />;
  }

  const onSubmit = (data: CreateBudgetRequest) => {
    if (isEditing) {
      updateBudget({ ...data, id } as any, {
        onSuccess: () => router.back(),
        onError: err => Alert.alert('Update failed', err.message),
      });
    } else {
      createBudget(data, {
        onSuccess: () => router.back(),
        onError: err => Alert.alert('Creation failed', err.message),
      });
    }
  };

  const addCategory = () => {
    if (expenseCategories.length === 0) return;
    // Don't add a category if it's already in the list
    const usedIds = fields.map(f => f.categoryId);
    const available = expenseCategories.find(c => !usedIds.includes(c.id));

    if (available) {
      append({ categoryId: available.id, planned: 0 });
    } else {
      Alert.alert('Info', 'All expense categories are already added.');
    }
  };

  // Recalculate total planned when category amounts change
  const watchCategories = watch('categories');
  React.useEffect(() => {
    const total = watchCategories.reduce((sum, item) => sum + (Number(item.planned) || 0), 0);
    setValue('totalPlanned', total);
  }, [watchCategories, setValue]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ title: isEditing ? 'Edit Budget' : 'New Budget' }} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* BUDGET NAME */}
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Budget Name</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  placeholder="e.g. February Expenses"
                  placeholderTextColor={colors.textDisabled}
                />
              )}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
          </View>

          {/* TOTAL PLANNED (Readonly auto-computed sum) */}
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Total Planned Amount</Text>
            <View style={[styles.input, styles.inputDisabled]}>
              <Text style={styles.readOnlyText}>{watch('totalPlanned')} UAH</Text>
            </View>
            <Text style={styles.hintText}>Automatically calculated from categories.</Text>
          </View>

          <View style={styles.sectionHeaderWrap}>
            <Text style={styles.sectionTitle}>Category Targets</Text>
            <Pressable onPress={addCategory} style={styles.addCatBtn}>
              <Text style={styles.addCatText}>+ Add Category</Text>
            </Pressable>
          </View>

          {errors.categories?.root && (
            <Text style={styles.errorText}>{errors.categories.root.message}</Text>
          )}

          {fields.length === 0 ? (
            <View style={styles.emptyCategories}>
              <Text style={styles.emptyCategoriesText}>No categories added yet.</Text>
            </View>
          ) : (
            <View style={styles.categoriesList}>
              {fields.map((field, index) => (
                <View key={field.id} style={styles.catRow}>
                  <View style={styles.catInputWrap}>
                    <Text style={styles.catLabel}>Category</Text>
                    <Controller
                      control={control}
                      name={`categories.${index}.categoryId`}
                      render={({ field: { value, onChange } }) => (
                        // Basic implementation — a real app would use a BottomSheet picker here
                        // For now, we cycle through available categories on tap
                        <Pressable
                          style={styles.input}
                          onPress={() => {
                            if (expenseCategories.length === 0) return;
                            const idx = expenseCategories.findIndex(c => c.id === value);
                            const nextIdx = (idx + 1) % expenseCategories.length;
                            onChange(expenseCategories[nextIdx]?.id);
                          }}
                        >
                          <Text style={styles.inputText}>
                            {expenseCategories.find(c => c.id === value)?.name || 'Select...'}
                          </Text>
                        </Pressable>
                      )}
                    />
                  </View>

                  <View style={[styles.catInputWrap, { flex: 0.6 }]}>
                    <Text style={styles.catLabel}>Limit</Text>
                    <Controller
                      control={control}
                      name={`categories.${index}.planned`}
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          style={styles.input}
                          value={value.toString()}
                          onChangeText={v => onChange(Number(v) || 0)}
                          keyboardType="numeric"
                          placeholder="0"
                          placeholderTextColor={colors.textDisabled}
                        />
                      )}
                    />
                  </View>

                  <Pressable style={styles.removeBtn} onPress={() => remove(index)}>
                    <Text style={styles.removeIcon}>×</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
        <View style={styles.footer}>
          <Pressable
            style={[styles.btn, isSubmitting && styles.btnDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.btnText}>Save Budget</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  scroll: {
    padding: spacing.base,
    paddingTop: spacing.xs,
    gap: spacing.xl,
    paddingBottom: spacing['4xl'],
  },
  fieldBlock: {
    gap: spacing.xs,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
    marginLeft: 4,
  },
  input: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 48,
    color: colors.textPrimary,
    fontSize: fontSize.base,
    justifyContent: 'center',
  },
  inputText: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
  },
  inputDisabled: {
    backgroundColor: colors.bgMuted,
    borderColor: colors.border,
  },
  readOnlyText: {
    color: colors.textMuted,
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
  },
  hintText: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginLeft: 4,
  },
  errorText: {
    color: colors.error,
    fontSize: fontSize.sm,
    marginTop: 4,
    marginLeft: 4,
  },
  sectionHeaderWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  addCatBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    backgroundColor: colors.brandSubtle,
    borderRadius: radius.sm,
  },
  addCatText: {
    color: colors.brand,
    fontWeight: fontWeight.bold,
    fontSize: fontSize.sm,
  },
  categoriesList: {
    gap: spacing.md,
    backgroundColor: colors.bgSurface,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyCategories: {
    padding: spacing.xl,
    alignItems: 'center',
    backgroundColor: colors.bgSurface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  emptyCategoriesText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  catRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-end',
  },
  catInputWrap: {
    flex: 1,
    gap: 4,
  },
  catLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginLeft: 4,
  },
  removeBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.expenseSubtle,
    borderRadius: radius.md,
  },
  removeIcon: {
    color: colors.expense,
    fontSize: 24,
    lineHeight: 28,
  },
  footer: {
    padding: spacing.base,
    paddingBottom: Platform.OS === 'ios' ? spacing['4xl'] : spacing.base,
    backgroundColor: colors.bgBase,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  btn: {
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
});
