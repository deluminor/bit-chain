'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  getLoanStatus,
  loanTypeBadge,
  loanTypeLabels,
} from '@/features/finance/components/loans-page/loans-page.utils';
import { Loan } from '@/features/finance/queries/loans';
import { formatDisplayAmount } from '@/lib/currency';
import { Banknote, Landmark, Pencil, Plus, Trash2 } from 'lucide-react';

interface LoansTableProps {
  isLoading: boolean;
  loans: Loan[];
  onRepayLoan: (loan: Loan) => void;
  onEditLoan: (loan: Loan) => void;
  onDeleteLoan: (loan: Loan) => void;
  onCreateLoan: () => void;
}

export function LoansTable({
  isLoading,
  loans,
  onRepayLoan,
  onEditLoan,
  onDeleteLoan,
  onCreateLoan,
}: LoansTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading loans...</div>
        ) : loans.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loan</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Remaining / Total</TableHead>
                  <TableHead className="text-center">Progress</TableHead>
                  <TableHead className="text-center">Due Date</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="w-[140px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans.map(loan => {
                  const status = getLoanStatus(loan);
                  const remaining = loan.totalAmount - loan.paidAmount;
                  const progress =
                    loan.totalAmount > 0 ? (loan.paidAmount / loan.totalAmount) * 100 : 0;

                  return (
                    <TableRow key={loan.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{loan.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {loan.lender || 'No lender'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={loanTypeBadge[loan.type]}>
                          {loanTypeLabels[loan.type]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="space-y-1">
                          <div className="font-semibold">
                            {formatDisplayAmount(remaining, loan.currency, 'detailed')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            of {formatDisplayAmount(loan.totalAmount, loan.currency, 'detailed')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                          <div className="text-xs text-center text-muted-foreground">
                            {progress.toFixed(1)}%
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString('en-GB') : '—'}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={status.className}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {remaining > 0 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onRepayLoan(loan)}
                              className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              title="Repay Loan"
                            >
                              <Banknote className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onEditLoan(loan)}
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDeleteLoan(loan)}
                            className="h-8 w-8 p-0 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <Landmark className="h-12 w-12 mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">No loans yet</p>
            <p className="mb-4">Create your first loan or debt to start tracking.</p>
            <Button onClick={onCreateLoan}>
              <Plus className="h-4 w-4 mr-2" />
              Create Loan
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
