import {
  accountTypes,
  type AccountFormData,
  type AccountType,
} from '@/components/forms/account-form.config';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SUPPORTED_CURRENCIES } from '@/lib/currency';
import type { UseFormReturn } from 'react-hook-form';

interface AccountBasicSectionProps {
  form: UseFormReturn<AccountFormData>;
  watchedBalance: number;
  watchedCurrency: string;
}

export function AccountBasicSection({
  form,
  watchedBalance,
  watchedCurrency,
}: AccountBasicSectionProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Account Name</Label>
        <Input id="name" placeholder="e.g. Main Checking Account" {...form.register('name')} />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="space-y-3">
        <Label>Account Type</Label>
        <Select
          value={form.watch('type')}
          onValueChange={value => form.setValue('type', value as AccountType)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {accountTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center gap-2">
                  <type.icon className="h-4 w-4" />
                  <div>
                    <div>{type.label}</div>
                    <div className="text-xs text-muted-foreground">{type.description}</div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.type && (
          <p className="text-sm text-destructive">{form.formState.errors.type.message}</p>
        )}
      </div>

      <div className="space-y-3">
        <Label>Currency</Label>
        <Select
          value={form.watch('currency')}
          onValueChange={value => form.setValue('currency', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(SUPPORTED_CURRENCIES).map(currency => (
              <SelectItem key={currency.code} value={currency.code}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{currency.symbol}</span>
                  <div>
                    <div>
                      {currency.code} - {currency.name}
                    </div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.currency && (
          <p className="text-sm text-destructive">{form.formState.errors.currency.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="balance">Initial Balance</Label>
        <CurrencyInput
          placeholder="0.00"
          value={watchedBalance}
          currency={watchedCurrency}
          showCurrencySelect={false}
          allowNegative={true}
          allowZero={true}
          onAmountChange={(value: number) => {
            form.setValue('balance', value);
          }}
          className="w-full"
        />
        {form.formState.errors.balance && (
          <p className="text-sm text-destructive">{form.formState.errors.balance.message}</p>
        )}
      </div>
    </>
  );
}
