'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Eye,
  Target,
  PieChart,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { useAccounts, FinanceAccount } from '@/features/finance/queries/accounts';
import { useTransactions } from '@/features/finance/queries/transactions';
import { useGoals, calculateGoalProgress } from '@/features/finance/queries/goals';
import { TransactionSummary } from './TransactionSummary';
import { IncomeExpenseChart } from '@/components/layout/charts/IncomeExpenseChart';
import { CategorySpendingChart } from '@/components/layout/charts/CategorySpendingChart';
import { AccountBalanceTrendsChart } from '@/components/layout/charts/AccountBalanceTrendsChart';
import { NetWorthChart } from '@/components/layout/charts/NetWorthChart';
import { BudgetPerformanceChart } from '@/components/layout/charts/BudgetPerformanceChart';
import { AnimatedDiv } from '@/components/ui/animations';
import { ResponsiveGrid, ResponsiveChart } from '@/components/ui/responsive-helpers';

import {
  currencyService,
  formatSummaryAmount,
  formatCurrency,
  BASE_CURRENCY,
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
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
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
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <Link href={href}>{content}</Link>
      </Card>
    );
  }

  return <Card>{content}</Card>;
}

export function FinanceDashboard() {
  const { data: accountsData, isLoading: accountsLoading } = useAccounts();
  const { data: transactionsData } = useTransactions({
    dateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split('T')[0],
    limit: 1,
  });
  const { data: goalsData, isLoading: goalsLoading } = useGoals();

  const [totalBalanceEUR, setTotalBalanceEUR] = useState(0);
  const [monthlyIncomeEUR, setMonthlyIncomeEUR] = useState(0);
  const [monthlyExpensesEUR, setMonthlyExpensesEUR] = useState(0);
  const [isConverting, setIsConverting] = useState(false);

  const accounts = accountsData?.accounts || [];
  const summary = accountsData?.summary;
  const transactionSummary = transactionsData?.summary;
  const goals = goalsData?.goals || [];

  // Convert all account balances and transactions to EUR
  useEffect(() => {
    const convertBalances = async () => {
      if (!accounts.length) return;

      setIsConverting(true);
      try {
        let totalInEUR = 0;

        // Fallback conversion rates
        const fallbackRates: Record<string, number> = {
          USD: 0.9, // 1 USD ≈ 0.9 EUR
          UAH: 0.025, // 1 UAH ≈ 0.025 EUR
          GBP: 1.15, // 1 GBP ≈ 1.15 EUR
          PLN: 0.23, // 1 PLN ≈ 0.23 EUR
          CZK: 0.04, // 1 CZK ≈ 0.04 EUR
          CHF: 1.05, // 1 CHF ≈ 1.05 EUR
          CAD: 0.68, // 1 CAD ≈ 0.68 EUR
          JPY: 0.0062, // 1 JPY ≈ 0.0062 EUR
        };

        for (const account of accounts) {
          if (!account.isActive) continue;

          let convertedAmount = account.balance;

          if (account.currency !== BASE_CURRENCY) {
            try {
              convertedAmount = await currencyService.convertToBaseCurrency(
                account.balance,
                account.currency,
              );
            } catch {
              convertedAmount = account.balance * (fallbackRates[account.currency] || 1);
            }
          }

          totalInEUR += convertedAmount;
        }

        setTotalBalanceEUR(totalInEUR);

        // Convert transaction summary to EUR
        if (transactionSummary) {
          let incomeInEUR = transactionSummary.income;
          let expensesInEUR = transactionSummary.expenses;

          // Assuming transactions are in UAH (most common case)
          if (transactionSummary.income > 0) {
            try {
              incomeInEUR = await currencyService.convertToBaseCurrency(
                transactionSummary.income,
                'UAH',
              );
            } catch {
              incomeInEUR = transactionSummary.income * (fallbackRates['UAH'] || 0.025);
            }
          }

          if (transactionSummary.expenses > 0) {
            try {
              expensesInEUR = await currencyService.convertToBaseCurrency(
                transactionSummary.expenses,
                'UAH',
              );
            } catch {
              expensesInEUR = transactionSummary.expenses * (fallbackRates['UAH'] || 0.025);
            }
          }

          setMonthlyIncomeEUR(incomeInEUR);
          setMonthlyExpensesEUR(expensesInEUR);
        }
      } catch (error) {
        console.error('Failed to convert balances:', error);
      } finally {
        setIsConverting(false);
      }
    };

    convertBalances();
  }, [accounts, transactionSummary]);

  return (
    <AnimatedDiv variant="slideUp" className="space-y-6">
      {/* Quick Stats Grid */}
      <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 4 }} className="mb-6">
        <QuickStatCard
          title="Total Balance"
          value={isConverting ? 'Converting...' : formatSummaryAmount(totalBalanceEUR)}
          icon={
            isConverting ? (
              <RefreshCw className="h-6 w-6 animate-spin" />
            ) : (
              <Wallet className="h-6 w-6" />
            )
          }
          href="/accounts"
        />

        <QuickStatCard
          title="Active Accounts"
          value={summary?.active?.toString() || '0'}
          change={`of ${summary?.total || 0} total`}
          icon={<BarChart3 className="h-6 w-6" />}
          href="/accounts"
        />

        <QuickStatCard
          title="This Month Income"
          value={isConverting ? 'Converting...' : formatSummaryAmount(monthlyIncomeEUR)}
          changeType="positive"
          change={`${transactionSummary?.incomeCount || 0} transactions`}
          icon={<TrendingUp className="h-6 w-6" />}
          href="/transactions"
        />

        <QuickStatCard
          title="This Month Expenses"
          value={isConverting ? 'Converting...' : formatSummaryAmount(monthlyExpensesEUR)}
          changeType="negative"
          change={`${transactionSummary?.expenseCount || 0} transactions`}
          icon={<TrendingDown className="h-6 w-6" />}
          href="/transactions"
        />
      </ResponsiveGrid>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Summary */}
        <TransactionSummary period="month" showAddButton={true} showViewAllButton={true} />

        {/* Account Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Account Overview</CardTitle>
                <CardDescription>Your financial accounts</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/accounts" className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  View All
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {accountsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </div>
                ))}
              </div>
            ) : accounts.length > 0 ? (
              <div className="space-y-3">
                {accounts.slice(0, 4).map((account: FinanceAccount) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: account.color + '20', color: account.color }}
                      >
                        <Wallet className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{account.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {account.type.replace('_', ' ')} • {account.currency}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {account.currency === BASE_CURRENCY
                          ? formatSummaryAmount(account.balance)
                          : formatCurrency(account.balance, account.currency, {
                              useLargeNumberFormat: false,
                            })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {account._count?.transactions || 0} transactions
                      </div>
                    </div>
                  </div>
                ))}

                {accounts.length > 4 && (
                  <div className="text-center pt-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/accounts">View {accounts.length - 4} more accounts</Link>
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-6">
                <Wallet className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm mb-2">No accounts yet</p>
                <Button size="sm" asChild>
                  <Link href="/accounts">Create Account</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Net Worth Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Net Worth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {isConverting ? 'Converting...' : formatSummaryAmount(totalBalanceEUR)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Across {summary?.active || 0} accounts
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            {transactionSummary && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-green-600">Income:</span>
                  <span className="font-semibold text-green-600">
                    +{formatSummaryAmount(monthlyIncomeEUR)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Expenses:</span>
                  <span className="font-semibold text-red-600">
                    -{formatSummaryAmount(monthlyExpensesEUR)}
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Net:</span>
                    <span
                      className={`font-bold ${
                        monthlyIncomeEUR - monthlyExpensesEUR >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {monthlyIncomeEUR - monthlyExpensesEUR >= 0 ? '+' : ''}
                      {formatSummaryAmount(monthlyIncomeEUR - monthlyExpensesEUR)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Goals Preview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                Goals
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/goals" className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  View All
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {goalsLoading ? (
              <div className="space-y-3">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-2 bg-muted rounded w-full"></div>
                </div>
              </div>
            ) : goals.length > 0 ? (
              <div className="space-y-3">
                {goals.slice(0, 2).map(goal => (
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
                      <span>{formatSummaryAmount(goal.currentAmount)}</span>
                      <span>{formatSummaryAmount(goal.targetAmount)}</span>
                    </div>
                  </div>
                ))}
                {goals.length > 2 && (
                  <div className="text-center pt-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/goals">View {goals.length - 2} more goals</Link>
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
      <AnimatedDiv variant="slideUp" delay={0.3} className="space-y-6">
        {/* Net Worth and Income/Expense Trends */}
        <ResponsiveGrid cols={{ mobile: 1, tablet: 1, desktop: 2 }} gap={6}>
          <ResponsiveChart height={{ mobile: 350, desktop: 500 }}>
            <CategorySpendingChart />
          </ResponsiveChart>
          <ResponsiveChart height={{ mobile: 350, desktop: 500 }}>
            <NetWorthChart />
          </ResponsiveChart>
        </ResponsiveGrid>

        {/* Category Analysis and Account Trends */}
        <ResponsiveGrid cols={{ mobile: 1, tablet: 1, desktop: 2 }} gap={6}>
          <ResponsiveChart height={{ mobile: 350, desktop: 500 }}>
            <IncomeExpenseChart />
          </ResponsiveChart>
          <ResponsiveChart height={{ mobile: 350, desktop: 500 }}>
            <AccountBalanceTrendsChart />
          </ResponsiveChart>
        </ResponsiveGrid>

        {/* Budget Performance */}
        <ResponsiveChart height={{ mobile: 400, desktop: 500 }}>
          <BudgetPerformanceChart />
        </ResponsiveChart>
      </AnimatedDiv>
    </AnimatedDiv>
  );
}
