// src/app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import React from 'react'
import { AppProviders } from '@/components/app-providers'
import WalletContextProvider from '@/components/wallet/WalletContextProvider'  // <-- importer

export const metadata: Metadata = {
  title: 'Anaheim',
  description: 'Putsch dApp – Chaotic Fractal DAO',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
    <body>
    <AppProviders>
      <WalletContextProvider>
        {children}
      </WalletContextProvider>
    </AppProviders>
    </body>
    </html>
  )
}
