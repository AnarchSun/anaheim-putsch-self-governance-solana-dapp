// FILE: src/components/app-layout.tsx
'use client';

import { ThemeProvider } from './theme-provider';
import { Toaster } from './ui/sonner';
import { AppHeader } from '@/components/app-header';
import React from 'react';
import { AppFooter } from '@/components/app-footer';

export function AppLayout({
                              children,
                              links,
                          }: {
    children: React.ReactNode;
    links: { label: string; path: string }[];
}) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="flex flex-col min-h-screen">
                <AppHeader links={links} />
                {/*
          This 'container' class sets a max-width, and 'mx-auto' centers it.
          This is the main container for the content area of every page.
        */}
                <main className="flex-grow container mx-auto p-4">
                    {/*
            All page content {children} is rendered inside our custom-styled box.
          */}
                    <div className="content-box">
                        {children}
                    </div>
                </main>
                <AppFooter />
            </div>
            <Toaster />
        </ThemeProvider>
    );
}