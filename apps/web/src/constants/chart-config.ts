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
