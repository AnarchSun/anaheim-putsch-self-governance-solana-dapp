// src/app/stake/stake-page.tsx
import { StakeWatcher } from '@/components/stake/StakeWatcher'
import { DebugStakeStatus } from '@/hooks/stake/debugStakeStatus'
import { useEffect, useState } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'
import { getStakeActivationSafe } from '@/lib/stakeHelpers' // adjust the path as needed

async function fetchStakeState(pubkey: PublicKey): Promise<string | null> {
  try {
    const connection = new Connection('https://api.devnet.solana.com') // use your endpoint here

    // Pass the required constructor args: connection, pubkey, and optionally pollInterval if needed
    const watcher = new getStakeActivationSafe(connection, pubkey, 1000) // pollInterval in ms

    await watcher.fetch()

    return watcher.state ?? null
  } catch (e) {
    console.error('Error fetching stake activation:', e)
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
      <div>
        <h1>État du stake : {state ?? 'chargement...'}</h1>
        <StakeWatcher address="8RmTVazK1G3ZJ7EqYZC9FYJejFge98Vyz7T4zVdY8okX" />
      </div>
      <h2>Debug Stake</h2>
      <DebugStakeStatus />
    </main>
  )
}
