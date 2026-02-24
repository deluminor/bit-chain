import React, { useState } from 'react';
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
import { colors, fontSize, fontWeight, radius, spacing } from '~/src/design/tokens';
import { useAccounts } from '~/src/hooks/useAccounts';
import { useCategories } from '~/src/hooks/useCategories';
import { createTransactionSchema } from '~/src/hooks/useTransactions';
import { formatCurrency } from '~/src/utils/format';

export type TransactionFormValues = {
  id?: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  amount: string;
  accountId: string;
  categoryId: string;
  transferToId: string;
  description: string;
  date: Date;
};

type Props = {
  initialValues?: Partial<TransactionFormValues>;
  onSubmit: (values: any) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  onDelete?: () => void;
  isDeleting?: boolean;
};

export function TransactionForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Save Transaction',
  onDelete,
  isDeleting = false,
}: Props) {
  const { data: accountsData } = useAccounts();
  const { data: categoriesData } = useCategories();

  const accounts = accountsData?.accounts ?? [];
  const categories = categoriesData?.categories ?? [];

  const [type, setType] = useState<'INCOME' | 'EXPENSE' | 'TRANSFER'>(
    initialValues?.type || 'EXPENSE',
  );

  // Set default account if none provided but accounts are loaded
  const defaultAccountId = accounts?.[0]?.id || '';

  const [amount, setAmount] = useState(initialValues?.amount || '');
  const [accountId, setAccountId] = useState(initialValues?.accountId || '');
  const [categoryId, setCategoryId] = useState(initialValues?.categoryId || '');
  const [transferToId, setTransferToId] = useState(initialValues?.transferToId || '');
  const [description, setDescription] = useState(initialValues?.description || '');

  // Auto-select first category matching type
  const availableCategories = categories.filter(c => c.type === type);

  const handleSubmit = () => {
    // Validate with Zod
    const payload = {
      type,
      amount: parseFloat(amount.replace(/,/, '.')),
      accountId: accountId || defaultAccountId,
      categoryId: type !== 'TRANSFER' ? categoryId : undefined,
      transferToId: type === 'TRANSFER' ? transferToId : undefined,
      description: description.trim() || undefined,
      date: initialValues?.date || new Date(),
    };

    const validateResult = createTransactionSchema.safeParse(payload);

    if (!validateResult.success) {
      const errorMsg = validateResult.error.errors.map(e => e.message).join('\n');
      Alert.alert('Validation Error', errorMsg);
      return;
    }

    if (initialValues?.id) {
      onSubmit({ ...validateResult.data, id: initialValues.id });
    } else {
      onSubmit(validateResult.data);
    }
  };

  const activeAccountId = accountId || defaultAccountId;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Type Selector */}
        <View style={styles.typeRow}>
          {['EXPENSE', 'INCOME', 'TRANSFER'].map(t => (
            <Pressable
              key={t}
              style={[styles.typeBtn, type === t && styles.typeBtnActive]}
              onPress={() => setType(t as any)}
            >
              <Text style={[styles.typeBtnText, type === t && styles.typeBtnTextActive]}>{t}</Text>
            </Pressable>
          ))}
        </View>

        {/* Amount */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor={colors.textDisabled}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            editable={!isSubmitting}
          />
        </View>

        {/* Account */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{type === 'TRANSFER' ? 'From Account' : 'Account'}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {accounts.map(acc => (
              <Pressable
                key={acc.id}
                style={[styles.chip, activeAccountId === acc.id && styles.chipActive]}
                onPress={() => setAccountId(acc.id)}
              >
                <Text
                  style={[styles.chipText, activeAccountId === acc.id && styles.chipTextActive]}
                >
                  {acc.name} ({formatCurrency(acc.balance, acc.currency)})
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Transfer Destination or Category */}
        {type === 'TRANSFER' ? (
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>To Account</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
            >
              {accounts
                .filter(a => a.id !== activeAccountId)
                .map(acc => (
                  <Pressable
                    key={acc.id}
                    style={[styles.chip, transferToId === acc.id && styles.chipActive]}
                    onPress={() => setTransferToId(acc.id)}
                  >
                    <Text
                      style={[styles.chipText, transferToId === acc.id && styles.chipTextActive]}
                    >
                      {acc.name}
                    </Text>
                  </Pressable>
                ))}
            </ScrollView>
          </View>
        ) : (
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
            >
              {availableCategories.map(cat => (
                <Pressable
                  key={cat.id}
                  style={[styles.chip, categoryId === cat.id && styles.chipActive]}
                  onPress={() => setCategoryId(cat.id)}
                >
                  <Text style={[styles.chipText, categoryId === cat.id && styles.chipTextActive]}>
                    {cat.name}
                  </Text>
                </Pressable>
              ))}
              {availableCategories.length === 0 && (
                <Text style={styles.emptyText}>No categories found</Text>
              )}
            </ScrollView>
          </View>
        )}

        {/* Description */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="What was this for?"
            placeholderTextColor={colors.textDisabled}
            value={description}
            onChangeText={setDescription}
            editable={!isSubmitting}
          />
        </View>
      </ScrollView>

      {/* Submit/Delete buttons at the bottom */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.btn, isSubmitting && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting || isDeleting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.btnText}>{submitLabel}</Text>
          )}
        </Pressable>

        {onDelete && (
          <Pressable
            style={[styles.deleteBtn, isDeleting && styles.btnDisabled]}
            onPress={() => {
              Alert.alert(
                'Delete Transaction',
                'Are you sure you want to delete this transaction?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: onDelete },
                ],
              );
            }}
            disabled={isSubmitting || isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator color={colors.expense} />
            ) : (
              <Text style={styles.deleteBtnText}>Delete Transaction</Text>
            )}
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  scroll: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing['3xl'], // Increased top padding
    paddingBottom: spacing['4xl'],
    gap: spacing.xl,
  },
  footer: {
    padding: spacing.base,
    paddingBottom: Platform.OS === 'ios' ? spacing['4xl'] : spacing.base,
    backgroundColor: colors.bgBase,
    borderTopWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },

  // Type selector
  typeRow: {
    flexDirection: 'row',
    backgroundColor: colors.bgSurface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xs,
    gap: spacing.xs,
  },
  typeBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  typeBtnActive: {
    backgroundColor: colors.brandSubtle,
  },
  typeBtnText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  typeBtnTextActive: {
    color: colors.brand,
  },

  // Fields
  fieldGroup: {
    gap: spacing.sm,
  },
  label: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    height: 52,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.bgSurface,
    paddingHorizontal: spacing.base,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },

  // Chips
  chipRow: {
    gap: spacing.sm,
    paddingRight: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.bgSurface,
  },
  chipActive: {
    borderColor: colors.brand,
    backgroundColor: colors.brandDim,
  },
  chipText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  chipTextActive: {
    color: colors.white,
    fontWeight: fontWeight.semibold,
  },
  emptyText: {
    color: colors.textDisabled,
    fontStyle: 'italic',
  },

  // Submit button
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
  deleteBtn: {
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.bgSurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.expenseSubtle,
  },
  deleteBtnText: {
    color: colors.expense,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
});
