// FILE: src/app/layout.tsx
'use client';

import React, { ReactNode, useMemo } from 'react';
import './globals.css';

// 1. Solana Wallet Adapter Imports
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';

// 2. Your Application's Components & Libraries
import { AppLayout } from '@/components/app-layout';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

require('@solana/wallet-adapter-react-ui/styles.css');

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: ReactNode }) {
    const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST || 'https://api.devnet.solana.com';
    const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], []);

    const links = [
        { label: 'Home', path: '/' },
        { label: 'Account', path: '/account' },
        { label: 'Mining', path: '/mining' },
        { label: 'Stake', path: '/stake' },
        { label: 'Posts', path: '/posts' },
        { label: 'Gemini-Helper', path: '/dev-helper' },
    ];

    return (
        <html lang="en" suppressHydrationWarning>
        <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect>
                    <WalletModalProvider>
                        <QueryClientProvider client={queryClient}>
                            <AppLayout links={links}>{children}</AppLayout>
                            <ReactQueryDevtools initialIsOpen={false} />
                        </QueryClientProvider>
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}