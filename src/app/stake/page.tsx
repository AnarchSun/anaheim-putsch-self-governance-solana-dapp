// File: src/app/stake/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import { ExtendedConnection } from '@/lib/ExtendedConnection' // <-- your extended class with pubkey setter/getter
import { StakeWatcher } from '@/components/stake/StakeWatcher'
import { DebugStakeStatus } from '@/hooks/stake/debugStakeStatus'
import { getStakeActivation } from '@/../../eco-subsystem/complementary-modules/getStakeActivation/js/src/stake' // <-- your real getStakeActivation class

// This is the sacred function, invoked properly, no ghosts
async function fetchStakeState(pubkey: PublicKey): Promise<string | null> {
  try {
    // Use your ExtendedConnection to keep that signature clean
    const connection = new ExtendedConnection('https://api.devnet.solana.com')

    // Pass parameters in proper order: connection, pollInterval, pubkey
    const pollInterval = 10000 // 10 sec, adjustable as you see fit

    const activation = new getStakeActivation(connection, pollInterval, pubkey.toBase58())
    await activation.fetch()

    // Defensive: ensure state is string or null
    const state = (activation as any)?.state ?? null
    return typeof state === 'string' ? state : null
  } catch (e) {
    console.error('fetchStakeState error:', e)
    return null
  }
}

export default function StakePage() {
  const pubkey = new PublicKey('9xQeWvG816bUx9EPZ2gfrzjp1edw6uX7yjzFZZLL8Mjt')
  const [state, setState] = useState<string | null>(null)

  useEffect(() => {
    fetchStakeState(pubkey).then(setState)
  }, [pubkey])

  return (
    <main>
      <div className="p-4">
        <h1 className="text-xl font-bold">Stake Page</h1>
      </div>

      <div>
        <h1>État du stake : {state ?? 'chargement...'}</h1>
        <StakeWatcher address="8RmTVazK1G3ZJ7EqYZC9FYJejFge98Vyz7T4zVdY8okX" />
      </div>

      <h2>Debug Stake</h2>
      <DebugStakeStatus />
    </main>
  )
}
