import {
  createBudgetSchema,
  type Budget,
  type CreateBudgetRequest,
} from '@bit-chain/api-contracts';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { z } from 'zod';
import { ErrorScreen, LoadingScreen } from '~/src/components/ui';
import { colors } from '~/src/design/tokens';
import { useBudgets, useCreateBudget, useUpdateBudget } from '~/src/hooks/useBudgets';
import { useCategories } from '~/src/hooks/useCategories';
import { styles } from './_edit-styles';

type BudgetFormValues = z.input<typeof createBudgetSchema>;

function getBudgetFormDefaults(existingBudget: Budget | null): BudgetFormValues {
  if (existingBudget) {
    return {
      name: existingBudget.name,
      period: existingBudget.period,
      startDate: existingBudget.startDate,
      endDate: existingBudget.endDate,
      currency: existingBudget.currency,
      totalPlanned: existingBudget.totalPlannedBase,
      categories: existingBudget.categories.map(category => ({
        categoryId: category.categoryId,
        planned: category.plannedBase,
      })),
      isTemplate: existingBudget.isTemplate,
      templateName: existingBudget.templateName,
      autoApply: existingBudget.autoApply,
    };
  }

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
    isTemplate: false,
    templateName: null,
    autoApply: false,
  };
}

export default function EditBudgetScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data: budgetsData, isLoading: budgetsLoading } = useBudgets();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { mutate: createBudget, isPending: isCreating } = useCreateBudget();
  const { mutate: updateBudget, isPending: isUpdating } = useUpdateBudget();

  const isEditing = Boolean(id);
  const isSubmitting = isCreating || isUpdating;

  const existingBudget = useMemo(() => {
    if (!id || !budgetsData) return null;
    return budgetsData.budgets.find(budget => budget.id === id) ?? null;
  }, [id, budgetsData]);

  const expenseCategories = useMemo(() => {
    if (!categoriesData) return [];
    return categoriesData.categories.filter(category => category.type === 'EXPENSE');
  }, [categoriesData]);

  const defaultValues = useMemo(() => getBudgetFormDefaults(existingBudget), [existingBudget]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(createBudgetSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray<BudgetFormValues, 'categories'>({
    control,
    name: 'categories',
  });

  if ((isEditing && budgetsLoading) || categoriesLoading) {
    return <LoadingScreen label="Loading budget data..." />;
  }

  if (isEditing && !existingBudget) {
    return <ErrorScreen message="Budget not found" onRetry={() => router.back()} />;
  }

  const onSubmit = (data: BudgetFormValues) => {
    const payload: CreateBudgetRequest = createBudgetSchema.parse(data);

    if (isEditing && id) {
      updateBudget(
        { ...payload, id },
        {
          onSuccess: () => router.back(),
          onError: error => Alert.alert('Update failed', error.message),
        },
      );
      return;
    }

    createBudget(payload, {
      onSuccess: () => router.back(),
      onError: error => Alert.alert('Creation failed', error.message),
    });
  };

  const addCategory = () => {
    if (expenseCategories.length === 0) return;

    const usedIds = fields.map(field => field.categoryId);
    const available = expenseCategories.find(category => !usedIds.includes(category.id));

    if (available) {
      append({ categoryId: available.id, planned: 0 });
      return;
    }

    Alert.alert('Info', 'All expense categories are already added.');
  };

  const watchCategories = watch('categories');
  useEffect(() => {
    const categories = watchCategories ?? [];
    const total = categories.reduce((sum, item) => sum + (Number(item.planned) || 0), 0);
    setValue('totalPlanned', total);
  }, [watchCategories, setValue]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ title: isEditing ? 'Edit Budget' : 'New Budget' }} />
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
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
                        <Pressable
                          style={styles.input}
                          onPress={() => {
                            if (expenseCategories.length === 0) return;
                            const currentIndex = expenseCategories.findIndex(
                              category => category.id === value,
                            );
                            const nextIndex = (currentIndex + 1) % expenseCategories.length;
                            const nextCategory = expenseCategories[nextIndex];
                            if (nextCategory) {
                              onChange(nextCategory.id);
                            }
                          }}
                        >
                          <Text style={styles.inputText}>
                            {expenseCategories.find(category => category.id === value)?.name ||
                              'Select...'}
                          </Text>
                        </Pressable>
                      )}
                    />
                  </View>

                  <View style={[styles.catInputWrap, styles.catInputWrapCompact]}>
                    <Text style={styles.catLabel}>Limit</Text>
                    <Controller
                      control={control}
                      name={`categories.${index}.planned`}
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          style={styles.input}
                          value={String(value)}
                          onChangeText={rawValue => onChange(Number(rawValue) || 0)}
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
