import { SANKEY_LIGHT_MONO } from '@/constants/cash-flow-sankey-colors';
import type { CashFlowSankeyData } from '@/features/finance/hooks/useCashFlowSankey';
import type { CashFlowTarget } from './cash-flow-sankey.types';

type SankeyGraph = {
  nodes: Array<{
    name: string;
    color: string;
    isFreeCash?: boolean;
  }>;
  links: Array<{
    source: number;
    target: number;
    value: number;
    color: string;
    id: string;
    sourceName: string;
    targetName: string;
  }>;
};

export function buildCashFlowSankeyModel(
  data: CashFlowSankeyData | null | undefined,
  targetsWithFreeCash: CashFlowTarget[],
  isDark: boolean,
  sankeyBase: string,
  freeCashColor: string,
): {
  sankeyData: SankeyGraph | null;
  breakdownSources: CashFlowSankeyData['sources'];
  breakdownTargets: CashFlowTarget[];
} {
  if (!data) {
    return { sankeyData: null, breakdownSources: [], breakdownTargets: [] };
  }

  const flow = isDark ? sankeyBase : SANKEY_LIGHT_MONO.flow;
  const center = isDark ? sankeyBase : SANKEY_LIGHT_MONO.center;
  const free = isDark ? freeCashColor : SANKEY_LIGHT_MONO.freeCash;

  const sources = data.sources;
  const centerIndex = sources.length;

  const nodes: SankeyGraph['nodes'] = [
    ...sources.map(source => ({
      name: source.name,
      color: flow,
    })),
    {
      name: 'Net Flow',
      color: center,
    },
    ...targetsWithFreeCash.map(target => ({
      name: target.name,
      color: target.isFreeCash ? free : flow,
      isFreeCash: target.isFreeCash,
    })),
  ];

  const links: SankeyGraph['links'] = [
    ...sources.map((source, index) => ({
      source: index,
      target: centerIndex,
      value: Math.max(source.amount, 0),
      color: flow,
      id: `income-${source.id}`,
      sourceName: source.name,
      targetName: 'Net Flow',
    })),
    ...targetsWithFreeCash.map((target, index) => ({
      source: centerIndex,
      target: centerIndex + 1 + index,
      value: Math.max(target.amount, 0),
      color: target.isFreeCash ? free : flow,
      id: `expense-${target.id}`,
      sourceName: 'Net Flow',
      targetName: target.name,
    })),
  ];

  return {
    sankeyData: { nodes, links },
    breakdownSources: data.sources,
    breakdownTargets: targetsWithFreeCash,
  };
}
