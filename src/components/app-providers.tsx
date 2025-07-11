'use client'

import React, { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { SolanaProvider as GillSolanaProvider } from 'gill-react'
import { createSolanaClient } from 'gill'
import WalletContextProvider from '@/components/wallet/WalletContextProvider'
import { ReactQueryProvider } from './query-client-provider'

const solanaClient = createSolanaClient({ urlOrMoniker: 'devnet' })

export function AppProviders({ children }: { children: ReactNode }) {
  return (
      <ReactQueryProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <WalletContextProvider>
            <GillSolanaProvider client={solanaClient}>
              {children}
            </GillSolanaProvider>
          </WalletContextProvider>
        </ThemeProvider>
      </ReactQueryProvider>
  )
}
