// FILE: src/components/app-providers.tsx
'use client';

import React, { ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from './theme-provider';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

// This is the standard wallet adapter CSS.
require('@solana/wallet-adapter-react-ui/styles.css');

export function AppProviders({ children }: { children: ReactNode }) {
    const [queryClient] = React.useState(() => new QueryClient());
    const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST || 'https://api.devnet.solana.com';
    const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect>
                    <WalletModalProvider>
                        <QueryClientProvider client={queryClient}>
                            {/* This is the key: it ONLY renders the children passed to it. */}
                            {children}
                            <ReactQueryDevtools initialIsOpen={false} />
                        </QueryClientProvider>
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </ThemeProvider>
    );
}