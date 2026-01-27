'use client';

import { ChartSkeleton } from '@/components/layout/charts/ChartSkeleton';
import { ChartWrapper } from '@/components/layout/charts/ChartWrapper';
import { Badge } from '@/components/ui/badge';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { VIBRANT_PALETTE } from '@/constants/colors';
import { BASE_CURRENCY, convertToBaseCurrencySafe, formatCurrency } from '@/lib/currency';
import { useStore } from '@/store';
import { endOfDay, startOfDay } from 'date-fns';
import { PieChart as PieChartIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { useTransactions } from '../queries/transactions';

interface CategorySpendingChartProps {
  type?: 'INCOME' | 'EXPENSE';
}

export function CategorySpendingChart({ type = 'EXPENSE' }: CategorySpendingChartProps) {
  const { selectedDateRange } = useStore();

  // Use global date filter
  const dateFrom = useMemo(() => {
    if (selectedDateRange?.from) {
      return startOfDay(selectedDateRange.from).toISOString();
    }
    return undefined;
  }, [selectedDateRange?.from]);

  const dateTo = useMemo(() => {
    if (selectedDateRange?.to) {
      return endOfDay(selectedDateRange.to).toISOString();
    }
    return new Date().toISOString();
  }, [selectedDateRange?.to]);

  const { data: transactionsData, isLoading } = useTransactions({
    type,
    dateFrom,
    dateTo,
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

  const summaryTotal = useMemo(() => {
    if (!transactionsData?.summary) return 0;
    return type === 'INCOME' ? transactionsData.summary.income : transactionsData.summary.expenses;
  }, [transactionsData?.summary, type]);

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
      let totalAmount = 0;
      let totalCount = 0;
      for (const transaction of transactionsData.transactions) {
        const categoryId = transaction.category.id;
        const categoryName = transaction.category.name;

        if (!categoryTotals.has(categoryId)) {
          categoryTotals.set(categoryId, {
            name: categoryName,
            amount: 0,
            color: '', // Will be set later with minimalist colors
            count: 0,
          });
        }

        const categoryData = categoryTotals.get(categoryId)!;
        // Convert transaction amount to EUR
        const amountInEur = await convertToBaseCurrencySafe(
          transaction.amount,
          transaction.currency,
        );
        categoryData.amount += amountInEur;
        categoryData.count += 1;
        totalAmount += amountInEur;
        totalCount += 1;
      }

      // Convert to array and sort by amount (descending)
      const processedData = Array.from(categoryTotals.values())
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 8); // Show top 8 categories

      const topTotal = processedData.reduce((sum, item) => sum + item.amount, 0);
      const topCount = processedData.reduce((sum, item) => sum + item.count, 0);
      const totalForOther = summaryTotal > 0 ? summaryTotal : totalAmount;
      const otherAmount = Math.max(totalForOther - topTotal, 0);
      const otherCount = Math.max(totalCount - topCount, 0);

      if (otherAmount > 0 && processedData.length > 0) {
        processedData.push({
          name: 'Other',
          amount: otherAmount,
          color: '',
          count: otherCount,
        });
      }

      // Apply vibrant colors
      processedData.forEach((item, index) => {
        item.color = VIBRANT_PALETTE[index % VIBRANT_PALETTE.length] || '#000000';
      });

      setChartData(processedData);
    };

    processData();
  }, [transactionsData, summaryTotal]);

  // Calculate total for percentage calculations
  const total = useMemo(() => {
    if (summaryTotal > 0) return summaryTotal;
    return chartData.reduce((sum, item) => sum + item.amount, 0);
  }, [chartData, summaryTotal]);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    chartData.forEach(item => {
      config[item.name] = {
        label: item.name,
        color: item.color,
      };
    });
    return config;
  }, [chartData]);

  if (isLoading) return <ChartSkeleton />;

  if (!chartData.length) {
    return (
      <ChartWrapper
        title={`${type === 'INCOME' ? 'Income' : 'Expense'} Categories`}
        description="Top categories for selected period"
        isLoading={false}
      >
        <div className="text-center text-muted-foreground py-8">
          <PieChartIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No {type.toLowerCase()} transactions found</p>
        </div>
      </ChartWrapper>
    );
  }

  return (
    <ChartWrapper
      title={`${type === 'INCOME' ? 'Income' : 'Expense'} Categories`}
      description="Top categories for selected period"
      isLoading={isLoading}
    >
      <div className="space-y-4">
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
                      <Cell key={`cell-${index}`} fill={entry.color} />
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
                Total {type.toLowerCase()} for selected period
              </div>
            </div>

            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {chartData.map(item => {
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
                          backgroundColor: item.color,
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
      </div>
    </ChartWrapper>
  );
}
