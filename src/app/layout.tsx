// File: src/app/layout.tsx
'use client'

import React from 'react'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const wallets = React.useMemo(() => [new PhantomWalletAdapter()], [])

    return (
        <html lang="en" className="dark">
        <body className="h-full bg-black text-white">
        <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <ConnectionProvider endpoint={endpoint}>
                    <WalletProvider wallets={wallets} autoConnect>
                        <WalletContextProvider>
                            <GillSolanaProvider client={solanaClient} queryClient={queryClient}>
                                <header style={{ padding: 16, borderBottom: '1px solid white' }}>
                                    <h1>Header visible</h1>
                                </header>
                                <main style={{ padding: 16 }}>{children}</main>
                            </GillSolanaProvider>
                        </WalletContextProvider>
                    </WalletProvider>
                </ConnectionProvider>
            </ThemeProvider>
        </QueryClientProvider>
        </body>
        </html>
    )
}
