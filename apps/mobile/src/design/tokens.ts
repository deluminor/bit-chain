export const colors = {
  // Backgrounds
  bgBase:     '#0f172a',
  bgSurface:  '#1e293b',
  bgElevated: '#253347',
  bgMuted:    '#334155',

  // Text
  textPrimary:   '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted:     '#64748b',
  textDisabled:  '#475569',

  // Brand
  brand:       '#3b82f6',
  brandDim:    '#1d4ed8',
  brandSubtle: 'rgba(59, 130, 246, 0.12)',

  // Semantic
  success:       '#22c55e',
  successSubtle: 'rgba(34, 197, 94, 0.12)',
  error:         '#ef4444',
  errorSubtle:   'rgba(239, 68, 68, 0.12)',
  warning:       '#f59e0b',
  warningSubtle: 'rgba(245, 158, 11, 0.12)',
  info:          '#06b6d4',
  infoSubtle:    'rgba(6, 182, 212, 0.12)',

  // Financial
  income:         '#22c55e',
  incomeSubtle:   'rgba(34, 197, 94, 0.12)',
  expense:        '#ef4444',
  expenseSubtle:  'rgba(239, 68, 68, 0.12)',
  transfer:       '#3b82f6',
  transferSubtle: 'rgba(59, 130, 246, 0.12)',

  // Borders
  border:      '#1e293b',
  borderFaint: '#1a2540',
  borderStrong:'#334155',

  // Navigation
  tabActive:   '#3b82f6',
  tabInactive: '#64748b',

  // Accent (data-vis, account types)
  purple:       '#a855f7',
  purpleSubtle: 'rgba(168, 85, 247, 0.12)',

  // Misc
  transparent: 'transparent' as const,
  overlay:     'rgba(0, 0, 0, 0.6)',
  white:       '#ffffff',
  black:       '#000000',
} as const;

export type Color = keyof typeof colors;

export const spacing = {
  xs:    4,
  sm:    8,
  md:    12,
  base:  16,
  lg:    20,
  xl:    24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

export type Spacing = keyof typeof spacing;

export const radius = {
  xs:    4,
  sm:    6,
  md:    10,
  lg:    12,
  xl:    16,
  '2xl': 20,
  full:  9999,
} as const;

export type Radius = keyof typeof radius;

export const fontSize = {
  xs:    11,
  sm:    12,
  base:  14,
  md:    15,
  lg:    16,
  xl:    18,
  '2xl': 20,
  '3xl': 24,
  '4xl': 28,
  '5xl': 32,
  '6xl': 36,
} as const;

export type FontSize = keyof typeof fontSize;

export const fontWeight = {
  regular:   '400' as const,
  medium:    '500' as const,
  semibold:  '600' as const,
  bold:      '700' as const,
  extrabold: '800' as const,
} as const;

export const shadow = {
  sm: {
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius:  2,
    elevation:     2,
  },
  md: {
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius:  4,
    elevation:     4,
  },
  lg: {
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius:  8,
    elevation:     8,
  },
} as const;
