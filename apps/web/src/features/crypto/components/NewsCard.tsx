'use client';

import { ExternalLinkIcon, NewspaperIcon } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface NewsCardProps {
  title: string;
  source: string;
  url: string;
  date: string;
}

export function NewsCard({ title, source, url, date }: NewsCardProps) {
  // Format the date to a readable format
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="@container/card overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <NewspaperIcon className="size-4" />
            Latest News
          </CardTitle>
          <CardDescription className="text-xs">{formattedDate}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <Link href={url} target="_blank" rel="noopener noreferrer" className="group block">
          <h3 className="mb-1 line-clamp-2 font-medium text-foreground group-hover:underline">
            {title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{source}</span>
            <ExternalLinkIcon className="size-3 text-muted-foreground" />
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}

export function NewsCardSkeleton() {
  return (
    <Card className="@container/card overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
          <div className="flex items-center justify-between pt-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-3" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
