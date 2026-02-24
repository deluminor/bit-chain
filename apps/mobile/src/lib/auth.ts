import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { SECURE_STORE_KEYS } from './constants';

export interface AuthUser {
  id: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;

  /** Set after successful login or token refresh */
  setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => Promise<void>;
  /** Load tokens from SecureStore on app start */
  hydrate: () => Promise<string | null>;
  /** Clear all auth state and SecureStore tokens */
  clearAuth: () => Promise<void>;
  /** Update access token after refresh (keeps user and refresh token) */
  updateAccessToken: (accessToken: string, refreshToken: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isLoading: true,

  setAuth: async (user, accessToken, refreshToken) => {
    await Promise.all([
      SecureStore.setItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN, accessToken),
      SecureStore.setItemAsync(SECURE_STORE_KEYS.REFRESH_TOKEN, refreshToken),
    ]);
    set({ user, accessToken, isLoading: false });
  },

  hydrate: async () => {
    try {
      const accessToken = await SecureStore.getItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN);
      if (accessToken) {
        set({ accessToken, isLoading: false });
      } else {
        set({ isLoading: false });
      }
      return accessToken;
    } catch {
      set({ isLoading: false });
      return null;
    }
  },

  clearAuth: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN),
      SecureStore.deleteItemAsync(SECURE_STORE_KEYS.REFRESH_TOKEN),
    ]);
    set({ user: null, accessToken: null, isLoading: false });
  },

  updateAccessToken: async (accessToken, refreshToken) => {
    await Promise.all([
      SecureStore.setItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN, accessToken),
      SecureStore.setItemAsync(SECURE_STORE_KEYS.REFRESH_TOKEN, refreshToken),
    ]);
    set({ accessToken });
  },
}));

/**
 * Retrieves the stored refresh token from SecureStore.
 * Used by the Axios refresh interceptor — not exposed in Zustand store.
 *
 * @returns Refresh token string or null if not found
 */
export async function getStoredRefreshToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(SECURE_STORE_KEYS.REFRESH_TOKEN);
  } catch {
    return null;
  }
}
