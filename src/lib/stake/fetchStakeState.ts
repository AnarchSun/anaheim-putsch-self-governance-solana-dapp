// File: src/lib/stake/fetchStakeState.ts
import { PublicKey } from '@solana/web3.js'
import { ExtendedConnection } from '@/lib/ExtendedConnection'
import { getStakeActivation } from '@/../../eco-subsystem/complementary-modules/getStakeActivation/js/src/stake'

export async function fetchStakeState(pubkey: PublicKey): Promise<string | null> {
  try {
    const connection = new ExtendedConnection('https://api.devnet.solana.com')
    const activation = new getStakeActivation(connection, pubkey, 'confirmed')
    await activation.fetch()
    const state = (activation as any)?.state ?? null
    return typeof state === 'string' ? state : null
  } catch (e) {
    console.error('Error fetching stake activation:', e)
    return null
  }
}
