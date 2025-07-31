// File: src/lib/stakeHelpers.ts
import { getStakeActivation } from '@anza-xyz/solana-rpc-get-stake-activation'
import { Connection, PublicKey } from '@solana/web3.js'

export type StakeState = 'active' | 'inactive' | 'activating' | 'deactivating'

export async function getStakeActivationSafe(
    connection: Connection,
    pubkey: PublicKey
): Promise<StakeState | null> {
  try {
    const result = await getStakeActivation(connection, pubkey) as unknown as {
      state: StakeState
      active: number
      inactive: number
    }

    return result.state ?? null
  } catch (e) {
    console.error('getStakeActivationSafe error:', e)
    return null
  }
}


export async function fetchStakeState(connection: Connection, pubkey: PublicKey): Promise<StakeState | null> {
  try {
    const connection = new Connection('https://api.devnet.solana.com')

    // 👇 Forcer le typage si nécessaire
    const result = await getStakeActivation(connection, pubkey) as unknown as {
      state: StakeState
      active: number
      inactive: number
    }

    console.log('Stake state:', result.state)
    return result.state ?? null

  } catch (e) {
    console.error('fetchStakeState error:', e)
    return null
  }
}
