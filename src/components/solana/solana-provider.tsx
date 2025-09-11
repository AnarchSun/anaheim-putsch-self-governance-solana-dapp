// PATH: src/components/solana/solana-provider.tsx
// ULTRA FINAL ANARCHOPUNK PATCH — Batch fix require() import, unnecessary useMemo deps, matrix override!

'use client';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { SolflareWalletAdapter, PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo, type ReactNode } from 'react';

// PATCH: Use ESM import for CSS, never require()
import '@solana/wallet-adapter-react-ui/styles.css';

// Voici le composant que votre application essaie d'importer !
export function SolanaProvider({ children }: { children: ReactNode }) {
    // Choisissez le réseau : devnet, testnet, ou mainnet-beta
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), []); // PATCH: no need for [network] dep, network is constant

    // Initialisez ici les portefeuilles que vous voulez supporter
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
        ],
        [] // PATCH: no need for [network] dep, network is constant
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

// PATCH NOTES:
// - No more require() import, replaced with ESM import (fixes @typescript-eslint/no-require-imports)
// - Removed unnecessary useMemo dependencies ([network]), since network is constant (fixes react-hooks/exhaustive-deps)
// - Filename/path toujours, matrix override!
export class Providers {
}