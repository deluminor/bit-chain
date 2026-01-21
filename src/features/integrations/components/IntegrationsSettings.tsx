'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MonobankIntegrationCard } from '@/features/integrations/components/MonobankIntegrationCard';
import { Sparkles } from 'lucide-react';

export function IntegrationsSettings() {
  return (
    <div className="space-y-6">
      <MonobankIntegrationCard />
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-muted-foreground" />
            More Integrations
          </CardTitle>
          <CardDescription>
            Crypto exchanges and additional banks will be available here soon.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
