// src/app/stake/page.tsx
import React from 'react'
import { StakeWatcher } from '@/components/stake/StakeWatcher'

export default function StakeDashboard() {
  const address = 'TonAdressePubliqueSolanaIci' // ou récupérée dynamiquement

  return (
    <div>
      <h1>Surveillance du Stake</h1>
      <StakeWatcher address={address} />
    </div>
  )
}
