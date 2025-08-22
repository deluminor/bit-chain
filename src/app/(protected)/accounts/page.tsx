import { AccountList } from '@/features/finance/components/AccountList';
import { AnimatedDiv } from '@/components/ui/animations';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Financial Accounts | BitChain',
  description: 'Manage your financial accounts and balances',
};

export default function AccountsPage() {
  return (
    <AnimatedDiv variant="slideUp" className="space-y-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AccountList />
      </div>
    </AnimatedDiv>
  );
}
