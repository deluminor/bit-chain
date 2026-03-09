import type { CSSProperties } from 'react';

export const transactionIconStyle = (color: string | undefined): CSSProperties => ({
  color: color ?? 'var(--muted-foreground)',
});

export const selectedTransactionTypeStyle = (
  isSelected: boolean,
  color: string,
): CSSProperties | undefined => {
  if (!isSelected) {
    return undefined;
  }

  return {
    borderColor: color,
    color,
  };
};

export const colorSwatchStyle = (color: string | undefined): CSSProperties => ({
  backgroundColor: color ?? 'var(--muted)',
});

export const submitButtonStyle = (color: string | undefined): CSSProperties => ({
  backgroundColor: color ?? 'var(--primary)',
});
