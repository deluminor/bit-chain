'use client';

import { CryptoNewsSection } from '@/features/crypto/components/CryptoNewsSection';
import { CategoryChart } from '@/components/layout/charts/CategoryChart';
import { ChartAreaInteractive } from '@/components/layout/charts/ChartAreaInteractive';
import { ChartLoader } from '@/components/layout/charts/ChartLoader';
import { CurrencyDistributionChart } from '@/components/layout/charts/CurrencyDistributionChart';
import { SectionCards } from '@/components/layout/statistics/SectionCards';
import { FinanceDashboard } from '@/features/finance/components/FinanceDashboard';
import { useDashboardMode } from '@/store/dashboard-mode';
import { useEffect, useState } from 'react';
import { AnimatedDiv } from '@/components/ui/animations';

export default function Dashboard() {
  const { mode } = useDashboardMode();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state until hydrated
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
          {/* Crypto Trading Dashboard */}
          <SectionCards />

          {/* Crypto & News Section */}
          <CryptoNewsSection />

          {/* PnL Growth Chart */}
          <div className="px-4 lg:px-6">
            <ChartLoader>
              <ChartAreaInteractive />
            </ChartLoader>
          </div>

          {/* Trading Categories and Win/Loss Stats */}
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
          {/* Personal Finance Dashboard */}
          <div className="px-4 lg:px-6">
            <FinanceDashboard />
          </div>
        </>
      )}
    </div>
  );
}
