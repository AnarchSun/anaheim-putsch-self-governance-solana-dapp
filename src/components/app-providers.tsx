// src/components/app-providers.tsx
'use client'

import React, { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SolanaProvider as GillSolanaProvider } from 'gill-react'
import { createSolanaClient } from 'gill'

// Initialisation du client Solana
const solanaClient = createSolanaClient({ urlOrMoniker: 'devnet' })

// Création du QueryClient (idéalement memo ou singleton, mais ok ici)
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const url = queryKey[0]
        if (typeof url !== 'string') {
          throw new Error('queryKey[0] must be a string URL')
        }
        const res = await fetch(url)
        if (!res.ok) throw new Error('Failed to fetch ' + url)
        return res.json()
      },
      retry: false,
    },
  },
})


// Wrapper SolanaProvider (isole le client)
function SolanaProvider({ children }: { children: ReactNode }) {
  return (
    <GillSolanaProvider client={solanaClient}>
      {children}
    </GillSolanaProvider>
  )
}

// Provider principal combiné pour toute l'app
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SolanaProvider>
          {children}
        </SolanaProvider>
      </ThemeProvider>
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
