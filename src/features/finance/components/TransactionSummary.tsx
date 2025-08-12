'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, ArrowRightLeft, Plus, Eye } from 'lucide-react';
import { useTransactions } from '@/features/finance/queries/transactions';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AddTransactionForm } from '@/components/forms/AddTransactionForm';
import Link from 'next/link';
import { currencyService, formatSummaryAmount, formatCurrency } from '@/lib/currency';

interface TransactionSummaryProps {
  period?: 'all' | 'month' | 'week';
  showAddButton?: boolean;
  showViewAllButton?: boolean;
}

export function TransactionSummary({
  period = 'month',
  showAddButton = true,
  showViewAllButton = true,
}: TransactionSummaryProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [incomeEUR, setIncomeEUR] = useState(0);
  const [expensesEUR, setExpensesEUR] = useState(0);
  const [isConverting, setIsConverting] = useState(false);

  // Calculate date filters based on period
  const getDateFilters = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    switch (period) {
      case 'month':
        return { dateFrom: startOfMonth.toISOString().split('T')[0] };
      case 'week':
        return { dateFrom: startOfWeek.toISOString().split('T')[0] };
      default:
        return {};
    }
  };

  const { data, isLoading } = useTransactions({
    ...getDateFilters(),
    limit: 5, // Just need summary data
  });

  const summary = data?.summary;
  const recentTransactions = data?.transactions?.slice(0, 3) || [];

  // Convert transaction amounts to EUR
  useEffect(() => {
    const convertAmounts = async () => {
      if (!summary) return;

      setIsConverting(true);
      try {
        const fallbackRate = 0.025; // 1 UAH ≈ 0.025 EUR

        let convertedIncome = summary.income;
        let convertedExpenses = summary.expenses;

        // Assuming transactions are in UAH (most common case)
        if (summary.income > 0) {
          try {
            convertedIncome = await currencyService.convertToBaseCurrency(summary.income, 'UAH');
          } catch {
            convertedIncome = summary.income * fallbackRate;
          }
        }

        if (summary.expenses > 0) {
          try {
            convertedExpenses = await currencyService.convertToBaseCurrency(
              summary.expenses,
              'UAH',
            );
          } catch {
            convertedExpenses = summary.expenses * fallbackRate;
          }
        }

        setIncomeEUR(convertedIncome);
        setExpensesEUR(convertedExpenses);
      } catch (error) {
        console.error('Failed to convert transaction amounts:', error);
      } finally {
        setIsConverting(false);
      }
    };

    convertAmounts();
  }, [summary]);

  const periodLabels = {
    all: 'All Time',
    month: 'This Month',
    week: 'This Week',
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="animate-pulse">
          <div className="h-6 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </CardHeader>
        <CardContent className="animate-pulse">
          <div className="space-y-3">
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Transaction Summary</CardTitle>
            <CardDescription>{periodLabels[period]} overview</CardDescription>
          </div>

          {showAddButton && (
            <Button
              size="sm"
              onClick={() => setShowAddDialog(true)}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {summary ? (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
              {/* Income */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-500">Income</span>
                </div>
                <div className="font-bold text-green-500">
                  {isConverting ? 'Converting...' : formatSummaryAmount(incomeEUR)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {summary.incomeCount} transactions
                </div>
              </div>

              {/* Expenses */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-500">Expenses</span>
                </div>
                <div className="font-bold text-red-500">
                  {isConverting ? 'Converting...' : formatSummaryAmount(expensesEUR)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {summary.expenseCount} transactions
                </div>
              </div>

              {/* Net */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <ArrowRightLeft className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-500">Net</span>
                </div>
                <div
                  className={`font-bold ${
                    incomeEUR - expensesEUR >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {isConverting ? 'Converting...' : formatSummaryAmount(incomeEUR - expensesEUR)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {summary.totalTransactions} total
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            {recentTransactions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Recent Activity</h4>
                  {showViewAllButton && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/transactions" className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        View All
                      </Link>
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  {recentTransactions.map(transaction => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: transaction.category.color }}
                        />
                        <span className="text-sm">
                          {transaction.description || transaction.category.name}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {transaction.type.toLowerCase()}
                        </Badge>
                      </div>

                      <div className="text-sm font-medium">
                        <span
                          className={
                            transaction.type === 'INCOME'
                              ? 'text-green-500'
                              : transaction.type === 'EXPENSE'
                                ? 'text-red-500'
                                : 'text-blue-500'
                          }
                        >
                          {transaction.type === 'EXPENSE' ? '-' : '+'}
                          {formatCurrency(transaction.amount, transaction.currency, {
                            useLargeNumberFormat: false,
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-muted-foreground py-6">
            <ArrowRightLeft className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No transactions found for this period</p>
          </div>
        )}
      </CardContent>

      {/* Add Transaction Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <AddTransactionForm
            onSuccess={() => setShowAddDialog(false)}
            onCancel={() => setShowAddDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
