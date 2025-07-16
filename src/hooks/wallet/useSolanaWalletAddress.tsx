// src/hooks/solana/useSolanaWalletAddress.tsx
'use client'
import { useWallet } from '@solana/wallet-adapter-react'
import { useMemo } from 'react'

export function useSolanaWalletAddress(): string | null {
  const { publicKey } = useWallet()
  return useMemo(() => publicKey?.toBase58() ?? null, [publicKey])
}
