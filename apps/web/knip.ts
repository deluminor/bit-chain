import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: ['scripts/**/*.ts'],
  project: ['src/**/*.{ts,tsx}', 'scripts/**/*.{ts,js}', 'prisma/**/*.{ts,js}'],
  ignore: ['src/generated/**', '**/*.d.ts'],
  ignoreDependencies: [
    '@prisma/client',
    '@scripts/analyze_transactions',
    '@prisma/migrations',
    '@prisma/generated',
  ],
};

export default config;
