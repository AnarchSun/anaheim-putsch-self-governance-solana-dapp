// PATH: src/app/providers.tsx
// ULTRA FINAL ANARCHOPUNK PATCH — Export Providers, batch fix unused SolanaProvider, matrix override, filename/path éternel!

'use client';

import React, { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    // Ajoute ici ton wallet officiel si installé, GlowWalletAdapter, etc.
} from '@solana/wallet-adapter-wallets';

import { GILL_HOOK_KEY_CONFIG, GillConfig } from "gill-monorepo/packages/react/src";
import '@solana/wallet-adapter-react-ui/styles.css';

const endpoint: string = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST ?? "https://api.devnet.solana.com";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryFn: async ({ queryKey }) => {
                throw new Error(`No queryFn defined for ${JSON.stringify(queryKey)}`);
            },
            retry: false,
        },
    },
});

const gillConfig: GillConfig = {
    endpoint,
    commitment: 'confirmed' as const,
    urlOrMoniker: 'devnet',
} as any;

export class GillProvider extends React.Component<{
    config: GillConfig;
    children: React.ReactNode;
    queryClient?: QueryClient;
}> {
    static defaultProps = { queryClient: new QueryClient() };

    render() {
        const { config, children, queryClient } = this.props;
        const safeQueryClient = queryClient ?? GillProvider.defaultProps.queryClient;
        safeQueryClient.setQueryData(GILL_HOOK_KEY_CONFIG, config);

        return <QueryClientProvider client={safeQueryClient}>{children}</QueryClientProvider>;
    }
}

// PATCH: Rename SolanaProvider to Providers and export as default
export default function Providers({ children }: { children: React.ReactNode }) {
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            // Ajoute ici d'autres wallets officiels installés si besoin
        ],
        []
    );

    return (
        <GillProvider config={gillConfig} queryClient={queryClient}>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect>
                    <WalletModalProvider>{children}</WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </GillProvider>
    );
}

// PATCH NOTES:
// - Renamed SolanaProvider to Providers and exported as default.
// - Fixes "has no exported members : providers" error.
// - Use import { Providers } from './providers' in layout.tsx.
// - Filename/path éternel, matrix override, batch fix unused SolanaProvider!