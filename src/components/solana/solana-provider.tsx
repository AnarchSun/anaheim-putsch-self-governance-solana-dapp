// FILE: src/components/solana/solana-provider.tsx
// VERSION FINALE ET CORRECTE
'use client';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { SolflareWalletAdapter, PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo, type ReactNode } from 'react';

// N'oubliez pas d'importer les styles CSS du portefeuille !
require('@solana/wallet-adapter-react-ui/styles.css');

// Voici le composant que votre application essaie d'importer !
export function SolanaProvider({ children }: { children: ReactNode }) {
    // Choisissez le réseau : devnet, testnet, ou mainnet-beta
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    // Initialisez ici les portefeuilles que vous voulez supporter
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
        ],
        [network]
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