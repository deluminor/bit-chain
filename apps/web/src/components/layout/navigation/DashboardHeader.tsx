'use client';

import { GlobalDateFilter } from '@/components/dashboard/GlobalDateFilter';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function DashboardHeader() {
  const pathname = usePathname().replace('/', '');
  const pageTitle = pathname.charAt(0).toUpperCase() + pathname.slice(1);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b rounded-tl-md rounded-tr-md transition-all duration-300 ease-in-out ${
        scrolled ? 'bg-background/55 backdrop-blur-sm shadow-sm' : ''
      }`}
    >
      <div className="flex w-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
          <h1 className="text-base font-medium">{pageTitle}</h1>
        </div>
        <div className="flex items-center gap-2">
          <GlobalDateFilter />
          <ThemeToggle className="h-9 w-9" />
        </div>
      </div>
    </header>
  );
}
