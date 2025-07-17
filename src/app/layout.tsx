// FILE: src/app/layout.tsx

import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/components/app-providers';
import { AppLayout } from '@/components/app-layout';
import React from 'react';

export const metadata: Metadata = {
    title: 'Anaheim dApp | Dark Theme',
    description: 'A decentralized governance platform on Solana',
};

const links: { label: string; path: string }[] = [
    { label: 'Home', path: '/' },
    { label: 'Account', path: '/account' },
    { label: 'Mining', path: '/mining' },
    { label: 'Stake', path: '/stake' },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        /*
         * ===================================================================
         *  THE ONLY CHANGE NEEDED: className="dark"
         *  This one line forces the entire application to use your dark theme
         *  by default, fixing all "white on white" issues.
         * ===================================================================
         */
        <html lang="en" className="dark" suppressHydrationWarning>
        <body>
        <AppProviders>
            <AppLayout links={links}>
                {children}
            </AppLayout>
        </AppProviders>
        </body>
        </html>
    );
}