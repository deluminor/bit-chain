import { convertCurrency, getExchangeRates } from './src/lib/currency';

async function main() {
  const rates = await getExchangeRates();
  console.log('Rates:', rates.rates);
  
  const fromHUF = await convertCurrency(1000, 'HUF', 'EUR');
  console.log('1000 HUF to EUR:', fromHUF);
  
  const fromUAH = await convertCurrency(1000, 'UAH', 'EUR');
  console.log('1000 UAH to EUR:', fromUAH);
}

main().catch(console.error);
