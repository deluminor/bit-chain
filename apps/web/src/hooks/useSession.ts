import { useSession } from 'next-auth/react';

export const useSessionManagament = () => {
  const { data: session } = useSession();
  const { user } = session || {};
  const { id: userId = '' } = user || {};

  return { isAuthenticated: !!userId, userId };
};
