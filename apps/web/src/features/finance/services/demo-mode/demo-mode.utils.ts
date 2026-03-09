import { DEMO_TRANSACTION_DESCRIPTIONS } from './demo-mode.constants';

const DEMO_DEBUG_ENABLED =
  process.env.NODE_ENV !== 'production' && process.env.APP_DEBUG_DEMO_MODE === 'true';

export function demoDebug(message: string, context?: unknown): void {
  if (!DEMO_DEBUG_ENABLED) {
    return;
  }

  if (typeof context === 'undefined') {
    console.debug(message);
    return;
  }

  console.debug(message, context);
}

export function validateDemoUserId(userId: string): void {
  if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
    throw new Error(`Invalid userId provided: ${userId}`);
  }

  if (userId.length < 10) {
    throw new Error(`UserId appears to be too short: ${userId}`);
  }
}

export function randomOf<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)] as T;
}

export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function buildTransactionDescription(categoryName: string): string {
  const descriptions = DEMO_TRANSACTION_DESCRIPTIONS[categoryName] ?? [
    `${categoryName} transaction`,
  ];
  return randomOf(descriptions);
}
