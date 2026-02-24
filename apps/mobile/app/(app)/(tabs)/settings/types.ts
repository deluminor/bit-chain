import type React from 'react';

export interface SettingsRowProps {
  /** Row label text displayed on the left side. */
  label:       string;

  /** Optional secondary value text displayed on the right. */
  value?:      string;

  /** Called when the user taps the row. Omit to render as non-interactive. */
  onPress?:    () => void;

  /** Renders the label in error/destructive colour (e.g. "Sign Out"). */
  destructive?: boolean;

  /** Optional custom slot rendered to the right of `value`. */
  rightSlot?:  React.ReactNode;

  /** Dims the row and disables tap interaction. */
  disabled?:   boolean;
}
