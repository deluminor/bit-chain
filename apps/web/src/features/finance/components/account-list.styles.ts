import type { CSSProperties } from 'react';

export const accountColorSwatchStyle = (color: string | undefined): CSSProperties => ({
  backgroundColor: color ?? '#3B82F6',
});
