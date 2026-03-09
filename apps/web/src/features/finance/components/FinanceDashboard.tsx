'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { AccountBalanceTrendsChart } from '@/components/layout/charts/AccountBalanceTrendsChart';
import { BudgetPerformanceChart } from '@/components/layout/charts/BudgetPerformanceChart';
import { AnimatedDiv } from '@/components/ui/animations';
import { ResponsiveGrid } from '@/components/ui/responsive-helpers';
import { CashFlowSankeyChart } from '@/features/finance/components/CashFlowSankeyChart';
import { CategorySpendingChart } from '@/features/finance/components/CategorySpendingChart';
import { IncomeExpenseChart } from '@/features/finance/components/IncomeExpenseChart';
import { NetWorthChart } from '@/features/finance/components/NetWorthChart';
import { useAccounts } from '@/features/finance/queries/accounts';
import { useTransactions } from '@/features/finance/queries/transactions';
import { BarChart3, PieChart, RefreshCw, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import Link from 'next/link';

import { convertToBaseCurrencySafe, formatSummaryAmount } from '@/lib/currency';
import { useStore } from '@/store';
import { endOfDay, startOfDay } from 'date-fns';
import { useEffect, useMemo, useRef, useState } from 'react';

interface QuickStatsProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  href?: string;
}

function QuickStatCard({ title, value, change, changeType, icon, href }: QuickStatsProps) {
  const content = (
    <CardContent className="p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold">{value}</p>
          {change && (
            <p
              className={`text-xs flex items-center gap-1 mt-1 ${
                changeType === 'positive'
                  ? 'text-income'
                  : changeType === 'negative'
                    ? 'text-expense'
                    : 'text-muted-foreground'
              }`}
            >
              {changeType === 'positive' && <TrendingUp className="h-3 w-3" />}
              {changeType === 'negative' && <TrendingDown className="h-3 w-3" />}
              {change}
            </p>
          )}
        </div>
        <div className="text-muted-foreground">{icon}</div>
      </div>
    </CardContent>
  );

  if (href) {
    return (
      <Card className="shadow-md rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
        <Link href={href}>{content}</Link>
      </Card>
    );
  }

  return <Card className="shadow-md rounded-lg hover:shadow-lg transition-shadow">{content}</Card>;
}

export function FinanceDashboard() {
  const { data: accountsData, isLoading: accountsLoading } = useAccounts();
  const { selectedDateRange } = useStore();

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

  const { data: transactionsData } = useTransactions({
    dateFrom,
    dateTo,
    limit: 1,
  });
  const [totalBalanceEUR, setTotalBalanceEUR] = useState(0);
  const [isConvertingBalances, setIsConvertingBalances] = useState(false);
  const isConvertingBalancesRef = useRef(false);

  const accounts = useMemo(() => accountsData?.accounts || [], [accountsData?.accounts]);
  const summary = accountsData?.summary;
  const transactionSummary = transactionsData?.summary;

  const monthlyIncomeEUR = transactionSummary?.income ?? 0;
  const monthlyExpensesEUR = transactionSummary?.expenses ?? 0;
  const incomeFrequency = transactionSummary?.incomeCount ?? 0;
  const expenseFrequency = transactionSummary?.expenseCount ?? 0;

  useEffect(() => {
    const convertBalances = async () => {
      if (!accounts.length || isConvertingBalancesRef.current) return;

      if (accountsLoading) return;

      isConvertingBalancesRef.current = true;
      setIsConvertingBalances(true);
      try {
        let totalInEUR = 0;

        for (const account of accounts) {
          if (!account.isActive) continue;

          totalInEUR += await convertToBaseCurrencySafe(account.balance, account.currency);
        }

        setTotalBalanceEUR(totalInEUR);
      } catch (error) {
        console.error('Failed to convert balances:', error);
      } finally {
        setIsConvertingBalances(false);
        isConvertingBalancesRef.current = false;
      }
    };

    convertBalances();
  }, [accounts, accountsLoading]);

  return (
    <AnimatedDiv variant="slideUp" className="space-y-4">
      <div className="container space-y-4">
        <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 4 }} gap={3}>
          <QuickStatCard
            title="Total Balance"
            value={isConvertingBalances ? 'Converting...' : formatSummaryAmount(totalBalanceEUR)}
            icon={
              isConvertingBalances ? (
                <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 animate-spin" />
              ) : (
                <Wallet className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
              )
            }
            href="/accounts"
          />

          <QuickStatCard
            title="Income"
            value={formatSummaryAmount(monthlyIncomeEUR)}
            changeType="positive"
            change={`${incomeFrequency} transactions`}
            icon={<TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-income" />}
            href="/transactions"
          />

          <QuickStatCard
            title="Expenses"
            value={formatSummaryAmount(monthlyExpensesEUR)}
            changeType="negative"
            change={`${expenseFrequency} transactions`}
            icon={<TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-expense" />}
            href="/transactions"
          />

          <QuickStatCard
            title="Active Accounts"
            value={summary?.active?.toString() || '0'}
            change={`of ${summary?.total || 0} total`}
            icon={<BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />}
            href="/accounts"
          />
        </ResponsiveGrid>

        <AnimatedDiv variant="slideUp" delay={0.3} className="space-y-4">
          <div className="w-full animate-fade-in">
            <CashFlowSankeyChart />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
            <div className="xl:col-span-2 animate-fade-in">
              <IncomeExpenseChart />
            </div>
            <div className="xl:col-span-1 animate-fade-in">
              <AccountBalanceTrendsChart />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-stretch">
            <div className="animate-fade-in h-full">
              <CategorySpendingChart className="h-full" />
            </div>
            <div className="animate-fade-in h-full">
              <Card className="shadow-md rounded-lg hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Budget Performance
                  </CardTitle>
                  <CardDescription>Your budget vs actual spending by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <BudgetPerformanceChart />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="w-full animate-fade-in">
            <NetWorthChart />
          </div>
        </AnimatedDiv>
      </div>
    </AnimatedDiv>
  );
}
