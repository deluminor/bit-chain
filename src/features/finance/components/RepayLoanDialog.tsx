'use client';

import { Button } from '@/components/ui/button';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Loan } from '@/features/finance/queries/loans';
import { formatCurrency } from '@/lib/currency';
import { Banknote, TrendingDown } from 'lucide-react';
import { useState } from 'react';

interface RepayLoanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loan: Loan;
  onConfirm: (amount: number) => Promise<void>;
}

export function RepayLoanDialog({ open, onOpenChange, loan, onConfirm }: RepayLoanDialogProps) {
  const [amount, setAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const remaining = loan.totalAmount - loan.paidAmount;
  const newPaidAmount = loan.paidAmount + amount;
  const progress = loan.totalAmount > 0 ? (newPaidAmount / loan.totalAmount) * 100 : 0;
  const newRemaining = Math.max(loan.totalAmount - newPaidAmount, 0);

  const handleSubmit = async () => {
    if (amount <= 0) return;

    setIsSubmitting(true);
    try {
      await onConfirm(amount);
      setAmount(0);
      onOpenChange(false);
    } catch {
      // Error handling is done in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAdd = (value: number) => {
    setAmount(prev => Math.min(prev + value, remaining));
  };

  const quickAddAmounts = [100, 500, 1000, 5000].filter(v => v <= remaining || v === 100);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-primary" />
            Repay Loan
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Loan Info */}
          <div className="p-4 rounded-lg bg-muted/40 border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{loan.name}</span>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Loan</span>
                <span className="font-semibold">
                  {formatCurrency(loan.totalAmount, loan.currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Already Paid</span>
                <span className="font-semibold">
                  {formatCurrency(loan.paidAmount, loan.currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-rose-600">
                <span>Remaining</span>
                <span className="font-semibold">{formatCurrency(remaining, loan.currency)}</span>
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Repayment Amount</Label>
            <CurrencyInput
              placeholder="0.00"
              value={amount}
              onAmountChange={(val: number) => setAmount(Math.min(val, remaining))}
              currency={loan.currency}
              showCurrencySelect={false}
              className="text-lg"
            />
            {amount > remaining && (
              <p className="text-xs text-rose-500">Amount exceeds remaining balance</p>
            )}
          </div>

          {/* Quick Add Buttons */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Quick add</Label>
            <div className="grid grid-cols-4 gap-2">
              {quickAddAmounts.map(value => (
                <Button
                  key={value}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdd(value)}
                  className="text-xs"
                >
                  +{formatCurrency(value, loan.currency)}
                </Button>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAmount(remaining)}
                className="text-xs font-medium text-primary"
              >
                Pay Full
              </Button>
            </div>
          </div>

          {/* Preview */}
          {amount > 0 && (
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">New Remaining</span>
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(newRemaining, loan.currency)}
                </span>
              </div>
              <div className="space-y-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{progress.toFixed(1)}% paid</span>
                  {progress >= 100 && (
                    <span className="text-green-600 font-semibold">Loan fully paid! 🎉</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setAmount(0);
              onOpenChange(false);
            }}
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={amount <= 0 || amount > remaining || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Processing...' : `Repay ${formatCurrency(amount, loan.currency)}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
