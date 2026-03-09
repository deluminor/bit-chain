'use client';

import { ChartSkeleton } from '@/components/layout/charts/ChartSkeleton';
import { ChartWrapper } from '@/components/layout/charts/ChartWrapper';
import { useCashFlowSankey } from '@/features/finance/hooks/useCashFlowSankey';
import { formatSummaryAmount } from '@/lib/currency';
import { THEME, useStore } from '@/store';
import { useMemo, useState } from 'react';
import { ResponsiveContainer, Sankey, Tooltip } from 'recharts';
import {
  CashFlowSankeyBreakdown,
  CashFlowSankeyFooter,
  SankeyTooltipContent,
} from './cash-flow-sankey.parts';
import type { CashFlowTarget, SankeyLinkProps, SankeyNodeProps } from './cash-flow-sankey.types';
import { useCashFlowDateRange } from './use-cash-flow-date-range';

export function CashFlowSankeyChart() {
  const { theme, selectedDateRange } = useStore();
  const { dateFrom, dateTo } = useCashFlowDateRange(selectedDateRange);

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
        <CashFlowSankeyFooter income={totals.income} expenses={totals.expenses} net={totals.net} />
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
                  content={({ payload }) => <SankeyTooltipContent payload={payload as never} />}
                />
              </Sankey>
            </ResponsiveContainer>
          </div>
        </div>
        <CashFlowSankeyBreakdown
          sources={data.sources}
          targets={targetsWithFreeCash}
          sankeyBase={sankeyBase}
          freeCashColor={freeCashColor}
        />
      </div>
    </ChartWrapper>
  );
}
