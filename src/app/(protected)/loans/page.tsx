'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { AnimatedDiv } from '@/components/ui/animations';
import { useToast } from '@/hooks/use-toast';
import { LoanForm } from '@/components/forms/LoanForm';
import { formatDisplayAmount, BASE_CURRENCY } from '@/lib/currency';
import { Loan, useLoans, useDeleteLoan, useUpdateLoan } from '@/features/finance/queries/loans';
import {
  Plus,
  Landmark,
  Wallet,
  CalendarClock,
  BadgeDollarSign,
  Trash2,
  Pencil,
  Archive,
  RotateCcw,
} from 'lucide-react';

const loanTypeLabels = {
  LOAN: 'Loan',
  DEBT: 'Debt',
};

const loanTypeBadge = {
  LOAN: 'bg-rose-100 text-rose-700',
  DEBT: 'bg-emerald-100 text-emerald-700',
};

export default function LoansPage() {
  const { toast } = useToast();
  const [showArchived, setShowArchived] = useState(false);
  const { data, isLoading, error, refetch } = useLoans(showArchived);
  const deleteLoan = useDeleteLoan();
  const updateLoan = useUpdateLoan();

  const [showForm, setShowForm] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Loan | null>(null);

  if (error) {
    toast({
      title: 'Error',
      description: 'Failed to load loans',
      variant: 'destructive',
    });
  }

  const loans = data?.loans || [];
  const summary = data?.summary || {
    total: 0,
    active: 0,
    loanCount: 0,
    debtCount: 0,
    totalOutstandingBase: 0,
  };

  const handleFormSuccess = () => {
    refetch();
    setEditingLoan(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingLoan(null);
  };

  const getStatus = (loan: Loan) => {
    if (!loan.isActive || loan.currentBalance <= 0) {
      return { label: 'Paid', className: 'bg-emerald-100 text-emerald-700' };
    }

    if (loan.dueDate) {
      const due = new Date(loan.dueDate);
      if (due.getTime() < Date.now()) {
        return { label: 'Overdue', className: 'bg-rose-100 text-rose-700' };
      }
    }

    return { label: 'Active', className: 'bg-blue-100 text-blue-700' };
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;

    try {
      await deleteLoan.mutateAsync(pendingDelete.id);
      toast({
        title: 'Success',
        description: 'Loan deleted successfully',
      });
      setPendingDelete(null);
      refetch();
    } catch (deleteError: any) {
      toast({
        title: 'Error',
        description: deleteError?.message || 'Failed to delete loan',
        variant: 'destructive',
      });
    }
  };

  const handleArchive = async (loan: Loan, nextState: boolean) => {
    try {
      await updateLoan.mutateAsync({
        id: loan.id,
        isActive: nextState,
      });

      toast({
        title: 'Success',
        description: nextState ? 'Loan restored successfully' : 'Loan archived successfully',
      });
      refetch();
    } catch (archiveError: any) {
      toast({
        title: 'Error',
        description: archiveError?.message || 'Failed to update loan status',
        variant: 'destructive',
      });
    }
  };

  const nearestDueDate = loans
    .filter(loan => loan.isActive && loan.dueDate)
    .map(loan => new Date(loan.dueDate as string))
    .sort((a, b) => a.getTime() - b.getTime())[0];

  return (
    <AnimatedDiv variant="slideUp" className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4 md:gap-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary shadow-sm">
              <Landmark className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Loans & Debts</h1>
              <p className="text-muted-foreground">Track what you owe and what is owed to you</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 px-3 py-2 border rounded-lg">
              <Switch checked={showArchived} onCheckedChange={setShowArchived} />
              <span className="text-sm text-muted-foreground">Show archived</span>
            </div>
            <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              New Loan
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 md:p-6">
            <div className="flex items-center gap-3 mb-3">
              <BadgeDollarSign className="h-5 w-5 text-rose-500" />
              <h3 className="font-semibold">Outstanding</h3>
            </div>
            <div className="text-2xl font-bold">
              {formatDisplayAmount(summary.totalOutstandingBase, BASE_CURRENCY, 'summary')}
            </div>
            <p className="text-sm text-muted-foreground">Base currency total</p>
          </Card>
          <Card className="p-4 md:p-6">
            <div className="flex items-center gap-3 mb-3">
              <Wallet className="h-5 w-5 text-emerald-500" />
              <h3 className="font-semibold">Active</h3>
            </div>
            <div className="text-2xl font-bold">{summary.active}</div>
            <p className="text-sm text-muted-foreground">Open loans</p>
          </Card>
          <Card className="p-4 md:p-6">
            <div className="flex items-center gap-3 mb-3">
              <Landmark className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold">Loans vs Debts</h3>
            </div>
            <div className="text-2xl font-bold">
              {summary.loanCount} / {summary.debtCount}
            </div>
            <p className="text-sm text-muted-foreground">Loans / Debts</p>
          </Card>
          <Card className="p-4 md:p-6">
            <div className="flex items-center gap-3 mb-3">
              <CalendarClock className="h-5 w-5 text-orange-500" />
              <h3 className="font-semibold">Next Due</h3>
            </div>
            <div className="text-2xl font-bold">
              {nearestDueDate ? nearestDueDate.toLocaleDateString('en-GB') : '—'}
            </div>
            <p className="text-sm text-muted-foreground">Closest deadline</p>
          </Card>
        </div>
      </div>

      <div className="px-4 lg:px-6">
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
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead className="text-center">Due Date</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="w-[120px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loans.map(loan => {
                      const status = getStatus(loan);
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
                                {formatDisplayAmount(
                                  loan.currentBalance,
                                  loan.currency,
                                  'detailed',
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                of{' '}
                                {formatDisplayAmount(
                                  loan.originalAmount,
                                  loan.currency,
                                  'detailed',
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {loan.dueDate
                              ? new Date(loan.dueDate).toLocaleDateString('en-GB')
                              : '—'}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={status.className}>{status.label}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingLoan(loan);
                                  setShowForm(true);
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              {loan.isActive ? (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleArchive(loan, false)}
                                  className="h-8 w-8 p-0 text-muted-foreground"
                                >
                                  <Archive className="h-4 w-4" />
                                </Button>
                              ) : loan.currentBalance > 0 ? (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleArchive(loan, true)}
                                  className="h-8 w-8 p-0 text-muted-foreground"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </Button>
                              ) : null}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setPendingDelete(loan)}
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
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Loan
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingLoan ? 'Edit Loan' : 'Create New Loan'}</DialogTitle>
          </DialogHeader>
          <LoanForm
            onClose={handleCloseForm}
            onSuccess={handleFormSuccess}
            loan={editingLoan || undefined}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!pendingDelete} onOpenChange={() => setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Loan</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete {pendingDelete?.name}? This will hide the loan category
            but keep existing transactions.
          </p>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteLoan.isPending}>
              {deleteLoan.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AnimatedDiv>
  );
}
