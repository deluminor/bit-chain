import { AnimatedDiv } from '@/components/ui/animations';
import { TransactionList } from '@/features/finance/components/TransactionList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transactions | BitChain',
  description: 'Manage your income, expenses, and transfers',
};

export default function TransactionsPage() {
  return (
    <AnimatedDiv variant="slideUp" className="space-y-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <TransactionList />
      </div>
    </AnimatedDiv>
  );
}
