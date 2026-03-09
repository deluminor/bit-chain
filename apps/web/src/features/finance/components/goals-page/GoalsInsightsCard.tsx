'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BASE_CURRENCY, formatDisplayAmount } from '@/lib/currency';
import { TrendingUp } from 'lucide-react';

interface GoalsSummary {
  total: number;
  active: number;
  totalTarget: number;
  totalCurrent: number;
  completed: number;
}

interface GoalsInsightsCardProps {
  summary: GoalsSummary;
  goalsCount: number;
}

export function GoalsInsightsCard({ summary, goalsCount }: GoalsInsightsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Achievement Insights
        </CardTitle>
        <CardDescription>Your progress and milestones</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="text-center p-3 bg-green-500/10 rounded-lg">
            <div className="text-xl font-bold text-green-500">
              {summary.totalTarget > 0
                ? Math.round((summary.totalCurrent / summary.totalTarget) * 100)
                : 0}
              %
            </div>
            <div className="text-xs text-muted-foreground">Overall Progress</div>
          </div>

          <div className="text-center p-3 bg-blue-500/10 rounded-lg">
            <div className="text-xl font-bold text-blue-500">
              {formatDisplayAmount(
                summary.totalCurrent / Math.max(goalsCount, 1),
                BASE_CURRENCY,
                'summary',
              )}
            </div>
            <div className="text-xs text-muted-foreground">Avg per Goal</div>
          </div>

          <div className="text-center p-3 bg-purple-500/10 rounded-lg">
            <div className="text-xl font-bold text-purple-500">{summary.completed}</div>
            <div className="text-xs text-muted-foreground">Completed Goals</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
