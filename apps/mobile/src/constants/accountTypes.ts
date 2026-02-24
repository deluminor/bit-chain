import { colors } from '~/src/design/tokens';
import type { AccountType } from '@bit-chain/api-contracts';

export interface AccountTypeMeta {
  /** Human-readable label shown in the UI. */
  readonly label:        string;
  /** Emoji icon representing the account type. */
  readonly icon:         string;
  /** Default accent colour used when the account has no custom colour. */
  readonly defaultColor: string;
}

/**
 * Visual metadata keyed by account type.
 *
 * @example
 * ```ts
 * const meta = ACCOUNT_TYPE_META[account.type] ?? ACCOUNT_TYPE_META_FALLBACK;
 * ```
 */
export const ACCOUNT_TYPE_META: Record<AccountType, AccountTypeMeta> = {
  BANK_CARD:  { label: 'Bank Card',  icon: '💳', defaultColor: colors.brand   },
  CASH:       { label: 'Cash',       icon: '💵', defaultColor: colors.income  },
  INVESTMENT: { label: 'Investment', icon: '📈', defaultColor: colors.purple  },
  CRYPTO:     { label: 'Crypto',     icon: '₿',  defaultColor: colors.warning },
  SAVINGS:    { label: 'Savings',    icon: '🏦', defaultColor: colors.info    },
} as const;

/**
 * Fallback metadata for unknown / future account types.
 */
export const ACCOUNT_TYPE_META_FALLBACK: AccountTypeMeta = {
  label:        'Account',
  icon:         '💰',
  defaultColor: colors.textMuted,
};
