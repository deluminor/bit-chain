'use client';

import { useMonobankIntegration, useMonobankSync } from '@/features/integrations/queries/monobank';
import { useEffect, useRef } from 'react';

const SYNC_INTERVAL_MS = 5 * 60 * 1000;

export function useMonobankAutoSync(reason: string) {
  const { data } = useMonobankIntegration();
  const syncMutation = useMonobankSync();
  const lastSyncRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!data?.hasEnabledAccounts) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const triggerSync = () => {
      const now = Date.now();

      if (syncMutation.isPending) {
        return;
      }

      if (lastSyncRef.current && now - lastSyncRef.current < SYNC_INTERVAL_MS) {
        return;
      }

      lastSyncRef.current = now;
      syncMutation.mutate({ reason });
    };

    triggerSync();

    if (!intervalRef.current) {
      intervalRef.current = setInterval(triggerSync, SYNC_INTERVAL_MS);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [data?.hasEnabledAccounts, reason, syncMutation.isPending]);
}
