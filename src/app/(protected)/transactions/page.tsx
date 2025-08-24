import { AnimatedDiv } from '@/components/ui/animations';
import { TransactionList } from '@/features/finance/components/TransactionList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transactions | BitChain',
  description: 'Manage your income, expenses, and transfers',
};

export default function TransactionsPage() {
  return (
    <AnimatedDiv variant="slideUp" className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <TransactionList />
      </div>
    </AnimatedDiv>
  );
}
