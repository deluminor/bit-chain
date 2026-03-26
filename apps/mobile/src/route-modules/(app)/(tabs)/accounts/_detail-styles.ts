import { Platform, StyleSheet } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '~/src/design/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  scroll: {
    padding: spacing.base,
    gap: spacing.md,
    paddingBottom: spacing['5xl'] + spacing.base,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarIcon: {
    fontSize: 28,
  },
  accountName: {
    color: colors.textPrimary,
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
  },
  accountType: {
    color: colors.textMuted,
    fontSize: fontSize.base,
    marginTop: 2,
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSize.base,
    marginTop: spacing.sm,
    lineHeight: fontSize.base * 1.5,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  metaDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  metaLabel: {
    color: colors.textMuted,
    fontSize: fontSize.base,
  },
  metaValue: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
  statusBadge: {
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  statusText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  monobankTag: {
    backgroundColor: colors.brandSubtle,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  monobankText: {
    color: colors.brand,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  editBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.brand,
  },
  editBtnText: {
    color: colors.brand,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },

  modalRoot: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    paddingTop: Platform.OS === 'ios' ? spacing.lg : spacing.base,
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  modalCancel: {
    color: colors.textSecondary,
    fontSize: fontSize.base,
  },
  modalSave: {
    color: colors.brand,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  modalSaveDisabled: {
    opacity: 0.4,
  },
  modalScroll: {
    padding: spacing.base,
    paddingBottom: spacing['5xl'] + spacing.base,
    gap: spacing.sm,
  },

  fieldLabel: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    marginBottom: 4,
    marginTop: spacing.sm,
  },
  fieldInput: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    color: colors.textPrimary,
    fontSize: fontSize.base,
  },
  fieldInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  colorSwatches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorSwatchActive: {
    borderWidth: 3,
    borderColor: colors.white,
  },
});
