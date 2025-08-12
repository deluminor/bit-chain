export const MINIMALIST_STYLES = {
  // Colors
  COLORS: {
    LIGHT: {
      PRIMARY: '#000000',
      SECONDARY: '#666666',
      TERTIARY: '#999999',
      BACKGROUND: '#ffffff',
      GRID: 'rgba(0, 0, 0, 0.08)',
      TEXT: 'rgba(0, 0, 0, 0.8)',
    },
    DARK: {
      PRIMARY: '#ffffff',
      SECONDARY: '#cccccc',
      TERTIARY: '#999999',
      BACKGROUND: '#000000',
      GRID: 'rgba(255, 255, 255, 0.08)',
      TEXT: 'rgba(255, 255, 255, 0.9)',
    },
  },

  // Gradients for area fills - More expressive gray gradient
  GRADIENTS: {
    PRIMARY: (isDark: boolean) => [
      { offset: '0%', color: isDark ? '#ffffff' : '#6b7280', opacity: 0.55 },
      { offset: '15%', color: isDark ? '#ffffff' : '#6b7280', opacity: 0.48 },
      { offset: '30%', color: isDark ? '#ffffff' : '#6b7280', opacity: 0.38 },
      { offset: '50%', color: isDark ? '#ffffff' : '#6b7280', opacity: 0.25 },
      { offset: '70%', color: isDark ? '#ffffff' : '#6b7280', opacity: 0.15 },
      { offset: '85%', color: isDark ? '#ffffff' : '#6b7280', opacity: 0.08 },
      { offset: '100%', color: isDark ? '#ffffff' : '#6b7280', opacity: 0.02 },
    ],
    SECONDARY: (isDark: boolean) => [
      { offset: '0%', color: isDark ? '#d1d5db' : '#9ca3af', opacity: 0.45 },
      { offset: '15%', color: isDark ? '#d1d5db' : '#9ca3af', opacity: 0.38 },
      { offset: '30%', color: isDark ? '#d1d5db' : '#9ca3af', opacity: 0.28 },
      { offset: '50%', color: isDark ? '#d1d5db' : '#9ca3af', opacity: 0.18 },
      { offset: '70%', color: isDark ? '#d1d5db' : '#9ca3af', opacity: 0.1 },
      { offset: '85%', color: isDark ? '#d1d5db' : '#9ca3af', opacity: 0.05 },
      { offset: '100%', color: isDark ? '#d1d5db' : '#9ca3af', opacity: 0.01 },
    ],
  },

  // Chart configuration
  CONFIG: {
    STROKE_WIDTH: 1.5,
    DOT_RADIUS: 4,
    DOT_STROKE_WIDTH: 2,
    GRID_STROKE_WIDTH: 0.5,
    ANIMATION_DURATION: 800,
    ANIMATION_DELAY: 150,
  },

  // Grid styles
  GRID: {
    strokeDasharray: '1 2',
    vertical: false,
  },

  // Active dot styles
  ACTIVE_DOT: (isDark: boolean, isSecondary = false) => ({
    r: 4,
    strokeWidth: 2,
    stroke: isDark ? (isSecondary ? '#cccccc' : '#ffffff') : isSecondary ? '#666666' : '#000000',
    fill: isDark ? '#000000' : '#ffffff',
    opacity: 1,
  }),

  // Placeholder data for empty charts
  PLACEHOLDER_DATA: {
    PNL: [
      { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), pnl: 0 },
      { date: new Date().toISOString(), pnl: 0 },
    ],
    NET_WORTH: [
      { date: 'Sep', netWorth: 0 },
      { date: 'Oct', netWorth: 0 },
      { date: 'Nov', netWorth: 0 },
      { date: 'Dec', netWorth: 0 },
      { date: 'Jan', netWorth: 0 },
      { date: 'Feb', netWorth: 0 },
      { date: 'Mar', netWorth: 0 },
      { date: 'Apr', netWorth: 0 },
      { date: 'May', netWorth: 0 },
      { date: 'Jun', netWorth: 0 },
      { date: 'Jul', netWorth: 0 },
      { date: 'Aug', netWorth: 0 },
    ],
    INCOME_EXPENSE: [
      { month: 'Sep', income: 0, expenses: 0 },
      { month: 'Oct', income: 0, expenses: 0 },
      { month: 'Nov', income: 0, expenses: 0 },
      { month: 'Dec', income: 0, expenses: 0 },
      { month: 'Jan', income: 0, expenses: 0 },
      { month: 'Feb', income: 0, expenses: 0 },
      { month: 'Mar', income: 0, expenses: 0 },
      { month: 'Apr', income: 0, expenses: 0 },
      { month: 'May', income: 0, expenses: 0 },
      { month: 'Jun', income: 0, expenses: 0 },
      { month: 'Jul', income: 0, expenses: 0 },
      { month: 'Aug', income: 0, expenses: 0 },
    ],
  },
};

// Helper function to get colors based on theme
export const getMinimalistColors = (isDark: boolean) => ({
  primary: isDark ? MINIMALIST_STYLES.COLORS.DARK.PRIMARY : MINIMALIST_STYLES.COLORS.LIGHT.PRIMARY,
  secondary: isDark
    ? MINIMALIST_STYLES.COLORS.DARK.SECONDARY
    : MINIMALIST_STYLES.COLORS.LIGHT.SECONDARY,
  tertiary: isDark
    ? MINIMALIST_STYLES.COLORS.DARK.TERTIARY
    : MINIMALIST_STYLES.COLORS.LIGHT.TERTIARY,
  grid: isDark ? MINIMALIST_STYLES.COLORS.DARK.GRID : MINIMALIST_STYLES.COLORS.LIGHT.GRID,
  text: isDark ? MINIMALIST_STYLES.COLORS.DARK.TEXT : MINIMALIST_STYLES.COLORS.LIGHT.TEXT,
});

// Helper function to create gradient definitions
export const createMinimalistGradient = (_id: string, isDark: boolean, isSecondary = false) => {
  const gradientStops = isSecondary
    ? MINIMALIST_STYLES.GRADIENTS.SECONDARY(isDark)
    : MINIMALIST_STYLES.GRADIENTS.PRIMARY(isDark);

  return {
    stops: gradientStops,
  };
};

// Elegant monochrome colors for pie charts - like in the screenshot
export const MINIMALIST_PIE_COLORS = [
  '#000000', // Pure black (dominant)
  '#2d2d2d', // Very dark gray
  '#4a4a4a', // Dark gray
  '#666666', // Medium gray
  '#808080', // Light gray
  '#999999', // Lighter gray
  '#b3b3b3', // Very light gray
  '#1a1a1a', // Almost black
  '#595959', // Medium-dark gray
  '#737373', // Medium-light gray
];

// Dark theme pie colors - inverted for dark backgrounds
export const MINIMALIST_PIE_COLORS_DARK = [
  '#ffffff', // Pure white (dominant)
  '#e6e6e6', // Very light gray
  '#cccccc', // Light gray
  '#b3b3b3', // Medium-light gray
  '#999999', // Medium gray
  '#808080', // Medium-dark gray
  '#666666', // Dark gray
  '#f0f0f0', // Almost white
  '#d9d9d9', // Light-medium gray
  '#bfbfbf', // Medium-light gray
];
