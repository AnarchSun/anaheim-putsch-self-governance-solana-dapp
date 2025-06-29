'use client'

import React from 'react'
import {
  useSolanaWallet,
  useSolanaWalletAddress,
  useSolanaWalletCluster,
} from '@wallet-ui/react'

export const MonComposantMystique = () => {
  const wallet = useSolanaWallet()
  const walletAddressRef = new useSolanaWalletAddress()
  const walletClusterRef = new useSolanaWalletCluster()

  const walletAddress = walletAddressRef.current
  const walletCluster = walletClusterRef.current

  return (
    <div>
      {walletAddress ? (
        <p>Adresse mystique: {walletAddress}</p>
      ) : (
        <p>Adresse mystique: non connecté</p>
      )}
      <p>Wallet prêt: {wallet ? 'oui' : 'non'}</p>
      <p>Cluster sacré: {walletCluster ?? 'inconnu'}</p>
    </div>
  )
}
