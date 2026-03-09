export const COLOR_SWATCHES = [
  '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B',
  '#EF4444', '#EC4899', '#06B6D4', '#F97316',
] as const;

export const CURRENCIES = ['UAH', 'EUR', 'USD', 'HUF'] as const;

export const DEFAULT_GOAL_FORM = {
  name: '',
  description: '',
  targetAmount: '',
  currentAmount: '',
  currency: 'UAH',
  deadline: '',
  color: COLOR_SWATCHES[0] as string,
  icon: '🎯',
};
