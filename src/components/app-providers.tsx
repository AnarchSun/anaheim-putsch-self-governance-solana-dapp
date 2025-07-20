// FILE: src/components/app-providers.tsx
'use client';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { ReactNode, useMemo } from 'react';

// This line is essential for the wallet dropdown to be styled correctly.
require('@solana/wallet-adapter-react-ui/styles.css');

export function AppProviders({ children }: { children: ReactNode }) {
    const [queryClient] = React.useState(() => new QueryClient());
    const wallets = useMemo(() => [], []);
    const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST || 'https://api.devnet.solana.com';

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <QueryClientProvider client={queryClient}>
                        {children}
                        <ReactQueryDevtools initialIsOpen={false} />
                    </QueryClientProvider>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}