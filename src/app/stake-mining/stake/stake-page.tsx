'use client'

import { StakeWatcher } from '@/components/stake/StakeWatcher'
import { DebugStakeStatus } from '@/hooks/stake/debugStakeStatus'
import { useEffect, useState } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'
import { getStakeActivationSafe } from '@/lib/stake/stakeHelpers'

const pubkey = new PublicKey('9xQeWvG816bUx9EPZ2gfrzjp1edw6uX7yjzFZZLL8Mjt')

export default function StakePage() {
  const [state, setState] = useState<string | null>(null)

  useEffect(() => {
    const connection = new Connection('https://api.devnet.solana.com')

    // Appelle direct ta fonction safe
    getStakeActivationSafe(connection, pubkey).then(setState)
  }, [])

  return (
      <main className="p-4">
        <h1 className="text-xl font-bold">État du Stake</h1>
        <p>Statut : {state ?? 'chargement...'}</p>
        <p>Actif : {state === 'active' ? 'Oui' : 'Non'}</p>
        <p>Inactif : {state === 'inactive' ? 'Oui' : 'Non'}</p>

        <div className="mt-4">
          <h2>Stake Watcher</h2>
          <StakeWatcher address="8RmTVazK1G3ZJ7EqYZC9FYJejFge98Vyz7T4zVdY8okX" />
        </div>

        <h2 className="mt-4">Debug Stake</h2>
        <DebugStakeStatus />
      </main>
  )
}
