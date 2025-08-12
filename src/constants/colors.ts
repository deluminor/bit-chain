// Chart Colors - Premium Financial App Palette (Inspired by Modern Fintech)

// Primary Chart Colors
export const CHART_COLORS = {
  // More vibrant orange gradients (premium fintech theme)
  PRIMARY: {
    DEFAULT: '#FF5722',
    LIGHT: '#FF6B35',
    LIGHTER: '#FF7A3D',
    DARK: '#E64A19',
    GRADIENT_STOPS: [
      { offset: '0%', color: '#FF5722', opacity: 1.0 },
      { offset: '25%', color: '#FF6B35', opacity: 0.95 },
      { offset: '50%', color: '#FF7A3D', opacity: 0.9 },
      { offset: '75%', color: '#FF8C42', opacity: 0.85 },
      { offset: '100%', color: '#FF9A50', opacity: 0.8 },
    ],
  },

  // More vibrant green (success/positive)
  SUCCESS: {
    DEFAULT: '#00BCD4',
    LIGHT: '#26C6DA',
    LIGHTER: '#4DD0E1',
    DARK: '#0097A7',
    GRADIENT_STOPS: [
      { offset: '0%', color: '#00BCD4', opacity: 0.95 },
      { offset: '50%', color: '#26C6DA', opacity: 0.9 },
      { offset: '100%', color: '#4DD0E1', opacity: 0.85 },
    ],
  },

  // Sophisticated neutral (inactive/secondary)
  NEUTRAL: {
    DEFAULT: '#6B7280',
    LIGHT: '#9CA3AF',
    LIGHTER: '#D1D5DB',
    DARK: '#4B5563',
    GRADIENT_STOPS: [
      { offset: '0%', color: '#6B7280', opacity: 0.8 },
      { offset: '50%', color: '#9CA3AF', opacity: 0.6 },
      { offset: '100%', color: '#D1D5DB', opacity: 0.4 },
    ],
  },

  // More vibrant blue (professional/info)
  INFO: {
    DEFAULT: '#2196F3',
    LIGHT: '#42A5F5',
    LIGHTER: '#64B5F6',
    DARK: '#1976D2',
    GRADIENT_STOPS: [
      { offset: '0%', color: '#2196F3', opacity: 0.9 },
      { offset: '50%', color: '#42A5F5', opacity: 0.8 },
      { offset: '100%', color: '#64B5F6', opacity: 0.7 },
    ],
  },

  // More vibrant purple (special/investments)
  PURPLE: {
    DEFAULT: '#9C27B0',
    LIGHT: '#AB47BC',
    LIGHTER: '#BA68C8',
    DARK: '#7B1FA2',
    GRADIENT_STOPS: [
      { offset: '0%', color: '#9C27B0', opacity: 0.9 },
      { offset: '50%', color: '#AB47BC', opacity: 0.8 },
      { offset: '100%', color: '#BA68C8', opacity: 0.7 },
    ],
  },

  // Warning/Alert (expenses/danger)
  WARNING: {
    DEFAULT: '#F59E0B',
    LIGHT: '#FBBF24',
    LIGHTER: '#FCD34D',
    DARK: '#D97706',
    GRADIENT_STOPS: [
      { offset: '0%', color: '#F59E0B', opacity: 0.9 },
      { offset: '50%', color: '#FBBF24', opacity: 0.85 },
      { offset: '100%', color: '#FCD34D', opacity: 0.8 },
    ],
  },
};

// Area/Line Chart Gradients - Premium Finance Style
export const AREA_GRADIENTS = {
  // Vibrant fill gradients for area charts
  FILL: {
    PRIMARY: [
      { offset: '0%', color: '#FF5722', opacity: 0.6 },
      { offset: '25%', color: '#FF6B35', opacity: 0.5 },
      { offset: '50%', color: '#FF7A3D', opacity: 0.4 },
      { offset: '75%', color: '#FF8C42', opacity: 0.3 },
      { offset: '100%', color: '#FF9A50', opacity: 0.1 },
    ],
    INCOME: [
      { offset: '0%', color: '#00BCD4', opacity: 0.5 },
      { offset: '30%', color: '#26C6DA', opacity: 0.35 },
      { offset: '70%', color: '#4DD0E1', opacity: 0.25 },
      { offset: '100%', color: '#80DEEA', opacity: 0.05 },
    ],
    EXPENSE: [
      { offset: '0%', color: '#F59E0B', opacity: 0.5 },
      { offset: '30%', color: '#FBBF24', opacity: 0.35 },
      { offset: '70%', color: '#FCD34D', opacity: 0.25 },
      { offset: '100%', color: '#FDE68A', opacity: 0.05 },
    ],
    NET_WORTH: [
      { offset: '0%', color: '#8B5CF6', opacity: 0.7 },
      { offset: '25%', color: '#A78BFA', opacity: 0.6 },
      { offset: '50%', color: '#C4B5FD', opacity: 0.5 },
      { offset: '75%', color: '#DDD6FE', opacity: 0.3 },
      { offset: '100%', color: '#F3F4F6', opacity: 0.05 },
    ],
    NEUTRAL: [
      { offset: '0%', color: '#6B7280', opacity: 0.4 },
      { offset: '50%', color: '#9CA3AF', opacity: 0.25 },
      { offset: '100%', color: '#D1D5DB', opacity: 0.05 },
    ],
  },
};

