// src/components/WalletInfo.tsx
'use client'

import React from 'react'
import { useWalletUiAddress, useSolanaCluster } from '@/hooks/solana/useWallet'

export function WalletInfo() {
  const address = useWalletUiAddress()
  const cluster = useSolanaCluster()

  return (
    <div className="p-4 bg-gray-900 text-white rounded-md max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-2">Info Wallet</h2>
      <p><strong>Adresse du wallet :</strong> {address}</p>
      <p><strong>Cluster actuel :</strong> {cluster}</p>
    </div>
  )
}
