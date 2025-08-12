import { TransactionList } from '@/features/finance/components/TransactionList';
import { AnimatedDiv } from '@/components/ui/animations';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transactions | BitChain',
  description: 'Manage your income, expenses, and transfers',
};

export default function TransactionsPage() {
  return (
    <AnimatedDiv variant="slideUp" className="container mx-auto py-6">
      <TransactionList />
    </AnimatedDiv>
  );
}
