import { AccountList } from '@/features/finance/components/AccountList';
import { AnimatedDiv } from '@/components/ui/animations';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Financial Accounts | BitChain',
  description: 'Manage your financial accounts and balances',
};

export default function AccountsPage() {
  return (
    <AnimatedDiv variant="slideUp" className="container mx-auto py-6">
      <AccountList />
    </AnimatedDiv>
  );
}
