import type { AccountType } from '@bit-chain/api-contracts';
import { colors } from '~/src/design/tokens';

export interface AccountTypeMeta {
  label: string;
  icon: string;
  defaultColor: string;
}

export const ACCOUNT_TYPE_META: Record<AccountType, AccountTypeMeta> = {
  BANK_CARD: { label: 'Bank Card', icon: '💳', defaultColor: colors.brand },
  CASH: { label: 'Cash', icon: '💵', defaultColor: colors.income },
  INVESTMENT: { label: 'Investment', icon: '📈', defaultColor: colors.purple },
  CRYPTO: { label: 'Crypto', icon: '₿', defaultColor: colors.warning },
  SAVINGS: { label: 'Savings', icon: '🏦', defaultColor: colors.info },
} as const;

export const ACCOUNT_TYPE_META_FALLBACK: AccountTypeMeta = {
  label: 'Account',
  icon: '💰',
  defaultColor: colors.textMuted,
};
