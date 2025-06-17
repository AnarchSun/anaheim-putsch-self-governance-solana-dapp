'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'

interface WalletContextType {
  address?: string
}

const WalletContext = createContext<WalletContextType | null>(null)

export function WalletProvider({ children }: { children: ReactNode }) {
  const { publicKey } = useWallet()
  const address = publicKey?.toBase58()

  return (
    <WalletContext.Provider value={{ address }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useSolanaWalletAddress(): string | undefined {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useSolanaWalletAddress must be used within a WalletProvider')
  }
  return context.address
}
