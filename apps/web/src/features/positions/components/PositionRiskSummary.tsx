import { getRiskColorClass } from '../utils/formatters';

interface PositionRiskSummaryProps {
  riskPercent: number;
}

export function PositionRiskSummary({ riskPercent }: PositionRiskSummaryProps) {
  return (
    <div className="col-span-2 flex flex-col justify-end space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Risk Percentage:</span>
        <span className={`font-medium ${getRiskColorClass(riskPercent)}`}>{riskPercent}%</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-2.5 rounded-full ${
            riskPercent <= 10 ? 'bg-green-500' : riskPercent <= 20 ? 'bg-amber-500' : 'bg-red-500'
          }`}
          style={{ width: `${Math.min(riskPercent, 100)}%` }}
        />
      </div>
    </div>
  );
}
