// src/components/app-providers.tsx
'use client'

import React, { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { SolanaProvider as GillSolanaProvider } from 'gill-react'
import { createSolanaClient } from 'gill'
import WalletContextProvider from '@/components/wallet/WalletContextProvider'

import { WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'

const network = WalletAdapterNetwork.Devnet
const endpoint = clusterApiUrl(network)
const solanaClient = createSolanaClient({ urlOrMoniker: 'devnet' })

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryFn: async ({ queryKey }: { queryKey: readonly unknown[] }) => {
                const url = queryKey[0]
                if (typeof url !== 'string') throw new Error('queryKey[0] doit être une URL string')
                const res = await fetch(url)
                if (!res.ok) throw new Error('Erreur fetch ' + url)
                return res.json()
            },
            retry: false,
        },
    },
})

export function AppProviders({ children }: { children: ReactNode }) {
    const wallets = React.useMemo(() => [new PhantomWalletAdapter()], [])

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <ConnectionProvider endpoint={endpoint}>
                    <WalletProvider wallets={wallets} autoConnect>
                        <WalletContextProvider>
                            <GillSolanaProvider client={solanaClient} queryClient={queryClient}>
                                {children}
                            </GillSolanaProvider>
                        </WalletContextProvider>
                    </WalletProvider>
                </ConnectionProvider>
            </ThemeProvider>
        </QueryClientProvider>
    )
}
