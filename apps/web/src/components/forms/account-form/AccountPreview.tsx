import { accountTypes, type AccountType } from '@/components/forms/account-form.config';
import { Badge } from '@/components/ui/badge';
import { SUPPORTED_CURRENCIES } from '@/lib/currency';

interface AccountPreviewProps {
  name: string;
  type: AccountType;
  currency: string;
  balance: number;
  selectedColor: string;
}

export function AccountPreview({
  name,
  type,
  currency,
  balance,
  selectedColor,
}: AccountPreviewProps) {
  const selectedAccountType = accountTypes.find(accountType => accountType.value === type);

  if (!name && !selectedAccountType) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Preview</p>
      <div className="p-4 border rounded-lg bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: selectedColor }}
            >
              {selectedAccountType && <selectedAccountType.icon className="h-5 w-5" />}
            </div>
            <div>
              <div className="font-medium">{name || 'Account Name'}</div>
              <div className="text-sm text-muted-foreground">
                {selectedAccountType?.label} • {currency}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold">
              {SUPPORTED_CURRENCIES[currency]?.symbol || '€'}
              {(balance ?? 0).toFixed(2)}
            </div>
            <Badge variant="secondary" className="text-xs">
              {selectedAccountType?.label}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
