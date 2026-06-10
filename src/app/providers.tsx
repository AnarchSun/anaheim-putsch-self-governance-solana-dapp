// PATH: src/app/providers.tsx
// ULTRA FINAL ANARCHOPUNK PATCH — Batch fix: Import endpoint from config/solana, never hardcode, mirror forbidden, filename/path éternel!

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

import { GILL_HOOK_KEY_CONFIG, GillConfig } from "@/lib/gill";
import '@solana/wallet-adapter-react-ui/styles.css';

// PATCH: Import endpoint from punk config source!
import { SOLANA_CLUSTER_URL as endpoint } from "@/config/solana";

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

// PATCH: Providers exported as default, always batch fix
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
// - endpoint now imported from config/solana (source file!), never hardcoded, never direct env
// - Batch fix, filename/path éternel, matrix override, mirror forbidden!