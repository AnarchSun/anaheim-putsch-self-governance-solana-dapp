// src/app/stake/stake-page.tsx
'use client'

import { Connection, PublicKey } from '@solana/web3.js'
import { getStakeActivationSafe } from '@/../../eco-subsystem/complementary-modules/getStakeActivation/js/src/stake'

interface Response extends Body {
  readonly headers: Headers
  readonly ok: boolean
  readonly redirected: boolean
  readonly status: number
  readonly statusText: string
  readonly type: ResponseType
  readonly url: string
  clone(): Response
}
// Chaîne base58, la forme sacrée de la clé publique
const pubkeyString = '9xQeWvG816bUx9EPZ2gfrzjp1edw6uX7yjzFZZLL8Mjt'

// Initialisation de l'entité PublicKey

// Tu dois recevoir connection et pubkey en paramètre

async function fetchStakeActivation(connection: Connection, pubkey: PublicKey, epoch?: number): Promise<any | null> {
  try {
    // instantiate with new!
    new getStakeActivationSafe ()
    // assume fetch() is an async method returning data
  } catch (e) {
    console.error('Error fetching stake activation:', e)
    return null
  }
}

export default function StakeStatus({ activation }: { activation: any }) {
  return (
    <div className="p-4 text-white">
      <h1 className="text-xl font-bold">Staking Status</h1>
      {activation ? (
        <pre className="mt-4 bg-gray-900 p-2 rounded">{JSON.stringify(activation, null, 2)}</pre>
      ) : (
        <p className="mt-2 text-sm text-gray-400">Loading…</p>
      )}
    </div>
  )
}
