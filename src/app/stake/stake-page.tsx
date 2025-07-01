// src/app/stake/stake-page.tsx
import { getStakeActivationSafe } from '@/../../eco-subsystem/complementary-modules/getStakeActivation/js/src/stake'
import { Connection, PublicKey } from '@solana/web3.js'

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
