'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AnimatedDiv } from '@/components/ui/animations';

export default function ProtectedHomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard immediately
    router.replace('/dashboard');
  }, [router]);

  // Show loading spinner while redirecting
  return (
    <AnimatedDiv variant="fadeIn" className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
    </AnimatedDiv>
  );
}
