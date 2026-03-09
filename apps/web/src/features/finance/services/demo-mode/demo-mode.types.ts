export type DemoModeAction = 'add' | 'remove';

export interface DemoFinanceResult {
  accounts: number;
  categories: number;
  transactions: number;
  budgets: number;
  goals: number;
}

export interface DemoModeResult {
  message: string;
  details?: {
    trades: number;
    finance: DemoFinanceResult;
  };
}

export class DemoModeServiceError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'DemoModeServiceError';
    this.status = status;
  }
}
