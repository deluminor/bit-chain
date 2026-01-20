'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import {
  Activity,
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { useAccounts } from '@/features/finance/queries/accounts';
import { useTransactions } from '@/features/finance/queries/transactions';
import { useGoals, calculateGoalProgress } from '@/features/finance/queries/goals';
import { IncomeExpenseChart } from '@/components/layout/charts/IncomeExpenseChart';
import { CategorySpendingChart } from '@/features/finance/components/CategorySpendingChart';
import { AccountBalanceTrendsChart } from '@/components/layout/charts/AccountBalanceTrendsChart';
import { NetWorthChart } from '@/features/finance/components/NetWorthChart';
import { BudgetPerformanceChart } from '@/components/layout/charts/BudgetPerformanceChart';
import { CashFlowSankeyChart } from '@/features/finance/components/CashFlowSankeyChart';
import { AnimatedDiv } from '@/components/ui/animations';
import { ResponsiveGrid } from '@/components/ui/responsive-helpers';

import {
  convertToBaseCurrencySafe,
  formatSummaryAmount,
  formatDisplayAmount,
} from '@/lib/currency';
import { useState, useEffect } from 'react';

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
                  ? 'text-green-600'
                  : changeType === 'negative'
                    ? 'text-red-600'
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
  const { data: transactionsData, isLoading: transactionsLoading } = useTransactions({
    dateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split('T')[0],
    dateTo: new Date().toISOString().split('T')[0],
  });
  const { data: goalsData, isLoading: goalsLoading } = useGoals();

  const [totalBalanceEUR, setTotalBalanceEUR] = useState(0);
  const [monthlyIncomeEUR, setMonthlyIncomeEUR] = useState(0);
  const [monthlyExpensesEUR, setMonthlyExpensesEUR] = useState(0);
  const [isConverting, setIsConverting] = useState(false);
  const [largestIncome, setLargestIncome] = useState(0);
  const [largestExpense, setLargestExpense] = useState(0);
  const [incomeFrequency, setIncomeFrequency] = useState(0);
  const [expenseFrequency, setExpenseFrequency] = useState(0);
  const [savingsRate, setSavingsRate] = useState(0);
  const [netFlow, setNetFlow] = useState(0);

  const accounts = accountsData?.accounts || [];
  const summary = accountsData?.summary;
  const transactions = transactionsData?.transactions || [];
  const goals = goalsData?.goals || [];

  // Convert all account balances and transactions to EUR
  useEffect(() => {
    const convertBalances = async () => {
      if (!accounts.length || isConverting) return;

      if (accountsLoading || transactionsLoading) return;

      setIsConverting(true);
      try {
        let totalInEUR = 0;

        for (const account of accounts) {
          if (!account.isActive) continue;

          totalInEUR += await convertToBaseCurrencySafe(account.balance, account.currency);
        }

        setTotalBalanceEUR(totalInEUR);

        // Skip if no transactions
        if (transactions.length === 0) {
          setMonthlyIncomeEUR(0);
          setMonthlyExpensesEUR(0);
          return;
        }

        // Convert individual transactions to EUR for accurate calculation
        let totalIncomeEUR = 0;
        let totalExpensesEUR = 0;
        let peakIncome = 0;
        let peakExpense = 0;
        let incomeCount = 0;
        let expenseCount = 0;

        for (const transaction of transactions) {
          const convertedAmount = await convertToBaseCurrencySafe(
            transaction.amount,
            transaction.currency,
          );

          if (transaction.type === 'INCOME') {
            totalIncomeEUR += convertedAmount;
            incomeCount += 1;
            peakIncome = Math.max(peakIncome, convertedAmount);
          } else if (transaction.type === 'EXPENSE') {
            totalExpensesEUR += convertedAmount;
            expenseCount += 1;
            peakExpense = Math.max(peakExpense, convertedAmount);
          }
        }

        setMonthlyIncomeEUR(totalIncomeEUR);
        setMonthlyExpensesEUR(totalExpensesEUR);
        setLargestIncome(peakIncome);
        setLargestExpense(peakExpense);
        setIncomeFrequency(incomeCount);
        setExpenseFrequency(expenseCount);
        const net = totalIncomeEUR - totalExpensesEUR;
        setNetFlow(net);
        setSavingsRate(totalIncomeEUR > 0 ? Math.round((net / totalIncomeEUR) * 100) : 0);
      } catch (error) {
        console.error('Failed to convert balances:', error);
      } finally {
        setIsConverting(false);
      }
    };

    convertBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts.length, transactions.length, accountsLoading, transactionsLoading]);

  return (
    <AnimatedDiv variant="slideUp" className="space-y-4">
      <div className="container space-y-4">
        {/* Quick Stats Grid */}
        <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 4 }} gap={3}>
          <QuickStatCard
            title="Total Balance"
            value={isConverting ? 'Converting...' : formatSummaryAmount(totalBalanceEUR)}
            icon={
              isConverting ? (
                <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 animate-spin" />
              ) : (
                <Wallet className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
              )
            }
            href="/accounts"
          />

          <QuickStatCard
            title="This Month Income"
            value={isConverting ? 'Converting...' : formatSummaryAmount(monthlyIncomeEUR)}
            changeType="positive"
            change={`${transactions.filter(t => t.type === 'INCOME').length} transactions`}
            icon={<TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />}
            href="/transactions"
          />

          <QuickStatCard
            title="This Month Expenses"
            value={isConverting ? 'Converting...' : formatSummaryAmount(monthlyExpensesEUR)}
            changeType="negative"
            change={`${transactions.filter(t => t.type === 'EXPENSE').length} transactions`}
            icon={<TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />}
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
                <span
                  className={`font-semibold ${netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {netFlow >= 0 ? '+' : ''}
                  {formatSummaryAmount(netFlow)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Savings Rate</span>
                <span className="font-semibold text-emerald-500">{savingsRate}%</span>
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
                <span className="font-semibold text-emerald-500">
                  {formatSummaryAmount(largestIncome)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Largest Expense</span>
                <span className="font-semibold text-rose-500">
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
                <Button size="sm" className="mt-2 md:mt-0">
                  + New Goal
                </Button>
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
