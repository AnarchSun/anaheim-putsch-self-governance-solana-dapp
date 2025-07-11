// src/components/Providers.tsx
'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react'
import React from 'react'

// Configure ici tes clients et providers

export default function Providers({children}: { children: React.ReactNode }, queryClient: any, endpoint: any, wallets: any) {
    // configs (queryClient, wallets, endpoint...) restent ici
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <ConnectionProvider endpoint={endpoint}>
                    <WalletProvider wallets={wallets} autoConnect>
                        {children}
                    </WalletProvider>
                </ConnectionProvider>
            </ThemeProvider>
        </QueryClientProvider>
    )
}
