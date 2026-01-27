'use client';

import { ChartSkeleton } from '@/components/layout/charts/ChartSkeleton';
import { ChartWrapper } from '@/components/layout/charts/ChartWrapper';
import { useCashFlowSankey } from '@/features/finance/hooks/useCashFlowSankey';
import { formatSummaryAmount } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { THEME, useStore } from '@/store';
import { endOfDay, startOfDay } from 'date-fns';
import { Activity } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ResponsiveContainer, Sankey, Tooltip } from 'recharts';

type SankeyNodePayload = {
  name: string;
  color: string;
  isCenter?: boolean;
  depth?: number;
  value?: number;
  isFreeCash?: boolean;
};

type CashFlowTarget = {
  id: string;
  name: string;
  amount: number;
  color: string;
  isFreeCash?: boolean;
};

type SankeyNodeProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  payload: SankeyNodePayload;
};

type SankeyLinkPayload = {
  color?: string;
  id?: string;
  sourceName?: string;
  targetName?: string;
};

type SankeyLinkProps = {
  sourceX: number;
  targetX: number;
  sourceY: number;
  targetY: number;
  sourceControlX: number;
  targetControlX: number;
  linkWidth: number;
  payload: SankeyLinkPayload;
};

export function CashFlowSankeyChart() {
  const { theme, selectedDateRange } = useStore();

  // Use global date filter
  const dateFrom = useMemo(() => {
    if (selectedDateRange?.from) {
      return startOfDay(selectedDateRange.from).toISOString();
    }
    return undefined;
  }, [selectedDateRange?.from]);

  const dateTo = useMemo(() => {
    if (selectedDateRange?.to) {
      return endOfDay(selectedDateRange.to).toISOString();
    }
    return new Date().toISOString();
  }, [selectedDateRange?.to]);

  const { data, isLoading } = useCashFlowSankey({ dateFrom, dateTo });
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const isDark = theme === THEME.DARK;
  const textColor = isDark ? '#FFFFFF' : '#111827';
  const mutedColor = isDark ? '#D1D5DB' : '#6B7280';
  const sankeyBase = 'var(--primary)';
  const freeCashColor = 'var(--income)';
  const linkFallback = 'var(--muted-foreground)';

  const totals = useMemo(() => {
    if (!data) return { income: 0, expenses: 0, net: 0 };
    const net = data.totalIncome - data.totalExpenses;
    return {
      income: data.totalIncome,
      expenses: data.totalExpenses,
      net,
    };
  }, [data]);

  const targetsWithFreeCash = useMemo<CashFlowTarget[]>(() => {
    if (!data) return [];
    const freeCashAmount = Math.max(data.totalIncome - data.totalExpenses, 0);
    const targets = data.targets.map(target => ({
      ...target,
      isFreeCash: false,
    }));

    if (!freeCashAmount) {
      return targets;
    }

    return [
      ...targets,
      {
        id: 'free-cash',
        name: 'Free Cash',
        amount: freeCashAmount,
        color: freeCashColor,
        isFreeCash: true,
      },
    ];
  }, [data, freeCashColor]);

  const sankeyData = useMemo(() => {
    if (!data) return null;

    const sources = data.sources;
    const targets = targetsWithFreeCash;
    const centerIndex = sources.length;

    const nodes = [
      ...sources.map(source => ({
        name: source.name,
        color: sankeyBase,
      })),
      {
        name: 'Net Flow',
        color: sankeyBase,
      },
      ...targets.map(target => ({
        name: target.name,
        color: target.isFreeCash ? freeCashColor : sankeyBase,
        isFreeCash: target.isFreeCash,
      })),
    ];

    const links = [
      ...sources.map((source, index) => ({
        source: index,
        target: centerIndex,
        value: Math.max(source.amount, 0),
        color: sankeyBase,
        id: `income-${source.id}`,
        sourceName: source.name,
        targetName: 'Net Flow',
      })),
      ...targets.map((target, index) => ({
        source: centerIndex,
        target: centerIndex + 1 + index,
        value: Math.max(target.amount, 0),
        color: target.isFreeCash ? freeCashColor : sankeyBase,
        id: `expense-${target.id}`,
        sourceName: 'Net Flow',
        targetName: target.name,
      })),
    ];

    return { nodes, links };
  }, [data, freeCashColor, sankeyBase, targetsWithFreeCash]);

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (!data || (!data.sources.length && !data.targets.length)) {
    return (
      <ChartWrapper title="Income Flow" description="Category flow for selected period (EUR)">
        <div className="h-[280px] flex items-center justify-center text-sm text-muted-foreground">
          No income or expense data for the selected period.
        </div>
      </ChartWrapper>
    );
  }

  const renderNode = (props: SankeyNodeProps) => {
    const { x, y, width, height, payload } = props;
    const isCenter = payload.depth === 1;
    const isSource = payload.depth === 0;
    const isTarget = payload.depth === 2;
    const labelX = isSource ? x + width + 10 : isTarget ? x - 10 : x + width / 2;
    const labelAnchor = isSource ? 'start' : isTarget ? 'end' : 'middle';
    const value = payload.value ?? 0;

    const isActive = activeNode ? payload.name === activeNode : true;
    const opacity = isActive ? 1 : 0.2;

    return (
      <g onMouseEnter={() => setActiveNode(payload.name)} onMouseLeave={() => setActiveNode(null)}>
        <rect
          x={x}
          y={y}
          width={Math.max(6, width)}
          height={height}
          rx={2}
          fill={payload.color}
          opacity={isActive ? 0.7 : 0.2}
          style={{ transition: 'opacity 220ms ease' }}
        />
        <text
          x={labelX}
          y={isCenter ? y + height / 2 : y + height / 2 - 4}
          textAnchor={labelAnchor}
          dominantBaseline="middle"
          fill={textColor}
          fontSize={12}
          fontWeight={600}
          opacity={opacity}
          style={{ transition: 'opacity 220ms ease' }}
        >
          {payload.name}
        </text>
        {!isCenter && (
          <text
            x={labelX}
            y={y + height / 2 + 12}
            textAnchor={labelAnchor}
            dominantBaseline="middle"
            fill={mutedColor}
            fontSize={11}
            opacity={opacity}
            style={{ transition: 'opacity 220ms ease' }}
          >
            {formatSummaryAmount(value)}
          </text>
        )}
      </g>
    );
  };

  const renderLink = (props: SankeyLinkProps) => {
    const {
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourceControlX,
      targetControlX,
      linkWidth,
      payload,
    } = props;
    const isRelatedToNode =
      activeNode && (payload.sourceName === activeNode || payload.targetName === activeNode);
    const isActive = activeLink ? payload.id === activeLink : isRelatedToNode;
    const strokeOpacity = activeLink || activeNode ? (isActive ? 0.6 : 0.08) : 0.4;
    const stroke = payload.color || linkFallback;

    return (
      <path
        d={`M${sourceX},${sourceY} C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}`}
        fill="none"
        stroke={stroke}
        strokeOpacity={strokeOpacity}
        strokeWidth={Math.max(linkWidth, 3)}
        onMouseEnter={() => setActiveLink(payload.id ?? null)}
        onMouseLeave={() => setActiveLink(null)}
        style={{ transition: 'stroke-opacity 240ms ease' }}
      />
    );
  };

  return (
    <ChartWrapper
      title="Income Flow"
      description="Category flow for selected period (EUR)"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-transfer" />
            <span className="text-muted-foreground">Net Flow:</span>
            <span className={cn(totals.net >= 0 ? 'text-income' : 'text-expense')}>
              {totals.net >= 0 ? '+' : ''}
              {formatSummaryAmount(totals.net)}
            </span>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-income" />
              Income: {formatSummaryAmount(totals.income)}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-expense" />
              Expenses: {formatSummaryAmount(totals.expenses)}
            </span>
          </div>
        </div>
      }
    >
      <div className="px-4 pb-4">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[760px] h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <Sankey
                data={sankeyData ?? { nodes: [], links: [] }}
                nodeWidth={10}
                nodePadding={16}
                margin={{ left: 96, right: 96, top: 8, bottom: 8 }}
                node={renderNode}
                link={renderLink}
              >
                <Tooltip
                  content={({ payload }) => {
                    const entry = payload?.[0];
                    if (!entry) return null;

                    const linkPayload = entry.payload as SankeyLinkPayload & SankeyNodePayload;
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
                        <div className="text-muted-foreground">
                          {formatSummaryAmount(Number(value))}
                        </div>
                      </div>
                    );
                  }}
                />
              </Sankey>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-sm">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              From (Income)
            </div>
            {data.sources.map(source => (
              <div key={source.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: sankeyBase }}
                  />
                  <span className="text-foreground">{source.name}</span>
                </div>
                <span className="text-muted-foreground">{formatSummaryAmount(source.amount)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              To (Expenses)
            </div>
            {targetsWithFreeCash.map(target => (
              <div key={target.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: target.isFreeCash ? freeCashColor : sankeyBase }}
                  />
                  <span className="text-foreground">{target.name}</span>
                </div>
                <span className="text-muted-foreground">{formatSummaryAmount(target.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ChartWrapper>
  );
}
