import type { CSSProperties } from 'react';

export const transactionCategorySwatchStyle = (color: string | undefined): CSSProperties => ({
  backgroundColor: color ?? 'var(--muted)',
});
