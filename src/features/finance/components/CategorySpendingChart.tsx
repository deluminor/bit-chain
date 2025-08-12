'use client';

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useMemo, useState, useEffect } from 'react';
import { ChartSkeleton } from '@/components/layout/charts/ChartSkeleton';
import { useTransactions } from '../queries/transactions';
import { PieChart as PieChartIcon, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { subDays, startOfMonth } from 'date-fns';
import { currencyService, formatCurrency, BASE_CURRENCY } from '@/lib/currency';

interface CategorySpendingChartProps {
  type?: 'INCOME' | 'EXPENSE';
  period?: 'month' | 'quarter' | 'year';
}

export function CategorySpendingChart({
  type = 'EXPENSE',
  period = 'month',
}: CategorySpendingChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(period);

  // Calculate date range based on period
  const dateRange = useMemo(() => {
    const now = new Date();
    let from: Date;

    switch (selectedPeriod) {
      case 'quarter':
        from = subDays(now, 90);
        break;
      case 'year':
        from = subDays(now, 365);
        break;
      default:
        from = startOfMonth(now);
    }

    return {
      from: from.toISOString().split('T')[0],
      to: now.toISOString().split('T')[0],
    };
  }, [selectedPeriod]);

  const { data: transactionsData, isLoading } = useTransactions({
    type,
    dateFrom: dateRange.from,
    dateTo: dateRange.to,
    limit: 1000,
  });

  const [chartData, setChartData] = useState<
    Array<{
      name: string;
      amount: number;
      color: string;
      count: number;
    }>
  >([]);

  // Process data for pie chart with currency conversion
  useEffect(() => {
    const processData = async () => {
      if (!transactionsData?.transactions) {
        setChartData([]);
        return;
      }

      const categoryTotals = new Map<
        string,
        {
          name: string;
          amount: number;
          color: string;
          count: number;
        }
      >();

      // Process transactions with currency conversion
      for (const transaction of transactionsData.transactions) {
        const categoryId = transaction.category.id;
        const categoryName = transaction.category.name;
        const categoryColor = transaction.category.color;

        if (!categoryTotals.has(categoryId)) {
          categoryTotals.set(categoryId, {
            name: categoryName,
            amount: 0,
            color: categoryColor,
            count: 0,
          });
        }

        const categoryData = categoryTotals.get(categoryId)!;
        // Convert transaction amount to EUR
        const amountInEur = await currencyService.convertToBaseCurrency(
          transaction.amount,
          transaction.currency || 'USD',
        );
        categoryData.amount += amountInEur;
        categoryData.count += 1;
      }

      // Convert to array and sort by amount (descending)
      const processedData = Array.from(categoryTotals.values())
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 8); // Show top 8 categories

      setChartData(processedData);
    };

    processData();
  }, [transactionsData]);

  // Calculate total for percentage calculations
  const total = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.amount, 0);
  }, [chartData]);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    chartData.forEach((item, index) => {
      config[item.name] = {
        label: item.name,
        color: item.color || `hsl(${(index * 45) % 360}, 70%, 50%)`,
      };
    });
    return config;
  }, [chartData]);

  if (isLoading) return <ChartSkeleton />;

  if (!chartData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            {type === 'INCOME' ? 'Income' : 'Expense'} Categories
          </CardTitle>
          <CardDescription>Category breakdown for {selectedPeriod}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <PieChartIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No {type.toLowerCase()} transactions found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            {type === 'INCOME' ? 'Income' : 'Expense'} Categories
          </CardTitle>
          <CardDescription>Top categories for this {selectedPeriod}</CardDescription>
        </div>

        {/* Period Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelectedPeriod('month')}>
              This Month
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedPeriod('quarter')}>
              Last 3 Months
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedPeriod('year')}>Last Year</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="h-[300px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="amount"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color || `hsl(${(index * 45) % 360}, 70%, 50%)`}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={value => [
                          formatCurrency(Number(value), BASE_CURRENCY, {
                            useLargeNumberFormat: false,
                          }),
                          '',
                        ]}
                        labelFormatter={label => label}
                        indicator="dot"
                      />
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Legend with Details */}
          <div className="space-y-3">
            <div className="text-center mb-4">
              <div className="text-2xl font-bold">
                {formatCurrency(total, BASE_CURRENCY, { useLargeNumberFormat: false })}
              </div>
              <div className="text-sm text-muted-foreground">
                Total {type.toLowerCase()} this {selectedPeriod}
              </div>
            </div>

            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {chartData.map((item, index) => {
                const percentage = ((item.amount / total) * 100).toFixed(2);
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: item.color || `hsl(${(index * 45) % 360}, 70%, 50%)`,
                        }}
                      />
                      <div>
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.count} transaction{item.count > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm">
                        {formatCurrency(item.amount, BASE_CURRENCY, {
                          useLargeNumberFormat: false,
                        })}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {percentage}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
