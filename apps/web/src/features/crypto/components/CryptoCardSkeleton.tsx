import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function CryptoCardSkeleton() {
  return (
    <Card className="@container/card overflow-hidden">
      <CardHeader className="relative pb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-3 w-10" />
          </div>
        </div>
        <div className="absolute right-4 top-4">
          <Skeleton className="h-5 w-16 rounded-lg" />
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="flex w-full items-end justify-between">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-5 w-12" />
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </CardContent>

      <CardFooter className="flex-col items-start gap-1 pb-4 pt-2">
        <div className="w-full border-t pt-2">
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-3" />
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
