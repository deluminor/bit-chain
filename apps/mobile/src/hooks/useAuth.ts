import type { ApiResponse, LoginRequest, TokenResponse } from '@bit-chain/api-contracts';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import api from '~/src/lib/api';
import type { AuthUser } from '~/src/lib/auth';
import { useAuthStore } from '~/src/lib/auth';
import { API_BASE_URL } from '~/src/lib/constants';
import { queryClient } from '~/src/lib/query';

/**
 * Hook to fetch the current user's profile from the backend.
 * Falls back to the store user if the request is still loading or fails.
 */
export function useUser() {
  const storeUser = useAuthStore(s => s.user);

  const query = useQuery({
    queryKey: ['auth', 'me'] as const,
    queryFn: async (): Promise<AuthUser> => {
      const { data } = await api.get<ApiResponse<AuthUser>>('/auth/me');
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: false,
  });

  return {
    ...query,
    user: query.data ?? storeUser,
  };
}

/**
 * Login mutation. On success, persists tokens to SecureStore and sets auth state.
 *
 * @example
 * ```tsx
 * const { mutate: login, isPending } = useLogin();
 * login({ email, password });
 * ```
 */
export function useLogin() {
  const setAuth = useAuthStore(s => s.setAuth);

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const { data } = await axios.post<ApiResponse<TokenResponse>>(
        `${API_BASE_URL}/api/mobile/auth/login`,
        credentials,
      );
      if (!data.ok) throw new Error(data.error.code);
      return data.data;
    },
    onSuccess: async data => {
      await setAuth(data.user, data.accessToken, data.refreshToken);
    },
  });
}

/**
 * Logout mutation. Revokes session on server and clears local auth state.
 */
export function useLogout() {
  const clearAuth = useAuthStore(s => s.clearAuth);

  return useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout', { all: false }).catch(() => {
        // Ignore server errors — always clear local state
      });
    },
    onSuccess: async () => {
      await clearAuth();
      queryClient.clear();
    },
  });
}
