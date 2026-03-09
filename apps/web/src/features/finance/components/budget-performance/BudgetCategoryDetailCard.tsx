import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatSummaryAmount } from '@/lib/currency';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export interface BudgetCategoryDetail {
  id: string;
  name: string;
  planned: number;
  actual: number;
  color: string;
}

interface BudgetCategoryDetailCardProps {
  category: BudgetCategoryDetail;
}

export function BudgetCategoryDetailCard({ category }: BudgetCategoryDetailCardProps) {
  const percentage = category.planned > 0 ? (category.actual / category.planned) * 100 : 0;
  const isOverBudget = category.actual > category.planned;
  const variance = category.actual - category.planned;

  return (
    <div className="p-3 rounded-lg border bg-card">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
          <span className="font-medium">{category.name}</span>
          {isOverBudget ? (
            <AlertTriangle className="h-4 w-4 text-red-500" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
        </div>
        <div className="text-right">
          <div className="font-semibold">{formatSummaryAmount(category.actual)}</div>
          <div className="text-sm text-muted-foreground">
            of {formatSummaryAmount(category.planned)}
          </div>
        </div>
      </div>

      <Progress value={Math.min(percentage, 100)} className="h-2 mb-2" />

      <div className="flex items-center justify-between text-sm">
        <Badge variant={isOverBudget ? 'destructive' : 'default'} className="text-xs">
          {percentage.toFixed(1)}%
        </Badge>
        <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
          {variance >= 0 ? '+' : ''}
          {formatSummaryAmount(variance)}
        </span>
      </div>
    </div>
  );
}
