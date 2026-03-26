import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { AccountRowData } from '~/src/components/account/AccountRow';
import { colors, fontSize, fontWeight, radius, spacing } from '~/src/design/tokens';

const COLOR_SWATCHES = [
  '#10B981',
  '#3B82F6',
  '#8B5CF6',
  '#F59E0B',
  '#EF4444',
  '#EC4899',
  '#06B6D4',
  '#F97316',
  '#84CC16',
  '#14B8A6',
  '#F43F5E',
  '#A78BFA',
] as const;

interface EditForm {
  name: string;
  balance: string;
  description: string;
  color: string;
}

interface AccountEditModalProps {
  account: AccountRowData | null;
  isUpdating: boolean;
  onSave: (form: {
    name?: string;
    balance?: number;
    description?: string | null;
    color?: string | null;
  }) => Promise<void>;
  onClose: () => void;
}

export function AccountEditModal({ account, isUpdating, onSave, onClose }: AccountEditModalProps) {
  const [form, setForm] = useState<EditForm>({ name: '', balance: '', description: '', color: '' });

  useEffect(() => {
    if (account) {
      setForm({
        name: account.name,
        balance: String(account.balance),
        description: account.description ?? '',
        color: account.color ?? '',
      });
    }
  }, [account]);

  const handleSave = async () => {
    if (!account) return;

    const trimmedName = form.name.trim();
    if (!trimmedName) {
      Alert.alert('Validation', 'Account name is required');
      return;
    }

    const normalized = form.balance.trim().replace(',', '.');
    const parsedBalance = /^-?\d+(\.\d+)?$/.test(normalized) ? Number(normalized) : NaN;
    if (isNaN(parsedBalance)) {
      Alert.alert('Validation', 'Balance must be a valid number');
      return;
    }

    const normalizedDescription = form.description.trim();
    const nextDescription = normalizedDescription.length > 0 ? normalizedDescription : null;
    const nextColor = form.color.trim() || null;

    await onSave({
      name: trimmedName !== account.name ? trimmedName : undefined,
      balance: parsedBalance !== account.balance ? parsedBalance : undefined,
      description: nextDescription !== (account.description ?? null) ? nextDescription : undefined,
      color: nextColor !== (account.color ?? null) ? nextColor : undefined,
    });
  };

  return (
    <Modal
      visible={account !== null}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Pressable onPress={onClose} hitSlop={8}>
            <Text style={styles.cancel}>Cancel</Text>
          </Pressable>
          <Text style={styles.title}>Edit Account</Text>
          <Pressable onPress={handleSave} disabled={isUpdating} hitSlop={8}>
            <Text style={[styles.save, isUpdating && styles.saveDisabled]}>
              {isUpdating ? 'Saving…' : 'Save'}
            </Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={form.name}
            onChangeText={v => setForm(f => ({ ...f, name: v }))}
            placeholder="Account name"
            placeholderTextColor={colors.textDisabled}
            maxLength={50}
            returnKeyType="next"
          />

          <Text style={styles.label}>Balance</Text>
          <TextInput
            style={styles.input}
            value={form.balance}
            onChangeText={v => setForm(f => ({ ...f, balance: v }))}
            placeholder="0"
            placeholderTextColor={colors.textDisabled}
            keyboardType="decimal-pad"
            returnKeyType="next"
          />

          <Text style={styles.label}>Description (optional)</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={form.description}
            onChangeText={v => setForm(f => ({ ...f, description: v }))}
            placeholder="Add a note…"
            placeholderTextColor={colors.textDisabled}
            multiline
            maxLength={200}
          />

          <Text style={styles.label}>Color</Text>
          <View style={styles.swatches}>
            {COLOR_SWATCHES.map(swatch => (
              <Pressable
                key={swatch}
                style={[
                  styles.swatch,
                  { backgroundColor: swatch },
                  form.color === swatch && styles.swatchActive,
                ]}
                onPress={() => setForm(f => ({ ...f, color: swatch }))}
              />
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingTop: Platform.OS === 'ios' ? spacing.lg : spacing.base,
    paddingBottom: spacing.base,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  cancel: {
    color: colors.textSecondary,
    fontSize: fontSize.base,
  },
  save: {
    color: colors.brand,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  saveDisabled: {
    opacity: 0.4,
  },
  scroll: {
    padding: spacing.base,
    paddingBottom: spacing['5xl'],
    gap: spacing.sm,
  },
  label: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    color: colors.textPrimary,
    fontSize: fontSize.base,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  swatches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  swatchActive: {
    borderWidth: 3,
    borderColor: colors.white,
  },
});
