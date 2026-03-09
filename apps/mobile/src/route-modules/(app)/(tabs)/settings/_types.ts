import type React from 'react';

export interface SettingsRowProps {
  label: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
  rightSlot?: React.ReactNode;
  disabled?: boolean;
}
