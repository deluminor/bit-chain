import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { STORAGE_KEYS } from './constants';

interface PrivacyState {
  isPrivate: boolean;
  toggle: () => Promise<void>;
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
    } catch (err) {
      if (__DEV__) {
        console.warn('[Privacy] Failed to persist toggle:', err);
      }
    }
  },

  hydrate: async () => {
    try {
      const stored = await AsyncStorage.getItem(PRIVACY_KEY);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (typeof parsed === 'boolean') {
          set({ isPrivate: parsed });
        }
      }
    } catch {
      // Corrupt or invalid JSON — default to false
      if (__DEV__) {
        console.warn('[Privacy] Failed to parse stored preference, defaulting to false');
      }
    }
  },
}));
