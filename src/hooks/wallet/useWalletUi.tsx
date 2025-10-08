// src/hooks/wallet/useWalletUi.ts
'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useConnection } from '@solana/wallet-adapter-react'

export function useWalletUi() {
  const wallet = useWallet()
  const connection = useConnection()

  const address = wallet.publicKey?.toBase58() || null
  const cluster = connection?address || null: 'devnet'

  return {
    wallet,
    address,
    cluster,
  }
}
