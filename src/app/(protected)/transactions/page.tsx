import { AnimatedDiv } from '@/components/ui/animations';
import { TransactionList } from '@/features/finance/components/TransactionList';
import { Metadata } from 'next';
import { DollarSign } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Transactions | BitChain',
  description: 'Manage your income, expenses, and transfers',
};

export default function TransactionsPage() {
  return (
    <AnimatedDiv variant="slideUp" className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-primary shadow-sm">
            <DollarSign className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Transactions</h1>
            <p className="text-muted-foreground">Manage your income, expenses, and transfers</p>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-6">
        <TransactionList />
      </div>
    </AnimatedDiv>
  );
}
