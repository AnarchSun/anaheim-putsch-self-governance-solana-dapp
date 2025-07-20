// FILE: src/app/layout.tsx

import type { Metadata } from 'next';
import './globals.css'; // This is the most important line. It loads your stylesheet.
import { AppProviders } from '@/components/app-providers';
import { AppLayout } from '@/components/app-layout';
import React from 'react';
// import '@/lib/bigint-patch'; // Uncomment if you have this file for BigInt fixes.

export const metadata: Metadata = {
    title: 'Anaheim dApp',
    description: 'A decentralized governance platform on Solana',
};

// This is the full, correct list of links for your header.
const links: { label: string; path: string }[] = [
    { label: 'Home', path: '/' },
    { label: 'Account', path: '/account' },
    { label: 'Mining', path: '/mining' },
    { label: 'Stake', path: '/stake' },
    { label: 'Posts', path: '/posts' },
    { label: 'Gemini-Helper', path: '/dev-helper' },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
        <body className={`antialiased`}>
        {/*
          This is the correct hierarchy:
          1. Providers wrap everything to give context (like wallet status).
          2. The Layout lives inside to create the visual structure.
          3. The page {children} are passed into the layout.
        */}
        <AppProviders>
            <AppLayout links={links}>{children}</AppLayout>
        </AppProviders>
        </body>
        </html>
    );
}