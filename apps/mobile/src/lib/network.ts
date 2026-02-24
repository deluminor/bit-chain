/**
 * Network connectivity integration for TanStack Query.
 *
 * Hooks React Native's NetInfo into TanStack Query's `onlineManager`.
 * When connectivity is lost:
 *   - Active queries are paused (not cancelled)
 *   - Mutations are queued
 *   - Both resume automatically on reconnect
 *
 * Call `setupNetworkListener()` once at app startup (root layout mount).
 * The listener persists for the app's entire lifetime — no cleanup needed.
 *
 * @see https://tanstack.com/query/latest/docs/react/react-native
 */

import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';

/**
 * Registers a NetInfo event listener that synchronises connectivity state
 * with TanStack Query's `onlineManager`.
 *
 * `onlineManager.setEventListener` replaces any previously registered listener
 * and manages its own teardown internally, so no cleanup return is needed here.
 *
 * @example
 * ```tsx
 * useEffect(() => {
 *   setupNetworkListener();
 * }, []);
 * ```
 */
export function setupNetworkListener(): void {
  onlineManager.setEventListener((setOnline) => {
    return NetInfo.addEventListener((state) => {
      setOnline(!!state.isConnected && state.isInternetReachable !== false);
    });
  });
}
