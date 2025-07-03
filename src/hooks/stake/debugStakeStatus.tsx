// src/hooks/stake/debugStakeStatus.tsx
import React from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useStakeActivation } from '@/hooks/stake/useStakeActivation'

export function DebugStakeStatus() {
  const { connection } = useConnection()
  const { publicKey } = useWallet()

  const { state, loading, error } = useStakeActivation(publicKey!, connection)

  if (loading) return <p>Chargement...</p>
  if (error) return <p>Erreur : {error.message}</p>
  if (!state) return <p>État indisponible</p>

  return <pre>{JSON.stringify(state, null, 2)}</pre>
}
