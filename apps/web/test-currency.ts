import { currencyService } from './src/lib/services/currency.service';

async function test() {
  const fromHUF = await currencyService.convertCurrency(37500, 'HUF', 'EUR');
  console.log('37500 HUF -> EUR:', fromHUF);

  const fromUAH = await currencyService.convertCurrency(30256.54, 'UAH', 'EUR');
  console.log('30256.54 UAH -> EUR:', fromUAH);
}
test().catch(console.error);
