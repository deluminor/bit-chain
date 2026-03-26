export const colors = {
  // Backgrounds
  bgBase: '#000000',
  bgSurface: '#111111',
  bgElevated: '#1A1A1A',
  bgMuted: '#222222',

  // Text
  textPrimary: '#f1f5f9',
  textSecondary: '#8A8A8A',
  textMuted: '#555555',
  textDisabled: '#3A3A3A',

  // Brand
  brand: '#00E676',
  brandDim: '#00A854',
  brandSubtle: 'rgba(0, 230, 118, 0.12)',
  brandGlow: 'rgba(0, 230, 118, 0.15)',

  // Semantic
  success: '#22c55e',
  successSubtle: 'rgba(34, 197, 94, 0.12)',
  error: '#ef4444',
  errorSubtle: 'rgba(239, 68, 68, 0.12)',
  warning: '#f59e0b',
  warningSubtle: 'rgba(245, 158, 11, 0.12)',
  info: '#06b6d4',
  infoSubtle: 'rgba(6, 182, 212, 0.12)',

  // Financial
  income: '#22c55e',
  incomeSubtle: 'rgba(34, 197, 94, 0.12)',
  expense: '#ef4444',
  expenseSubtle: 'rgba(239, 68, 68, 0.12)',
  transfer: '#00E676',
  transferSubtle: 'rgba(0, 230, 118, 0.12)',

  // Borders
  border: '#1F1F1F',
  borderFaint: '#171717',
  borderStrong: '#2A2A2A',

  // Navigation
  tabActive: '#FFFFFF',
  tabInactive: '#3A3A3A',

  // Accent (data-vis, account types)
  purple: '#a855f7',
  purpleSubtle: 'rgba(168, 85, 247, 0.12)',

  // Misc
  transparent: 'transparent' as const,
  overlay: 'rgba(0, 0, 0, 0.6)',
  white: '#ffffff',
  black: '#000000',
} as const;

export type Color = keyof typeof colors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

export type Spacing = keyof typeof spacing;

export const radius = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
} as const;

export type Radius = keyof typeof radius;

export const fontSize = {
  xs: 11,
  sm: 12,
  base: 14,
  md: 15,
  lg: 16,
  xl: 18,
  '2xl': 20,
  '3xl': 24,
  '4xl': 28,
  '5xl': 32,
  '6xl': 36,
} as const;

export type FontSize = keyof typeof fontSize;

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
} as const;

export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;
