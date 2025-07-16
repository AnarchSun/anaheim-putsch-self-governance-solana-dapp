// File: src/components/app-providers.tsx
'use client'

import React, { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { SolanaProvider as GillSolanaProvider } from 'gill-react'
import { createSolanaClient } from 'gill'
import WalletContextProvider from '@/components/wallet/WalletContextProvider'
import { WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'

// ✅ Hardcoded MAINNET endpoint only
const endpoint = 'https://api.mainnet-beta.solana.com'

// ✅ Create a raw client
const rawClient = createSolanaClient({ urlOrMoniker: 'mainnet' })

// ✅ Patch fake requestAirdrop with valid .send() signature for TS compatibility
const dummyAirdrop = () => ({
    send: () => Promise.reject(new Error('requestAirdrop is not available on mainnet')),
})

// ✅ Full SolanaClient patched
const solanaClient = {
    ...rawClient,
    rpc: {
        ...rawClient.rpc,
        requestAirdrop: dummyAirdrop,
    },
} as typeof rawClient

// ✅ Query Client Setup
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

// ✅ Final export
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
