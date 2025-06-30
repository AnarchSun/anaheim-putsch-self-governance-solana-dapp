// src/components/wallet/WalletInfo.tsx
'use client'

import React from 'react'
import {
  useSolanaWallet,
  useSolanaWalletAddress,
  useSolanaWalletCluster,
} from '@wallet-ui/react'

export default function WalletInfo() {
  const wallet = useSolanaWallet()
  const walletAddress = useSolanaWalletAddress()
  const walletCluster = useSolanaWalletCluster()

  // Toujours retourner un JSX valide, jamais un objet {}
  return (
    <div>
      {walletAddress ? (
        <p>Adresse mystique: {walletAddress}</p>
      ) : (
        <p>Adresse mystique: non connecté</p>
      )}
      <p>Wallet prêt: {wallet ? 'oui' : 'non'}</p>
      <p>Cluster sacré: {walletCluster && typeof walletCluster === 'string' ? walletCluster : 'inconnu'}</p>
    </div>
  )
}
