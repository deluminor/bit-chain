interface ApiErrorResponse {
  error?: string;
}

export interface AccountSummary {
  total: number;
  active: number;
  inactive: number;
  totalBalance: number;
}

export const DEFAULT_ACCOUNT_SUMMARY: AccountSummary = {
  total: 0,
  active: 0,
  inactive: 0,
  totalBalance: 0,
};

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && 'response' in error) {
    const response = error.response;
    if (typeof response === 'object' && response !== null && 'data' in response) {
      const data = response.data;
      if (typeof data === 'object' && data !== null && 'error' in data) {
        return String((data as ApiErrorResponse).error ?? fallback);
      }
    }
  }

  return fallback;
}
