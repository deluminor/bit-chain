import type { CSSProperties } from 'react';

export const periodHeaderIconStyle: CSSProperties = {
  color: '#FF5722',
};

export const categorySwatchStyle = (color: string | undefined): CSSProperties => ({
  backgroundColor: color ?? 'var(--muted)',
});
