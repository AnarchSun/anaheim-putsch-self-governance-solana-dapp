// src/components/stake/StakeStatus.tsx
'use client'

import React from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useStakeActivationSafe } from '@/hooks/stake/useStakeActivationSafe'

export function StakeStatus() {
  const { connection } = useConnection()
  const { publicKey } = useWallet()

  const { state, loading, error } = useStakeActivationSafe(publicKey!, connection)

  if (loading) return <p>Chargement de l'état du stake...</p>
  if (error) return <p>Erreur : {error.message}</p>
  if (!state) return <p>État du stake non disponible</p>

  return (
    <div className="text-sm text-white space-y-1">
      <p>État : {state.state}</p>
      <p>Actif : {state.active}</p>
      <p>Inactif : {state.inactive}</p>
    </div>
  )
}
