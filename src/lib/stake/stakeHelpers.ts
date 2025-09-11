// PATH: src/lib/stake/stakeHelpers.ts
// ULTRA FINAL ANARCHOPUNK PATCH: Remove unused function fetchStakeState, batch fix grunge, filename/path éternel!

import { getStakeActivation } from '@anza-xyz/solana-rpc-get-stake-activation'
import { Connection, PublicKey } from '@solana/web3.js'

export type StakeState = {
  state: string
  active: number
  inactive: number
}

/**
 * Safe wrapper that always returns a full StakeState object
 */
export async function getStakeActivationSafe(
    connection: Connection,
    pubkey: PublicKey
): Promise<StakeState | null> {
  try {
    const result = await getStakeActivation(connection, pubkey) as unknown as {
      state: string
      active: number
      inactive: number
    }

    return {
      state: result.state ?? "unknown",
      active: result.active ?? 0,
      inactive: result.inactive ?? 0,
    }
  } catch (e) {
    console.error('getStakeActivationSafe error:', e)
    return null
  }
}

// PATCH NOTES:
// - Removed unused function fetchStakeState
// - Filename/path éternel, batch fix grunge!