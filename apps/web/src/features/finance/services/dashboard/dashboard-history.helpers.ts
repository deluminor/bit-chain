import { convertToBaseCurrencySafe } from '@/lib/currency';

export interface BalanceBreakpoint {
  date: string;
  balances: Record<string, number>;
}

export function scopeBreakpointsToPeriod(
  breakpoints: ReadonlyArray<BalanceBreakpoint>,
  dateFrom: Date,
  dateTo: Date,
): BalanceBreakpoint[] {
  const fromMs = dateFrom.getTime();
  const toMs = dateTo.getTime();

  if (
    !Number.isFinite(fromMs) ||
    !Number.isFinite(toMs) ||
    fromMs > toMs ||
    breakpoints.length === 0
  ) {
    return [...breakpoints];
  }

  const pointsWithMs = breakpoints.map(point => ({
    ...point,
    ms: new Date(point.date).getTime(),
  }));

  const inRange = pointsWithMs.filter(point => point.ms >= fromMs && point.ms <= toMs);
  const anchorSource = [...pointsWithMs].reverse().find(point => point.ms < fromMs);
  const anchorFallback = pointsWithMs[0];
  const closingSource =
    [...inRange].reverse()[0] ?? [...pointsWithMs].reverse().find(point => point.ms <= toMs);

  const scoped: BalanceBreakpoint[] = [];

  if (anchorSource ?? anchorFallback) {
    const source = anchorSource ?? anchorFallback!;
    scoped.push({
      date: new Date(fromMs).toISOString(),
      balances: { ...source.balances },
    });
  }

  for (const point of inRange) {
    scoped.push({
      date: point.date,
      balances: { ...point.balances },
    });
  }

  if (
    closingSource &&
    (scoped.length === 0 || scoped[scoped.length - 1]!.date !== new Date(toMs).toISOString())
  ) {
    scoped.push({
      date: new Date(toMs).toISOString(),
      balances: { ...closingSource.balances },
    });
  }

  return scoped;
}

export async function totalInEURFromAccounts(
  balances: Record<string, number>,
  currencyMap: Record<string, string>,
): Promise<number> {
  let total = 0;
  for (const [accountId, amount] of Object.entries(balances)) {
    const currency = currencyMap[accountId] ?? 'EUR';
    total += await convertToBaseCurrencySafe(amount, currency);
  }
  return Math.round(total * 100) / 100;
}
