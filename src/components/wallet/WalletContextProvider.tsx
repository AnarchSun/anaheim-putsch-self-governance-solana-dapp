// src/components/wallet/WalletContextProvider.tsx
'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { WalletProvider as SolanaWalletProvider, useWallet } from '@solana/wallet-adapter-react'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'

const wallets = [new PhantomWalletAdapter()]

export function useSolanaWalletAddress(): string | undefined {
  const context = useContext(WalletContext)
  if (!context) {
    console.error('useSolanaWalletAddress must be used within a WalletProvider')
    throw new Error('useSolanaWalletAddress must be used within a WalletProvider')
  }
  console.log('Wallet Address:', context.address)
  return context.address
}

interface WalletContextType {
  address?: string
}

const WalletContext = createContext<WalletContextType | null>(null)

// Ton propre contexte pour exposer l'adresse au reste de l'app
export function WalletProvider({ children }: { children: ReactNode }) {
  const { publicKey } = useWallet()
  const address = publicKey?.toBase58()

  return (
    <WalletContext.Provider value={{ address }}>
      {children}
    </WalletContext.Provider>
  )
}

// Le provider global à utiliser en haut de ton arbre React (ex: dans src/app/layout.tsx)
export default function WalletContextProvider({ children }: { children: ReactNode }) {
  return (
    <SolanaWalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <WalletProvider>
          {children}
        </WalletProvider>
      </WalletModalProvider>
    </SolanaWalletProvider>
  )
}
