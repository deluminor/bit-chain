'use client';

import { Button } from '@/components/ui/button';
import { Plus, Wallet } from 'lucide-react';

interface AccountListHeaderProps {
  onCreateAccount: () => void;
}

export function AccountListHeader({ onCreateAccount }: AccountListHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="p-2 sm:p-3 rounded-xl bg-primary shadow-sm">
          <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Accounts</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your financial accounts
          </p>
        </div>
      </div>

      <Button onClick={onCreateAccount} className="w-full sm:w-auto">
        <Plus className="h-4 w-4 mr-2" />
        Add Account
      </Button>
    </div>
  );
}
