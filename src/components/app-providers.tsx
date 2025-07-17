// FILE: src/components/app-providers.tsx
'use client';

import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';

// There is NO import from '@wallet-ui/react' here.

require('@solana/wallet-adapter-react-ui/styles.css');

if (typeof window !== 'undefined') {
    (BigInt.prototype as any).toJSON = function () {
        return this.toString();
    };
}

export function AppProviders({ children }: { children: React.ReactNode }) {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
        ],
        [network]
    );

    // --- DEBUGGING STEP ---
    // This will confirm in your browser's console that the wallet array is valid.
    // If this logs an empty array or undefined, that's the root cause.
    console.log('Wallets passed to WalletProvider:', wallets);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                {/*
          FIX: The structure is simplified back to the standard.
          There is no WalletUiProvider wrapper.
          The context from WalletProvider is used directly by all child components.
        */}
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}