// FILE: src/components/app-layout.tsx
'use client';

import React, { ReactNode } from 'react';
import { AppHeader } from './app-header';
import { AppFooter } from './app-footer';

interface AppLayoutProps {
    children: ReactNode;
    links: { label: string; path: string }[];
}

export function AppLayout({ children, links }: AppLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col">
            {/* FIX: The call to AppHeader is now simple and correct.
          No more WalletButton={undefined} or WalletUiDropdown={undefined}. */}
            <AppHeader links={links} />

            <main className="flex-grow">
                {children}
            </main>

            <AppFooter />
        </div>
    );
}