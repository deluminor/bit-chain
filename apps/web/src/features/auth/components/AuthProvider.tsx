'use client';

import { AUTH_ROUTES, ROUTES } from '@/features/auth/constants';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = AUTH_ROUTES.some(route => pathname.startsWith(route.path));

  useEffect(() => {
    if (status === 'loading') return;

    if (!session && !isAuthPage) {
      router.push(ROUTES.LOGIN.path);
    } else if (session && isAuthPage) {
      router.push(ROUTES.DASHBOARD.path);
    }
  }, [session, status, isAuthPage, router]);

  if (status === 'loading') return null;

  return <>{children}</>;
}
