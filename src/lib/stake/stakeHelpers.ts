// FILE: src/lib/stakeHelpers.ts
import { getStakeActivation } from '@anza-xyz/solana-rpc-get-stake-activation'
import { Connection, PublicKey } from '@solana/web3.js'
import {useQuery} from "@tanstack/react-query";

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

/**
 * Fetch stake state from Solana RPC (returns StakeState object or null)
 */
export async function fetchStakeState(
    connection: Connection,
    pubkey: PublicKey
): Promise<StakeState> {
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
    console.error('fetchStakeState error:', e)
    return { state: "unknown", active: 0, inactive: 0 }
  }
}


