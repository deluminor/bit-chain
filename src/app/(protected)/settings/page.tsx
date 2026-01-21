import { AnimatedDiv } from '@/components/ui/animations';
import { IntegrationsSettings } from '@/features/integrations/components/IntegrationsSettings';
import { Metadata } from 'next';
import { Settings } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Settings | BitChain',
  description: 'Manage integrations and platform preferences',
};

export default function SettingsPage() {
  return (
    <AnimatedDiv variant="slideUp" className="space-y-6">
      <div className="container px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-3 rounded-xl bg-primary shadow-sm">
            <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Configure integrations and data sync.
            </p>
          </div>
        </div>
        <IntegrationsSettings />
      </div>
    </AnimatedDiv>
  );
}
