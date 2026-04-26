'use client';

import { ChartSkeleton } from '@/components/layout/charts/ChartSkeleton';
import { ChartWrapper } from '@/components/layout/charts/ChartWrapper';
import { SANKEY_LIGHT_MONO } from '@/constants/cash-flow-sankey-colors';
import { useCashFlowSankey } from '@/features/finance/hooks/useCashFlowSankey';
import { formatSummaryAmount } from '@/lib/currency';
import { THEME, useStore } from '@/store';
import { useMemo, useState } from 'react';
import { ResponsiveContainer, Sankey, Tooltip } from 'recharts';
import { buildCashFlowSankeyModel } from './cash-flow-sankey.model';
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

  const { sankeyData, breakdownSources, breakdownTargets } = useMemo(
    () => buildCashFlowSankeyModel(data, targetsWithFreeCash, isDark, sankeyBase, freeCashColor),
    [data, freeCashColor, isDark, sankeyBase, targetsWithFreeCash],
  );

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (!data || (!data.sources.length && !data.targets.length)) {
    return (
      <ChartWrapper
        className="gap-0 py-5 sm:py-6"
        headerClassName="!px-5 pb-3 pt-0 sm:!px-6 sm:pb-4 sm:pt-1"
        contentClassName="!px-5 sm:!px-6"
        title="Income Flow"
        description="Category flow for selected period (EUR)"
      >
        <div className="flex h-[280px] items-center justify-center px-2 pb-6 text-sm text-muted-foreground">
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
    const opacity = isActive ? 1 : isDark ? 0.2 : 0.3;

    return (
      <g onMouseEnter={() => setActiveNode(payload.name)} onMouseLeave={() => setActiveNode(null)}>
        <rect
          x={x}
          y={y}
          width={Math.max(6, width)}
          height={height}
          rx={2}
          fill={payload.color}
          opacity={isActive ? (isDark ? 0.7 : 0.55) : isDark ? 0.2 : 0.32}
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
    const baseOpacity = isDark ? 0.4 : 0.6;
    const activeMatchOpacity = isDark ? 0.6 : 0.78;
    const dimOpacity = 0.08;
    const strokeOpacity =
      activeLink || activeNode ? (isActive ? activeMatchOpacity : dimOpacity) : baseOpacity;
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
      className="gap-0 py-5 sm:py-6 pt-0 sm:pt-2"
      // headerClassName="!px-5 pb-3 pt-0 sm:!px-6 sm:pb-0 sm:pt-1"
      // contentClassName="!px-5 !pb-0 pt-0 sm:!px-6"
      footerClassName="!px-5 !pb-0 pt-5 sm:!px-6 sm:!pb-0"
      title="Income Flow"
      description="Category flow for selected period (EUR)"
      footer={
        <CashFlowSankeyFooter income={totals.income} expenses={totals.expenses} net={totals.net} />
      }
    >
      <div className="pb-4 pt-1 sm:pb-5">
        <div className="w-full overflow-x-auto">
          <div className="h-[320px] min-w-[760px]">
            <ResponsiveContainer width="100%" height="100%">
              <Sankey
                data={sankeyData ?? { nodes: [], links: [] }}
                nodeWidth={10}
                nodePadding={16}
                margin={{ left: 100, right: 100, top: 18, bottom: 18 }}
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
          sources={breakdownSources}
          targets={breakdownTargets}
          sankeyBase={sankeyBase}
          freeCashColor={freeCashColor}
          lightMonochrome={
            isDark
              ? undefined
              : { flow: SANKEY_LIGHT_MONO.flow, freeCash: SANKEY_LIGHT_MONO.freeCash }
          }
        />
      </div>
    </ChartWrapper>
  );
}
