// src/app/stake/stake-page.tsx
import { getStakeActivationSafe } from '@/../../eco-subsystem/complementary-modules/getStakeActivation/js/src/stake'
import { StakeWatcher } from '@/components/stake/StakeWatcher'
import { DebugStakeStatus } from '@/hooks/stake/debugStakeStatus'
import { Connection, PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'

async function fetchStakeState(pubkey: PublicKey): Promise<any | null> {
  try {
    const connection = new Connection('https://api.devnet.solana.com')
    const watcher = new getStakeActivationSafe(connection, 10000, pubkey)
    await watcher.fetch()
    return watcher.state
  } catch (e) {
    console.error('Error fetching stake activation:', e)
    return null
  }
}

export default function StakePage() {
  const pubkey = new PublicKey('9xQeWvG816bUx9EPZ2gfrzjp1edw6uX7yjzFZZLL8Mjt')
  const [state, setState] = useState<string | null>(null)

  useEffect(() => {
    fetchStakeState(pubkey).then((result) => setState(result))
  }, [pubkey])

  return (
    <main>
      <div>
        <h1>État du stake : {state ?? 'chargement...'}</h1>
        {/* PAS DE connection passée en prop */}
        <StakeWatcher address="8RmTVazK1G3ZJ7EqYZC9FYJejFge98Vyz7T4zVdY8okX" />
      </div>
      <h2>Debug Stake</h2>
      <DebugStakeStatus />
    </main>
  )
}

