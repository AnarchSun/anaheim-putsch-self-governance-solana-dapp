// src/lib/stakeHelpers.ts
import { Connection, PublicKey } from '@solana/web3.js'
import { ExtendedConnection } from '@/lib/ExtendedConnection'
import { getStakeActivation } from '@/../../eco-subsystem/complementary-modules/getStakeActivation/js/src/stake'

export class getStakeActivationSafe {
  connection: Connection  // Now properly typed as Connection, ExtendedConnection is-a Connection
  pubkey: PublicKey
  state: string | null = null

  constructor(connection: Connection, pubkey: PublicKey, _pollInterval: number) {
    this.connection = connection
    this.pubkey = pubkey
    // pollInterval ignored for now but kept for interface compatibility
  }

  async fetch(): Promise<void> {
    const activation = new getStakeActivation(this.connection, this.pubkey, 'confirmed')
    await activation.fetch()
    this.state = (activation as any)?.state ?? null
  }
}

export async function fetchStakeState(pubkey: PublicKey): Promise<string | null> {
  try {
    // ExtendedConnection should be constructed with the RPC endpoint string (assuming your ExtendedConnection supports it)
    const connection = new ExtendedConnection('https://api.devnet.solana.com')

    const watcher = new getStakeActivationSafe(connection, pubkey, 1000)
    await watcher.fetch()
    return watcher.state
  } catch (e) {
    console.error('Error fetching stake activation:', e)
    return null
  }
}
