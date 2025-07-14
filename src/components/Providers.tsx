// src/components/Providers.tsx
'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { SolanaProvider } from '@/components/solana/solana-provider'
import React from 'react'
import { ReactQueryProvider } from './query-client-provider'

export function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <ReactQueryProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <SolanaProvider>{children}</SolanaProvider>
            </ThemeProvider>
        </ReactQueryProvider>
    )
}
