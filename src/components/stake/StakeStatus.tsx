// src/components/stake/StakeStatus.tsx
'use client'

import React from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useStakeActivationSafe } from '@/hooks/stake/getStakeActivationSafe'


export function StakeStatus() {
  const { connection } = useConnection()
  const { publicKey } = useWallet()

  const { state, loading } = useStakeActivationSafe(publicKey!, connection)

  if (loading) return <p>Chargement de l'état du stake...</p>
  if (!state) return <p>État du stake non disponible</p>

  return <p>État du stake : {state}</p>
}
