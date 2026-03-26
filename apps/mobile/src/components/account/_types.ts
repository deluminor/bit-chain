import type { AccountType } from '@bit-chain/api-contracts';

export interface AccountRowData {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  description?: string | null;
  isActive: boolean;
  transactionCount: number;
  color?: string | null;
  isMonobank: boolean;
}

export interface AccountRowProps {
  account: AccountRowData;
  onPress?: () => void;
}
