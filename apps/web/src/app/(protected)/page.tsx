'use client';

import { AnimatedDiv } from '@/components/ui/animations';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedHomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <AnimatedDiv variant="fadeIn" className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
    </AnimatedDiv>
  );
}
