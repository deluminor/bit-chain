import axiosInstance from '@/lib/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type LoanType = 'LOAN' | 'DEBT';

export interface Loan {
  id: string;
  name: string;
  type: LoanType;
  totalAmount: number;
  paidAmount: number;
  currency: string;
  startDate: string | null;
  dueDate: string | null;
  interestRate: number | null;
  lender: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoansSummary {
  total: number;
  active: number;
  loanCount: number;
  debtCount: number;
  totalOutstandingBase: number;
}

export interface LoansResponse {
  loans: Loan[];
  summary: LoansSummary;
}

export interface CreateLoanData {
  name: string;
  type: LoanType;
  totalAmount: number;
  paidAmount?: number;
  currency?: string;
  startDate?: string;
  dueDate?: string;
  interestRate?: number;
  lender?: string;
  notes?: string;
}

export interface UpdateLoanData extends Partial<CreateLoanData> {
  id: string;
}

const loanKeys = {
  all: ['finance', 'loans'] as const,
  list: (filters: { includeInactive: boolean }) => [...loanKeys.all, filters] as const,
};

export function useLoans(includeInactive = false) {
  return useQuery({
    queryKey: loanKeys.list({ includeInactive }),
    queryFn: async (): Promise<LoansResponse> => {
      const { data } = await axiosInstance.get('/finance/loans', {
        params: { includeInactive },
      });
      return data;
    },
  });
}

export function useCreateLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateLoanData) => {
      const { data } = await axiosInstance.post('/finance/loans', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loanKeys.all });
    },
  });
}

export function useUpdateLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateLoanData) => {
      const { data } = await axiosInstance.put('/finance/loans', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loanKeys.all });
    },
  });
}

export function useDeleteLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axiosInstance.delete('/finance/loans', { params: { id } });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loanKeys.all });
    },
  });
}
