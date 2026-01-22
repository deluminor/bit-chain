'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { AccountBalanceTrendsChart } from '@/components/layout/charts/AccountBalanceTrendsChart';
import { BudgetPerformanceChart } from '@/components/layout/charts/BudgetPerformanceChart';
import { IncomeExpenseChart } from '@/components/layout/charts/IncomeExpenseChart';
import { AnimatedDiv } from '@/components/ui/animations';
import { ResponsiveGrid } from '@/components/ui/responsive-helpers';
import { CashFlowSankeyChart } from '@/features/finance/components/CashFlowSankeyChart';
import { CategorySpendingChart } from '@/features/finance/components/CategorySpendingChart';
import { NetWorthChart } from '@/features/finance/components/NetWorthChart';
import { useAccounts } from '@/features/finance/queries/accounts';
import { calculateGoalProgress, useGoals } from '@/features/finance/queries/goals';
import { useTransactions } from '@/features/finance/queries/transactions';
import {
  Activity,
  BarChart3,
  RefreshCw,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';

import {
  convertToBaseCurrencySafe,
  formatDisplayAmount,
  formatSummaryAmount,
} from '@/lib/currency';
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
  const dateFrom = useMemo(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
  }, []);

  const dateTo = useMemo(() => {
    const today = new Date();
    return new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999,
    ).toISOString();
  }, []);

  const { data: transactionsData } = useTransactions({
    dateFrom,
    dateTo,
    limit: 1,
  });
  const { data: goalsData, isLoading: goalsLoading } = useGoals();

  const [totalBalanceEUR, setTotalBalanceEUR] = useState(0);
  const [isConvertingBalances, setIsConvertingBalances] = useState(false);
  const isConvertingBalancesRef = useRef(false);

  const accounts = accountsData?.accounts || [];
  const summary = accountsData?.summary;
  const transactionSummary = transactionsData?.summary;
  const goals = goalsData?.goals || [];

  const monthlyIncomeEUR = transactionSummary?.income ?? 0;
  // Use monthlyExpensesEUR which is already calculated correctly in API (excluding transfers)
  const monthlyExpensesEUR = transactionSummary?.expenses ?? 0;
  const incomeFrequency = transactionSummary?.incomeCount ?? 0;
  const expenseFrequency = transactionSummary?.expenseCount ?? 0;
  const largestIncome = transactionSummary?.maxIncome ?? 0;
  const largestExpense = transactionSummary?.maxExpense ?? 0;
  const netFlow = monthlyIncomeEUR - monthlyExpensesEUR;
  const savingsRate = monthlyIncomeEUR > 0 ? Math.round((netFlow / monthlyIncomeEUR) * 100) : 0;

  // Convert all account balances and transactions to EUR
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
        {/* Quick Stats Grid */}
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
            title="This Month Income"
            value={formatSummaryAmount(monthlyIncomeEUR)}
            changeType="positive"
            change={`${incomeFrequency} transactions`}
            icon={<TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-income" />}
            href="/transactions"
          />

          <QuickStatCard
            title="This Month Expenses"
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

        {/* Cashflow Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <Card className="shadow-md rounded-lg hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Monthly Pulse</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Net Flow</span>
                <span className={`font-semibold ${netFlow >= 0 ? 'text-income' : 'text-expense'}`}>
                  {netFlow >= 0 ? '+' : ''}
                  {formatSummaryAmount(netFlow)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Savings Rate</span>
                <span className="font-semibold text-income">{savingsRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Income Count</span>
                <span className="font-semibold">{incomeFrequency}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Expense Count</span>
                <span className="font-semibold">{expenseFrequency}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md rounded-lg hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Largest Moves</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Largest Income</span>
                <span className="font-semibold text-income">
                  {formatSummaryAmount(largestIncome)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Largest Expense</span>
                <span className="font-semibold text-expense">
                  {formatSummaryAmount(largestExpense)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Activity className="h-4 w-4" />
                Based on current month activity
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md rounded-lg hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex flex-col md:flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="rounded-full p-1 bg-black text-white">
                    <Target className="h-4 w-4" />
                  </div>
                  Financial Goals
                </CardTitle>
                {/*<Button size="sm" className="mt-2 md:mt-0">
                  + New Goal
                </Button>*/}
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              {goalsLoading ? (
                <div className="space-y-3">
                  <div className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-muted rounded w-full"></div>
                  </div>
                </div>
              ) : goals.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {goals.slice(0, 4).map(goal => (
                      <div key={goal.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{goal.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {calculateGoalProgress(goal.currentAmount, goal.targetAmount)}%
                          </span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${calculateGoalProgress(goal.currentAmount, goal.targetAmount)}%`,
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            {formatDisplayAmount(goal.currentAmount, goal.currency, 'summary')}
                          </span>
                          <span>
                            {formatDisplayAmount(goal.targetAmount, goal.currency, 'summary')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {goals.length > 4 && (
                    <div className="text-center pt-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/goals">View {goals.length - 4} more goals</Link>
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm mb-2">No goals yet</p>
                  <Button size="sm" asChild>
                    <Link href="/goals">Create Goal</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Financial Analytics Charts */}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="animate-fade-in">
              <CategorySpendingChart />
            </div>
            <div className="animate-fade-in">
              <BudgetPerformanceChart />
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
