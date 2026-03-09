'use client';

import { ExternalLinkIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn, formatLargeNumber } from '@/lib/utils';
export { CryptoCardSkeleton } from './CryptoCardSkeleton';

interface NewsItem {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

interface CryptoCardProps {
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  imageUrl: string;
  news?: NewsItem[];
  marketCap?: number;
  volume?: number;
  high24h?: number;
  low24h?: number;
  _lastUpdated?: string;
}

interface CryptoDataProps {
  id: string;
  data?: {
    name: string;
    symbol: string;
    current_price: number;
    price_change_percentage_24h: number;
    image: string;
    market_cap: number;
    total_volume: number;
    high_24h: number;
    low_24h: number;
    last_updated: string;
  };
  news?: NewsItem[];
}

// This is a higher-level component that safely handles the crypto data
export function CryptoCoinCard({ id, data, news }: CryptoDataProps) {
  // Default values based on coin ID
  const defaults = {
    bitcoin: {
      name: 'Bitcoin',
      symbol: 'BTC',
      imageUrl: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    },
    ethereum: {
      name: 'Ethereum',
      symbol: 'ETH',
      imageUrl: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    },
  };

  const coin = defaults[id as keyof typeof defaults];

  if (!data) {
    return (
      <CryptoCard
        name={coin.name}
        symbol={coin.symbol}
        price={0}
        priceChange={0}
        imageUrl={coin.imageUrl}
        news={news}
      />
    );
  }

  return (
    <CryptoCard
      name={data.name}
      symbol={data.symbol}
      price={data.current_price}
      priceChange={data.price_change_percentage_24h}
      imageUrl={data.image}
      news={news}
      marketCap={data.market_cap}
      volume={data.total_volume}
      high24h={data.high_24h}
      low24h={data.low_24h}
      _lastUpdated={data.last_updated}
    />
  );
}

export function CryptoCard({
  name,
  symbol,
  price,
  priceChange,
  imageUrl,
  news,
  marketCap,
  volume,
  high24h,
  low24h,
  _lastUpdated,
}: CryptoCardProps) {
  const isPositive = priceChange >= 0;
  const TrendIcon = isPositive ? TrendingUpIcon : TrendingDownIcon;
  const trendColor = isPositive ? 'text-green-500' : 'text-red-500';
  const [prevPrice, setPrevPrice] = useState(price);
  const [priceAnimation, setPriceAnimation] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (price !== prevPrice) {
      setPriceAnimation(price > prevPrice ? 'up' : 'down');
      setPrevPrice(price);
      const timer = setTimeout(() => setPriceAnimation(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [price, prevPrice]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const latestNews = news && news.length > 0 ? news[0] : null;

  return (
    <Card className="@container/card overflow-hidden gap-0">
      <CardHeader className="gap-0 pb-3">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full">
              <Image
                src={imageUrl}
                alt={`${name} logo`}
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">{name}</CardTitle>
              <CardDescription className="text-xs uppercase">{symbol}</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className={`flex gap-1 rounded-lg text-xs ${trendColor}`}>
            <TrendIcon className="size-3" />
            {isPositive ? '+' : ''}
            {priceChange.toFixed(2)}%
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="flex w-full items-center justify-between">
          <div
            className={cn(
              'text-2xl font-bold tabular-nums transition-all duration-500 ease-in-out',
              priceAnimation === 'up' && 'text-green-500 translate-y-[-2px]',
              priceAnimation === 'down' && 'text-red-500 translate-y-[2px]',
            )}
          >
            ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
            <TrendIcon className="size-4" />
            24h
          </div>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>
            <span className="font-medium">Market Cap:</span> {formatLargeNumber(marketCap || 0)}
          </div>
          <div>
            <span className="font-medium">Volume 24h:</span> {formatLargeNumber(volume || 0)}
          </div>
          <div>
            <span className="font-medium">High 24h:</span> ${high24h?.toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Low 24h:</span> ${low24h?.toLocaleString()}
          </div>
        </div>
      </CardContent>

      {latestNews && (
        <CardFooter className="flex-col items-start gap-1 pt-2">
          <div className="w-full border-t pt-2">
            <Link
              href={latestNews.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <h3 className="mb-1 line-clamp-2 text-sm font-medium text-foreground group-hover:underline @[400px]/card:line-clamp-1">
                {latestNews.title}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{latestNews.source}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(latestNews.publishedAt)}
                  </span>
                  <ExternalLinkIcon className="size-3 text-muted-foreground" />
                </div>
              </div>
            </Link>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
