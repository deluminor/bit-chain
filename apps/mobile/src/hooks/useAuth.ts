import type { ApiResponse, LoginRequest, TokenResponse } from '@bit-chain/api-contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import api from '~/src/lib/api';
import type { AuthUser } from '~/src/lib/auth';
import { useAuthStore } from '~/src/lib/auth';
import { API_BASE_URL } from '~/src/lib/constants';

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

export function useLogout() {
  const clearAuth = useAuthStore(s => s.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Intentionally ignore server errors — always clear local state on logout
      await api.post('/auth/logout', { all: false }).catch(() => {});
    },
    onSuccess: async () => {
      await clearAuth();
      queryClient.clear();
    },
  });
}
