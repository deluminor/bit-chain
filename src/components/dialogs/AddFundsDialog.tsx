'use client';

import { Button } from '@/components/ui/button';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/currency';
import { DollarSign, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface AddFundsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goalName: string;
  currentAmount: number;
  targetAmount: number;
  currency: string;
  onConfirm: (amount: number) => Promise<void>;
}

export function AddFundsDialog({
  open,
  onOpenChange,
  goalName,
  currentAmount,
  targetAmount,
  currency,
  onConfirm,
}: AddFundsDialogProps) {
  const [amount, setAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const remaining = Math.max(targetAmount - currentAmount, 0);
  const newTotal = currentAmount + amount;
  const progress = targetAmount > 0 ? (newTotal / targetAmount) * 100 : 0;

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
    setAmount(prev => prev + value);
  };

  const quickAddAmounts = [100, 500, 1000, 5000];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Add Funds to Goal
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Goal Info */}
          <div className="p-4 rounded-lg bg-muted/40 border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{goalName}</span>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current</span>
                <span className="font-semibold">{formatCurrency(currentAmount, currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Target</span>
                <span className="font-semibold">{formatCurrency(targetAmount, currency)}</span>
              </div>
              <div className="flex justify-between text-sm text-orange-600">
                <span>Remaining</span>
                <span className="font-semibold">{formatCurrency(remaining, currency)}</span>
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Add</Label>
            <CurrencyInput
              placeholder="0.00"
              value={amount}
              onAmountChange={setAmount}
              currency={currency}
              showCurrencySelect={false}
              className="text-lg"
            />
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
                  +{formatCurrency(value, currency)}
                </Button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {amount > 0 && (
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">New Total</span>
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(newTotal, currency)}
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
                  <span>{progress.toFixed(1)}% complete</span>
                  {progress >= 100 && (
                    <span className="text-green-600 font-semibold">Goal achieved! 🎉</span>
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
            disabled={amount <= 0 || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Adding...' : `Add ${formatCurrency(amount, currency)}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
