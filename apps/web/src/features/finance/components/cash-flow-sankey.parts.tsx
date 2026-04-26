import { formatSummaryAmount } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { Activity } from 'lucide-react';
import type { SankeyLinkPayload, SankeyNodePayload } from './cash-flow-sankey.types';

interface CashFlowSankeyFooterProps {
  income: number;
  expenses: number;
  net: number;
}

export function CashFlowSankeyFooter({ income, expenses, net }: CashFlowSankeyFooterProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-transfer" />
        <span className="text-muted-foreground">Net Flow:</span>
        <span className={cn(net >= 0 ? 'text-income' : 'text-expense')}>
          {net >= 0 ? '+' : ''}
          {formatSummaryAmount(net)}
        </span>
      </div>
      <div className="flex items-center gap-4 text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-income" />
          Income: {formatSummaryAmount(income)}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-expense" />
          Expenses: {formatSummaryAmount(expenses)}
        </span>
      </div>
    </div>
  );
}

interface SankeyTooltipContentProps {
  payload?: Array<{
    payload: SankeyLinkPayload & SankeyNodePayload;
    value?: number;
    name?: string;
  }>;
}

export function SankeyTooltipContent({ payload }: SankeyTooltipContentProps) {
  const entry = payload?.[0];
  if (!entry) return null;

  const linkPayload = entry.payload;
  const value = entry.value ?? linkPayload.value;
  const from = linkPayload.sourceName;
  const to = linkPayload.targetName;
  const name = linkPayload.name ?? entry.name;

  if (value == null) return null;

  return (
    <div className="rounded-md border border-border/50 bg-background px-3 py-2 text-xs shadow-sm">
      {from && to ? (
        <div className="font-medium text-foreground">
          {from} {'->'} {to}
        </div>
      ) : (
        <div className="font-medium text-foreground">{name}</div>
      )}
      <div className="text-muted-foreground">{formatSummaryAmount(Number(value))}</div>
    </div>
  );
}

interface FlowItem {
  id: string;
  name: string;
  amount: number;
  isFreeCash?: boolean;
}

interface CashFlowSankeyBreakdownProps {
  sources: FlowItem[];
  targets: FlowItem[];
  sankeyBase: string;
  freeCashColor: string;
  lightMonochrome?: {
    flow: string;
    freeCash: string;
  };
}

export function CashFlowSankeyBreakdown({
  sources,
  targets,
  sankeyBase,
  freeCashColor,
  lightMonochrome,
}: CashFlowSankeyBreakdownProps) {
  const dotIncome = lightMonochrome ? lightMonochrome.flow : sankeyBase;
  const dotExpense = (isFree: boolean | undefined) => {
    if (lightMonochrome) {
      return isFree ? lightMonochrome.freeCash : lightMonochrome.flow;
    }

    return isFree ? freeCashColor : sankeyBase;
  };

  return (
    <div className="grid grid-cols-1 gap-5 pt-6 text-sm md:grid-cols-2 md:gap-8">
      <div className="space-y-2">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">From (Income)</div>
        {sources.map(source => (
          <div key={source.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: dotIncome }} />
              <span className="text-foreground">{source.name}</span>
            </div>
            <span className="text-muted-foreground">{formatSummaryAmount(source.amount)}</span>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">To (Expenses)</div>
        {targets.map(target => (
          <div key={target.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: dotExpense(target.isFreeCash) }}
              />
              <span className="text-foreground">{target.name}</span>
            </div>
            <span className="text-muted-foreground">{formatSummaryAmount(target.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
