// FILE: src/components/app-layout.tsx
'use client';

import React from 'react';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { Toaster } from '@/components/ui/sonner';

export function AppLayout({
                            children,
                            links,
                          }: {
  children: React.ReactNode;
  links: { label: string; path: string }[];
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader links={links} />
      <main className="flex-grow container mx-auto p-4">
        <div className="content-box">
          {children}
        </div>
      </main>
      <AppFooter />
      <Toaster />
    </div>
  );
}