'use client';

import { CategoryChart } from '@/components/layout/charts/CategoryChart';
import { ChartAreaInteractive } from '@/components/layout/charts/ChartAreaInteractive';
import { ChartLoader } from '@/components/layout/charts/ChartLoader';
import { CurrencyDistributionChart } from '@/components/layout/charts/CurrencyDistributionChart';
import { SectionCards } from '@/components/layout/statistics/SectionCards';
import { AnimatedDiv } from '@/components/ui/animations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, BarChart3, PieChart, TrendingUp } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <AnimatedDiv variant="slideUp" className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-primary shadow-sm">
            <TrendingUp className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Crypto Analytics</h1>
            <p className="text-muted-foreground">
              Detailed trading performance and market insights
            </p>
          </div>
        </div>
      </div>

      <SectionCards />

      <div className="px-4 lg:px-6 space-y-6">
        <ChartLoader>
          <div className="mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Activity className="h-6 w-6" />
              Portfolio Performance
            </h2>
            <p className="text-muted-foreground">Your cumulative profit/loss over time</p>
          </div>
          <ChartAreaInteractive />
        </ChartLoader>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ChartLoader>
            <Card className="shadow-md rounded-lg hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Trading Categories
                </CardTitle>
                <CardDescription>Performance by trading category</CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryChart />
              </CardContent>
            </Card>
          </ChartLoader>

          <ChartLoader>
            <Card className="shadow-md rounded-lg hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Currency Distribution
                </CardTitle>
                <CardDescription>Portfolio allocation by currency</CardDescription>
              </CardHeader>
              <CardContent>
                <CurrencyDistributionChart />
              </CardContent>
            </Card>
          </ChartLoader>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-6 shadow-md rounded-lg hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="font-semibold">Win Rate</h3>
            </div>
            <div className="text-2xl font-bold mb-1">68.5%</div>
            <p className="text-sm text-muted-foreground">+2.3% from last month</p>
          </Card>

          <Card className="p-6 shadow-md rounded-lg hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <BarChart3 className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="font-semibold">Avg. Trade Size</h3>
            </div>
            <div className="text-2xl font-bold mb-1">$1,247</div>
            <p className="text-sm text-muted-foreground">-5.1% from last month</p>
          </Card>

          <Card className="p-6 shadow-md rounded-lg hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Activity className="h-5 w-5 text-purple-500" />
              </div>
              <h3 className="font-semibold">Sharpe Ratio</h3>
            </div>
            <div className="text-2xl font-bold mb-1">2.14</div>
            <p className="text-sm text-muted-foreground">Excellent performance</p>
          </Card>
        </div>
      </div>
    </AnimatedDiv>
  );
}
