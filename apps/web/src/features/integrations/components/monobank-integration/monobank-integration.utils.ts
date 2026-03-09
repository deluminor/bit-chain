import type { MonobankIntegrationAccount } from '@/features/integrations/queries/monobank';

export const formatSyncTime = (value?: string | null) => {
  if (!value) {
    return 'Not synced yet';
  }

  const date = new Date(value);
  return date.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

export const buildAccountMeta = (account: MonobankIntegrationAccount) => {
  const details: string[] = [];
  if (account.maskedPan) {
    details.push(account.maskedPan);
  }
  if (account.iban) {
    const ibanTail = account.iban.slice(-6);
    details.push(`IBAN ****${ibanTail}`);
  }
  if (account.ownerType === 'FOP' && account.ownerName) {
    details.push(`FOP ${account.ownerName}`);
  }
  return details.join(' | ');
};
