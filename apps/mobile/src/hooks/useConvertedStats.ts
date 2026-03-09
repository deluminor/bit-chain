import { useEffect, useState } from 'react';
import { convertCurrency, useCurrencyStore, type CurrencyCode } from '~/src/lib/currency';

export type RawStats = Array<{
  income: number;
  expenses: number;
  netFlow: number;
  currency: string;
}>;

function isRawStatsItem(value: unknown): value is RawStats[number] {
  if (typeof value !== 'object' || value === null) return false;
  if (!('income' in value) || !('expenses' in value)) return false;
  if (!('netFlow' in value) || !('currency' in value)) return false;
  return (
    typeof value.income === 'number' &&
    typeof value.expenses === 'number' &&
    typeof value.netFlow === 'number' &&
    typeof value.currency === 'string'
  );
}

export interface ConvertedStats {
  income: number;
  expenses: number;
  netFlow: number;
  currency: CurrencyCode;
  isConverting: boolean;
}

/**
 * Subscribes to the global `baseCurrency` store and converts the given period
 * stats array into the user-preferred currency via the FX rate cache, then sums them up.
 *
 * @param statsArr - Array of raw stats per currency from the API (may be null while loading)
 *
 * @example
 * ```tsx
 * const converted = useConvertedStats(data?.stats ?? null);
 * // converted.income / .expenses / .netFlow are already in baseCurrency
 * ```
 */
export function useConvertedStats(statsInput: RawStats | unknown | null): ConvertedStats {
  const baseCurrency = useCurrencyStore(s => s.baseCurrency);

  const [result, setResult] = useState<ConvertedStats>({
    income: 0,
    expenses: 0,
    netFlow: 0,
    currency: baseCurrency,
    isConverting: false,
  });

  useEffect(() => {
    // Normalize stats to an array to support legacy cached data (objects).
    const normalizedStats: RawStats = Array.isArray(statsInput)
      ? statsInput.filter(isRawStatsItem)
      : isRawStatsItem(statsInput)
        ? [statsInput]
        : [];

    if (normalizedStats.length === 0) {
      setResult({
        income: 0,
        expenses: 0,
        netFlow: 0,
        currency: baseCurrency,
        isConverting: false,
      });
      return;
    }

    let cancelled = false;
    setResult(prev => ({ ...prev, isConverting: true }));

    const convert = async () => {
      let totalIncome = 0;
      let totalExpenses = 0;
      let totalNetFlow = 0;

      try {
        for (const stats of normalizedStats) {
          if (!stats || typeof stats.currency !== 'string') continue;

          if (stats.currency === baseCurrency) {
            totalIncome += stats.income || 0;
            totalExpenses += stats.expenses || 0;
            totalNetFlow += stats.netFlow || 0;
          } else {
            const [convIncome, convExpenses, convNetFlow] = await Promise.all([
              convertCurrency(stats.income || 0, stats.currency, baseCurrency),
              convertCurrency(stats.expenses || 0, stats.currency, baseCurrency),
              convertCurrency(stats.netFlow || 0, stats.currency, baseCurrency),
            ]);
            totalIncome += convIncome;
            totalExpenses += convExpenses;
            totalNetFlow += convNetFlow;
          }
        }
      } catch (err) {
        console.warn('[useConvertedStats] FX conversion error:', err);
      }

      if (!cancelled) {
        setResult({
          income: totalIncome,
          expenses: totalExpenses,
          netFlow: totalNetFlow,
          currency: baseCurrency,
          isConverting: false,
        });
      }
    };

    void convert();

    return () => {
      cancelled = true;
    };
  }, [statsInput, baseCurrency]);

  return result;
}
