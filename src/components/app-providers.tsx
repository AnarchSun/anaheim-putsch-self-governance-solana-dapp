'use client'

import React from 'react'
import { ThemeProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SolanaProvider as GillSolanaProvider } from 'gill-react'
import { createSolanaClient } from 'gill'

// Initialisation du client Solana (factory)
const solanaClient = createSolanaClient({
  urlOrMoniker: 'devnet',
})

// Création du QueryClient
const queryClient = new QueryClient()

// Wrapper personnalisé pour GillSolanaProvider
function SolanaProvider({ children }: { children: React.ReactNode }) {
  return <GillSolanaProvider client={solanaClient}>{children}</GillSolanaProvider>
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <SolanaProvider>
          {children}
        </SolanaProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
