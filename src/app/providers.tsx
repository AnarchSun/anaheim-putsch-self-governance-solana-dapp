// Path: src/app/providers.tsx
'use client';

import React, { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { SolflareWalletAdapter, UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { GILL_HOOK_KEY_CONFIG, GillConfig } from "gill-monorepo/packages/react/src";
require('@solana/wallet-adapter-react-ui/styles.css');

/**
 * Wrapper provider to utilize gill hooks
 */
export class GillProvider extends React.Component<{
    config: GillConfig;
    children: React.ReactNode;
    queryClient?: QueryClient;
}> {
    static defaultProps = { queryClient: new QueryClient() };

    render() {
        const {
            config,
            children,
            queryClient
        } = this.props;
        const safeQueryClient = queryClient ?? GillProvider.defaultProps.queryClient;
        safeQueryClient.setQueryData(GILL_HOOK_KEY_CONFIG, config);

        return <QueryClientProvider client={safeQueryClient}>{children}</QueryClientProvider>;
    }
}

// 🔥 fallback queryClient pour sécuriser tous les hooks Gill
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

// FIX: Ajout de urlOrMoniker requis par GillConfig
const gillConfig: GillConfig = {
    endpoint: clusterApiUrl(WalletAdapterNetwork.Devnet),
    commitment: 'confirmed' as const,
    urlOrMoniker: 'devnet', // Ajoute cette propriété, adapte selon ton besoin
} as any;

/**
 * SolanaProvider is exported for use in your app's layout or root component.
 * If it's flagged as unused, either import and use it in your top-level layout
 * or remove its export if not needed.
 */
export function SolanaProvider({ children }: { children: React.ReactNode }) {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(
        () => [new SolflareWalletAdapter(), new UnsafeBurnerWalletAdapter()],
        [network]
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
