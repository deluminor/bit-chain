'use client';

import { CategoryChart } from '@/components/layout/charts/CategoryChart';
import { ChartAreaInteractive } from '@/components/layout/charts/ChartAreaInteractive';
import { ChartLoader } from '@/components/layout/charts/ChartLoader';
import { CurrencyDistributionChart } from '@/components/layout/charts/CurrencyDistributionChart';
import { SectionCards } from '@/components/layout/statistics/SectionCards';
import { AnimatedDiv } from '@/components/ui/animations';
import { CryptoNewsSection } from '@/features/crypto/components/CryptoNewsSection';
import { FinanceDashboard } from '@/features/finance/components/FinanceDashboard';
import { useDashboardMode } from '@/store/dashboard-mode';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { mode } = useDashboardMode();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex flex-col gap-3 py-4 min-h-screen">
        <div className="px-4 lg:px-6 space-y-3">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-muted/40 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 bg-muted/40 rounded-lg"></div>
              ))}
            </div>
            <div className="h-64 bg-muted/40 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 py-4 min-h-screen">
      {mode === 'crypto' ? (
        <AnimatedDiv variant="slideUp" className="space-y-3">
          <SectionCards />

          <CryptoNewsSection />

          <div className="px-4 lg:px-6">
            <ChartLoader>
              <ChartAreaInteractive />
            </ChartLoader>
          </div>

          <div className="px-4 lg:px-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            <ChartLoader>
              <CategoryChart />
            </ChartLoader>

            <ChartLoader>
              <CurrencyDistributionChart />
            </ChartLoader>
          </div>
        </AnimatedDiv>
      ) : (
        <>
          <div className="px-4 lg:px-6">
            <FinanceDashboard />
          </div>
        </>
      )}
    </div>
  );
}
