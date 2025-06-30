// src/components/app-providers.tsx
'use client'

import React, { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SolanaProvider as GillSolanaProvider } from 'gill-react'
import { createSolanaClient } from 'gill'
import WalletContextProvider from '@/components/wallet/WalletContextProvider'

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

const solanaClient = createSolanaClient({ urlOrMoniker: 'devnet' })

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <WalletContextProvider>
          <GillSolanaProvider client={solanaClient} queryClient={queryClient}>
            {children}
          </GillSolanaProvider>
        </WalletContextProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
