// src/components/solana/solana-provider.tsx
'use client'

import React, { useMemo } from 'react'
import {
    ConnectionProvider,
    WalletProvider
} from '@solana/wallet-adapter-react'
import {
    WalletModalProvider
} from '@solana/wallet-adapter-react-ui'
import {
    PhantomWalletAdapter,
    // ajoute d'autres adaptateurs si nécessaire
} from '@solana/wallet-adapter-wallets'

import { clusterApiUrl } from '@solana/web3.js'

import '@solana/wallet-adapter-react-ui/styles.css'

export function SolanaProvider({ children }: { children: React.ReactNode }) {
    const endpoint = useMemo(() => clusterApiUrl('devnet'), [])
    const wallets = useMemo(() => [new PhantomWalletAdapter()], [])

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}
