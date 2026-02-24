'use client';

import { useCryptoData } from '@/features/crypto/queries/crypto';
import { useCryptoNews } from '@/features/crypto/queries/news';
import { CryptoCardSkeleton, CryptoCoinCard } from './CryptoCard';

enum NEWS_COINS {
  BITCOIN = 'bitcoin',
  ETHEREUM = 'ethereum',
}

export function CryptoNewsSection() {
  const { data: cryptoData = [], isLoading: cryptoLoading } = useCryptoData();
  const { getNewsForCoin, isLoading: newsLoading } = useCryptoNews();

  const bitcoin = cryptoData.find(crypto => crypto.id === NEWS_COINS.BITCOIN);
  const ethereum = cryptoData.find(crypto => crypto.id === NEWS_COINS.ETHEREUM);

  const bitcoinNews = getNewsForCoin('bitcoin');
  const ethereumNews = getNewsForCoin('ethereum');

  if (cryptoLoading || newsLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 lg:px-6">
        <CryptoCardSkeleton />
        <CryptoCardSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 lg:px-6">
      {/* Bitcoin Card */}
      <CryptoCoinCard id={NEWS_COINS.BITCOIN} data={bitcoin} news={bitcoinNews} />

      {/* Ethereum Card */}
      <CryptoCoinCard id={NEWS_COINS.ETHEREUM} data={ethereum} news={ethereumNews} />
    </div>
  );
}
