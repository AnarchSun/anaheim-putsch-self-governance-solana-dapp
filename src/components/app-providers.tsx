// FILE: src/components/app-providers.tsx
'use client';

import React, { ReactNode, useMemo } from 'react';

// --- Imports for Solana Wallet Adapter ---
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// --- Imports for TanStack Query ---
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Require the wallet adapter's base styles.
require('@solana/wallet-adapter-react-ui/styles.css');

// Create a single instance of the QueryClient.
const queryClient = new QueryClient();

export function AppProviders({ children }: { children: ReactNode }) {
    const endpoint = clusterApiUrl('devnet');
    const wallets = useMemo(
        () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
        []
    );

    return (
        <QueryClientProvider client={queryClient}>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect>
                    <WalletModalProvider>{children}</WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </QueryClientProvider>
    );
}