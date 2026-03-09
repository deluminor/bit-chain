export type SankeyNodePayload = {
  name: string;
  color: string;
  isCenter?: boolean;
  depth?: number;
  value?: number;
  isFreeCash?: boolean;
};

export type CashFlowTarget = {
  id: string;
  name: string;
  amount: number;
  color: string;
  isFreeCash?: boolean;
};

export type SankeyNodeProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  payload: SankeyNodePayload;
};

export type SankeyLinkPayload = {
  color?: string;
  id?: string;
  sourceName?: string;
  targetName?: string;
};

export type SankeyLinkProps = {
  sourceX: number;
  targetX: number;
  sourceY: number;
  targetY: number;
  sourceControlX: number;
  targetControlX: number;
  linkWidth: number;
  payload: SankeyLinkPayload;
};