// Pie Chart Colors - More Vibrant Fintech Palette
export const PIE_COLORS = [
  '#FF5722', // More vibrant primary orange
  '#00BCD4', // Vibrant cyan
  '#2196F3', // Vibrant blue
  '#9C27B0', // Vibrant purple
  '#FF9800', // Vibrant amber
  '#F44336', // Vibrant red
  '#607D8B', // Blue gray
  '#009688', // Teal
  '#FF6F00', // Deep orange
  '#8BC34A', // Light green
];

// Multi-line Chart Colors - Financial Accounts (More Vibrant)
export const LINE_COLORS = {
  'Bank Account': '#2196F3',
  Savings: '#00BCD4',
  Cash: '#FF9800',
  Investment: '#9C27B0',
};

// Radar Chart Colors - More Vibrant Orange Theme
export const RADAR_COLORS = {
  FILL: [
    { offset: '0%', color: '#FF5722', opacity: 0.6 },
    { offset: '30%', color: '#FF6B35', opacity: 0.45 },
    { offset: '70%', color: '#FF7A3D', opacity: 0.3 },
    { offset: '100%', color: '#FF8C42', opacity: 0.15 },
  ],
  STROKE: '#FF5722',
  DOT: '#FF5722',
};

// Bar Chart Colors - Premium Budget Theme
export const BAR_COLORS = {
  BUDGET: {
    GRADIENT: [
      { offset: '0%', color: '#3B82F6', opacity: 0.8 },
      { offset: '100%', color: '#60A5FA', opacity: 0.5 },
    ],
  },
  SPENT: {
    GRADIENT: [
      { offset: '0%', color: '#FF6B35', opacity: 0.8 },
      { offset: '100%', color: '#FF8C42', opacity: 0.5 },
    ],
  },
  OVER_SPENT: {
    GRADIENT: [
      { offset: '0%', color: '#EF4444', opacity: 0.8 },
      { offset: '100%', color: '#F87171', opacity: 0.5 },
    ],
  },
};

// Active Dot Colors - More Vibrant Highlights
export const ACTIVE_DOT_COLORS = {
  PRIMARY: '#FF5722',
  SUCCESS: '#00BCD4',
  WARNING: '#FF9800',
  INFO: '#2196F3',
  PURPLE: '#9C27B0',
  NEUTRAL: '#607D8B',
};

// Grid and Axis Colors (theme-aware)
export const GRID_COLORS = {
  LIGHT: 'rgba(0, 0, 0, 0.1)',
  DARK: 'rgba(255, 255, 255, 0.1)',
};

// Shadow and Glow Effects
export const EFFECTS = {
  SOFT_SHADOW: {
    dx: '0',
    dy: '1',
    stdDeviation: '2',
    floodColor: 'rgba(0,0,0,0.1)',
  },
  SOFT_GLOW: {
    stdDeviation: '1.5',
  },
  RADAR_GLOW: {
    stdDeviation: '1',
  },
};

// Chart Configuration - Minimalist Settings (Thinner Lines)
export const CHART_CONFIG = {
  STROKE_WIDTH: {
    THIN: 1,
    MEDIUM: 1.5,
    THICK: 2,
    ULTRA_THICK: 2.5,
  },
  DOT_RADIUS: {
    SMALL: 4,
    MEDIUM: 6,
    LARGE: 8,
    EXTRA_LARGE: 10,
  },
  ANIMATION: {
    DURATION: {
      FAST: 800,
      MEDIUM: 1200,
      SLOW: 1800,
      ULTRA_SLOW: 2500,
    },
    DELAY: {
      SHORT: 150,
      MEDIUM: 250,
      LONG: 400,
      EXTRA_LONG: 600,
    },
    EASING: 'ease-out',
  },
};

// Special Effects for Premium Look
export const PREMIUM_EFFECTS = {
  GLOW: {
    SOFT: {
      filter: 'drop-shadow(0px 0px 8px rgba(255, 107, 53, 0.3))',
      animation: 'glow 2s ease-in-out infinite alternate',
    },
    STRONG: {
      filter: 'drop-shadow(0px 0px 12px rgba(255, 107, 53, 0.5))',
      animation: 'pulse 1.5s ease-in-out infinite',
    },
  },
  HIGHLIGHT: {
    ACTIVE_BAR: {
      boxShadow: '0px 4px 15px rgba(255, 107, 53, 0.4)',
      transform: 'scale(1.02)',
    },
    HOVER: {
      filter: 'brightness(1.1)',
      transition: 'all 0.2s ease-in-out',
    },
  },
};

// Dark Theme Specific Colors (like in the screenshots)
export const DARK_THEME = {
  BACKGROUND: {
    PRIMARY: '#0F0F0F',
    SECONDARY: '#1A1A1A',
    TERTIARY: '#262626',
    CARD: '#1F1F1F',
  },
  TEXT: {
    PRIMARY: '#FFFFFF',
    SECONDARY: '#E5E5E5',
    MUTED: '#9CA3AF',
    DISABLED: '#6B7280',
  },
  BORDER: {
    DEFAULT: '#2A2A2A',
    LIGHT: '#3A3A3A',
    STRONG: '#4A4A4A',
  },
};
