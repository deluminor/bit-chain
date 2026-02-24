import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { STORAGE_KEYS } from './constants';

interface PrivacyState {
  /** When true, all monetary values are replaced with "••••" */
  isPrivate: boolean;
  /** Toggle privacy mode and persist to storage */
  toggle: () => Promise<void>;
  /** Load preference from storage on app start */
  hydrate: () => Promise<void>;
}

const PRIVACY_KEY = `${STORAGE_KEYS.QUERY_CACHE}_privacy`;

export const usePrivacyStore = create<PrivacyState>((set, get) => ({
  isPrivate: false,

  toggle: async () => {
    const next = !get().isPrivate;
    set({ isPrivate: next });
    try {
      await AsyncStorage.setItem(PRIVACY_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage errors — state is still updated in memory
    }
  },

  hydrate: async () => {
    try {
      const stored = await AsyncStorage.getItem(PRIVACY_KEY);
      if (stored !== null) {
        set({ isPrivate: JSON.parse(stored) as boolean });
      }
    } catch {
      // Ignore — default to false
    }
  },
}));
