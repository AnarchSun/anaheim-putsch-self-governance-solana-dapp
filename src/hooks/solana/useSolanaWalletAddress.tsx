import React from 'react'
import { useSolanaWalletAddress as _useSolanaWalletAddress } from '@wallet-ui/react'

const useSolanaWalletAddress = _useSolanaWalletAddress as unknown as () => string | undefined

export function MonComposantMystique() {
  const walletAddress = useSolanaWalletAddress()

  return (
    <div>
      <p>Adresse mystique: {walletAddress ?? 'non connecté'}</p>
    </div>
  )
}
