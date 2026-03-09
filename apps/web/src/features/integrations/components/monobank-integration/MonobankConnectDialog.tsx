import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface MonobankConnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token: string;
  onTokenChange: (token: string) => void;
  onConnect: () => void;
  isConnecting: boolean;
}

export function MonobankConnectDialog({
  open,
  onOpenChange,
  token,
  onTokenChange,
  onConnect,
  isConnecting,
}: MonobankConnectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Monobank</DialogTitle>
          <DialogDescription>
            Enter your Monobank Activation Token. You can get it from{' '}
            <a
              href="https://api.monobank.ua/"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-primary"
            >
              api.monobank.ua
            </a>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Input
              placeholder="uX..."
              value={token}
              onChange={event => onTokenChange(event.target.value)}
              autoComplete="off"
              type="password"
            />
            <p className="text-xs text-muted-foreground">
              The token is encrypted and stored securely.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConnect} disabled={!token || isConnecting}>
            {isConnecting ? 'Connecting...' : 'Connect'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
