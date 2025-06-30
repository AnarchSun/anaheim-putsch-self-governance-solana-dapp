// src/hooks/wallet/useWalletUi.ts
'use client'

import React from 'react'
import {
  useSolanaWallet,
  useSolanaWalletAddress,
  useSolanaWalletCluster,
} from '@wallet-ui/react'

export const MonComposantMystique: React.FC = () => {
  const wallet = useSolanaWallet()
  const walletAddress = useSolanaWalletAddress()
  const walletCluster = useSolanaWalletCluster()

  return (
    <div>
      {walletAddress ? (
        <p>Adresse mystique: {walletAddress}</p>
      ) : (
        <p>Adresse mystique: non connecté</p>
      )}
      <p>Wallet prêt: {wallet ? 'oui' : 'non'}</p>
      <p>Cluster sacré: {typeof walletCluster === 'string' && walletCluster.length > 0 ? walletCluster : 'inconnu'}</p>
    </div>
  )
}
