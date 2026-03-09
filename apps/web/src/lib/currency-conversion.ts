import { BASE_CURRENCY, FALLBACK_RATES } from './currency.constants';
import { currencyService } from './currency.service';

export async function convertToBaseCurrencySafe(
  amount: number,
  currency: string | undefined,
): Promise<number> {
  if (!currency || currency === BASE_CURRENCY) {
    return amount;
  }

  try {
    return await currencyService.convertToBaseCurrency(amount, currency);
  } catch {
    return amount * (FALLBACK_RATES[currency] || 1);
  }
}
