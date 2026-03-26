import type { CategoryListItem } from '@bit-chain/api-contracts';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge, Separator } from '~/src/components/ui';
import { colors } from '~/src/design/tokens';
import { COLOR_SWATCHES, DEFAULT_CATEGORY_FORM } from './_constants';
import { formStyles, rowStyles } from './_styles';

const isEmoji = (str: string) => str.length > 0 && /\P{ASCII}/u.test(str);

export function CategoryRow({
  category: cat,
  onEdit,
}: {
  category: CategoryListItem;
  onEdit: (cat: CategoryListItem) => void;
}) {
  const isIncome = cat.type === 'INCOME';
  return (
    <Pressable
      style={({ pressed }) => [rowStyles.row, pressed && rowStyles.rowPressed]}
      onPress={() => onEdit(cat)}
    >
      <View style={[rowStyles.dot, { backgroundColor: cat.color ?? colors.textMuted }]} />
      <View style={rowStyles.info}>
        <View style={rowStyles.nameRow}>
          {cat.icon && isEmoji(cat.icon) ? <Text style={rowStyles.icon}>{cat.icon}</Text> : null}
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
      <View style={rowStyles.rowTypeWrap}>
        <Badge label={isIncome ? 'INCOME' : 'EXPENSE'} variant={isIncome ? 'success' : 'error'} />
      </View>
    </Pressable>
  );
}

export function CategoryList({
  categories,
  onEdit,
}: {
  categories: CategoryListItem[];
  onEdit: (cat: CategoryListItem) => void;
}) {
  return (
    <>
      {categories.map((cat, index) => (
        <View key={cat.id}>
          <CategoryRow category={cat} onEdit={onEdit} />
          {index < categories.length - 1 && <Separator />}
        </View>
      ))}
    </>
  );
}

export function CategoryForm({
  visible,
  initial,
  onClose,
  onSubmit,
  onDelete,
  isLoading,
}: {
  visible: boolean;
  initial?: CategoryListItem | null;
  onClose: () => void;
  onSubmit: (data: typeof DEFAULT_CATEGORY_FORM) => void;
  onDelete?: () => void;
  isLoading: boolean;
}) {
  const [form, setForm] = useState<typeof DEFAULT_CATEGORY_FORM>(() =>
    initial
      ? {
          name: initial.name,
          type: initial.type as 'INCOME' | 'EXPENSE',
          color: (initial.color ?? COLOR_SWATCHES[0]) as string,
          icon: initial.icon ?? '',
        }
      : DEFAULT_CATEGORY_FORM,
  );

  const set = useCallback(
    (key: keyof typeof DEFAULT_CATEGORY_FORM) => (value: string) =>
      setForm(f => ({ ...f, [key]: value })),
    [],
  );

  const canDelete = !!initial && !initial.isDefault && !!onDelete;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={formStyles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <SafeAreaView style={formStyles.safe} edges={['top', 'left', 'right', 'bottom']}>
          <View style={formStyles.header}>
            <Text style={formStyles.title}>{initial ? 'Edit Category' : 'New Category'}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Text style={formStyles.close}>✕</Text>
            </Pressable>
          </View>

          <ScrollView
            style={formStyles.scroll}
            contentContainerStyle={formStyles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {!initial && (
              <>
                <Text style={formStyles.label}>Type *</Text>
                <View style={formStyles.typeRow}>
                  {(['INCOME', 'EXPENSE'] as const).map(t => (
                    <Pressable
                      key={t}
                      style={[formStyles.typeBtn, form.type === t && formStyles.typeBtnActive]}
                      onPress={() => setForm(f => ({ ...f, type: t }))}
                    >
                      <Text
                        style={[
                          formStyles.typeBtnText,
                          form.type === t && formStyles.typeBtnTextActive,
                        ]}
                      >
                        {t === 'INCOME' ? '📈 Income' : '📉 Expense'}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </>
            )}

            <Text style={formStyles.label}>Icon (emoji)</Text>
            <TextInput
              style={formStyles.input}
              value={form.icon}
              onChangeText={set('icon')}
              placeholder="e.g. 🍔"
              placeholderTextColor={colors.textDisabled}
              maxLength={4}
            />

            <Text style={formStyles.label}>Name *</Text>
            <TextInput
              style={formStyles.input}
              value={form.name}
              onChangeText={set('name')}
              placeholder="e.g. Groceries"
              placeholderTextColor={colors.textDisabled}
              maxLength={100}
              autoFocus
            />

            <Text style={formStyles.label}>Color</Text>
            <View style={formStyles.swatchGrid}>
              {COLOR_SWATCHES.map(c => (
                <Pressable
                  key={c}
                  style={[
                    formStyles.swatch,
                    { backgroundColor: c },
                    form.color === c && formStyles.swatchSelected,
                  ]}
                  onPress={() => set('color')(c)}
                />
              ))}
            </View>
          </ScrollView>

          <View style={formStyles.footer}>
            {canDelete && (
              <Pressable
                style={[formStyles.deleteBtn, isLoading && { opacity: 0.6 }]}
                onPress={onDelete}
                disabled={isLoading}
              >
                <Text style={formStyles.deleteBtnText}>Delete Category</Text>
              </Pressable>
            )}
            <Pressable
              style={[formStyles.submitBtn, isLoading && { opacity: 0.6 }]}
              onPress={() => onSubmit(form)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <Text style={formStyles.submitText}>
                  {initial ? 'Save Changes' : 'Create Category'}
                </Text>
              )}
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
