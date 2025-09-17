"use client"

import AppHeader from '@/components/layout/header';
import AppSidebar from '@/components/layout/sidebar';
import { useSearchParams } from 'next/navigation';
import { Suspense, type ReactNode } from 'react';

function MainLayoutInner({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">

      {!isEmbed && <AppSidebar />}
      <div className={`flex flex-col sm:gap-4 sm:py-4 ${!isEmbed ? 'sm:pl-14' : 'sm:pl-5'}`}>
        {/* <AppHeader /> */}
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <MainLayoutInner>{children}</MainLayoutInner>
    </Suspense>
  );
}
